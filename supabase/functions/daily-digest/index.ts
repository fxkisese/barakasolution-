// daily-digest/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";
const WHATSAPP_ACCESS_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN") || "";
const ADMIN_PHONE = Deno.env.get("ADMIN_PHONE") || "254797624196"; // Client's phone number
const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID") || "";

serve(async (req) => {
    // We expect this to be triggered by a cron job (e.g. pg_cron or Supabase schedule)
    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Calculate time 24 hours ago
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const sinceStr = yesterday.toISOString();

        // 1. Gather Data
        const [
            { data: sales },
            { data: inquiries },
            { data: outOfStock }
        ] = await Promise.all([
            supabaseClient.from('sales').select('*').gte('created_at', sinceStr),
            supabaseClient.from('inquiries').select('*').gte('created_at', sinceStr),
            supabaseClient.from('products').select('*').eq('in_stock', false)
        ]);

        const rawData = {
            total_sales_count: sales?.length || 0,
            total_sales_value: sales?.reduce((acc, sale) => acc + (sale.amount || 0), 0) || 0,
            new_inquiries: inquiries?.length || 0,
            escalated_inquiries: inquiries?.filter(i => i.status === 'escalated').length || 0,
            out_of_stock_items: outOfStock?.map(p => p.name) || [],
        };

        // 2. Format with Gemini
        const systemPrompt = `
        You are an operations assistant for Luxe Craft Furniture.
        Summarize the following raw daily metrics into a concise, encouraging WhatsApp message for the store owner.
        Format it nicely with emojis. Do not use Markdown like ** as WhatsApp handles bold differently (*bold*), but keeping it simple without formatting is safer.
        Include total sales revenue in KSh, number of new inquiries, and a quick list of what's out of stock.
        Highlight if there are any escalated inquiries that need their attention.
        `;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: JSON.stringify(rawData) }] }],
                systemInstruction: { role: "system", parts: [{ text: systemPrompt }] }
            })
        });

        if (!geminiRes.ok) throw new Error("Failed to generate digest with Gemini");
        const geminiData = await geminiRes.json();
        const digestMessage = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Daily digest generated, but could not be parsed.";

        // 3. Send via WhatsApp API
        if (WHATSAPP_ACCESS_TOKEN && WHATSAPP_PHONE_ID) {
            await fetch(`https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messaging_product: "whatsapp",
                    to: ADMIN_PHONE,
                    text: { body: digestMessage },
                }),
            });
        } else {
            console.warn("WhatsApp credentials not set, digest generated but not sent.");
        }

        // 4. Log the digest
        await supabaseClient.from('digest_log').insert({
            channel: 'whatsapp',
            summary: rawData
        });

        return new Response(JSON.stringify({ success: true, message: digestMessage }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
});
