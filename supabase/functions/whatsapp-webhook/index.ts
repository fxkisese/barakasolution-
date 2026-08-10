// whatsapp-webhook/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { askGemini } from "../_shared/ai-respond.ts"

const VERIFY_TOKEN = Deno.env.get("WHATSAPP_VERIFY_TOKEN") || "secret_token_baraka";
const WHATSAPP_ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN") || "";

serve(async (req) => {
    const url = new URL(req.url);
    const method = req.method;

    // 1. Webhook Verification (Meta requires this when setting up the webhook)
    if (method === "GET") {
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");

        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            return new Response(challenge, { status: 200 });
        }
        return new Response("Forbidden", { status: 403 });
    }

    // 2. Handle incoming messages (POST)
    if (method === "POST") {
        try {
            const body = await req.json();

            // WhatsApp sends messages in a specific deeply nested format
            if (body.object !== "whatsapp_business_account") {
                return new Response("Not a WhatsApp event", { status: 404 });
            }

            const entry = body.entry?.[0];
            const change = entry?.changes?.[0]?.value;
            const messages = change?.messages;

            // If there's no message (e.g. it's a status update like 'delivered'/'read'), just acknowledge
            if (!messages || messages.length === 0) {
                return new Response("EVENT_RECEIVED", { status: 200 });
            }

            const messageObj = messages[0];
            const senderPhone = messageObj.from;
            const messageText = messageObj.text?.body;
            const senderName = change?.contacts?.[0]?.profile?.name || "WhatsApp User";
            const phoneNumberId = change?.metadata?.phone_number_id;

            if (!messageText) {
                return new Response("EVENT_RECEIVED", { status: 200 }); // We only handle text messages for now
            }

            const supabaseClient = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            );

            // Save inquiry to database
            const { data: inquiry, error: inquiryError } = await supabaseClient
                .from('inquiries')
                .insert({
                    source: 'whatsapp',
                    customer_name: senderName,
                    customer_contact: senderPhone,
                    message: messageText,
                    status: 'new'
                })
                .select()
                .single();

            if (inquiryError) throw inquiryError;

            // Context for AI
            const context = `
            Store Name: Luxe Craft Furniture (Baraka Furniture)
            Location: Nairobi, Kenya
            Contact: +254 797 624 196
            Opening Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM, Sun Closed.
            General Policy: Delivery within Nairobi is KSh 600. Delivery outside Nairobi varies by region.
            Standard stock items: Sofas, Beds, Dining Sets, Office Desks.
            Custom orders: We accept custom orders, but pricing and timeframes must be discussed with our team directly.
            `;

            // Query Gemini
            const aiResponse = await askGemini(messageText, context);
            const { confidence, reply, reason_if_low } = aiResponse;

            // Function to send WhatsApp reply back to customer
            const sendWhatsAppReply = async (text: string) => {
                if (!WHATSAPP_ACCESS_TOKEN) {
                    console.warn("WHATSAPP_ACCESS_TOKEN is missing. Cannot send message.");
                    return;
                }
                await fetch(`https://graph.facebook.com/v17.0/${phoneNumberId}/messages`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        to: senderPhone,
                        text: { body: text },
                    }),
                });
            };

            // Branch based on confidence
            if (confidence === 'high') {
                // High confidence -> Auto-handled
                await supabaseClient.from('ai_conversations').insert({
                    inquiry_id: inquiry.id,
                    ai_reply: reply,
                    confidence: 'high',
                    auto_sent: true
                });

                await supabaseClient.from('inquiries').update({ status: 'auto_handled' }).eq('id', inquiry.id);
                
                // Fire off the reply via WhatsApp API
                await sendWhatsAppReply(reply);

            } else {
                // Low confidence -> Escalate
                await supabaseClient.from('ai_conversations').insert({
                    inquiry_id: inquiry.id,
                    ai_reply: reply,
                    confidence: 'low',
                    reason_if_low: reason_if_low,
                    auto_sent: false
                });

                await supabaseClient.from('escalations').insert({
                    inquiry_id: inquiry.id,
                    ai_draft_reply: reply
                });

                await supabaseClient.from('inquiries').update({ status: 'escalated' }).eq('id', inquiry.id);
                
                // Let the customer know we are looking into it
                await sendWhatsAppReply("Thanks for reaching out! A member of our team will review your inquiry and get back to you shortly.");
            }

            return new Response("EVENT_RECEIVED", { status: 200 });

        } catch (error) {
            console.error(error);
            return new Response(JSON.stringify({ error: error.message }), { status: 500 });
        }
    }

    return new Response("Method Not Allowed", { status: 405 });
});
