// handle-inquiry/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import { askGemini } from "../_shared/ai-respond.ts"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const { source, customer_name, customer_contact, message } = await req.json();

        if (!source || !customer_contact || !message) {
            throw new Error("Missing required fields: source, customer_contact, message");
        }

        // 1. Insert raw inquiry
        const { data: inquiry, error: inquiryError } = await supabaseClient
            .from('inquiries')
            .insert({
                source,
                customer_name,
                customer_contact,
                message,
                status: 'new'
            })
            .select()
            .single();

        if (inquiryError) throw inquiryError;

        // 2. Fetch context (For this demo, we use a static context block. 
        // In a full implementation, you would query the 'products' table for catalog/pricing info).
        const context = `
        Store Name: Luxe Craft Furniture (Baraka Furniture)
        Location: Nairobi, Kenya
        Contact: +254 797 624 196
        Opening Hours: Mon-Fri 9AM-6PM, Sat 10AM-4PM, Sun Closed.
        General Policy: Delivery within Nairobi is KSh 600. Delivery outside Nairobi varies by region.
        Standard stock items: Sofas, Beds, Dining Sets, Office Desks.
        Custom orders: We accept custom orders, but pricing and timeframes must be discussed with our team directly.
        `;

        // 3. Ask Gemini AI
        const aiResponse = await askGemini(message, context);
        const { confidence, reply, reason_if_low } = aiResponse;

        // 4. Branch based on confidence
        if (confidence === 'high') {
            // High confidence -> Auto-handled
            // (Note: For a website form, we might send the reply back immediately as the HTTP response,
            // or trigger an email. For this script, we just log it as auto_handled).
            
            await supabaseClient.from('ai_conversations').insert({
                inquiry_id: inquiry.id,
                ai_reply: reply,
                confidence: 'high',
                auto_sent: true
            });

            await supabaseClient.from('inquiries')
                .update({ status: 'auto_handled' })
                .eq('id', inquiry.id);

            return new Response(JSON.stringify({ 
                success: true, 
                inquiry_id: inquiry.id,
                ai_reply: reply, // return it to the frontend to show to the user instantly
                status: 'auto_handled'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });

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

            await supabaseClient.from('inquiries')
                .update({ status: 'escalated' })
                .eq('id', inquiry.id);

            return new Response(JSON.stringify({
                success: true,
                inquiry_id: inquiry.id,
                status: 'escalated',
                message: 'Your inquiry has been escalated to our team. We will get back to you shortly.'
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
