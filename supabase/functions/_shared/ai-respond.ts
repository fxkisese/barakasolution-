// _shared/ai-respond.ts

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

export async function askGemini(message: string, context: string) {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set.");
    }

    const systemPrompt = `
You are the AI Customer Care agent for Baraka Furniture (Luxe Craft Furniture), a design decoration store in Nairobi, Kenya.

Context:
${context}

Instructions:
1. Answer the customer's inquiry using ONLY the provided context. Do not invent pricing, stock, or policy details.
2. Return your response in STRICT JSON format matching the schema below. Do not use Markdown blocks (\`\`\`json) or extra text outside the JSON.
3. Determine confidence:
   - "high": The answer is fully covered by the context (e.g. standard pricing, hours, location).
   - "low": The inquiry involves custom dimensions, quotes, bulk/wholesale pricing, complaints, emotionally charged language, missing/ambiguous product references, or anything not in the context.

Response JSON Schema:
{
  "confidence": "high" | "low",
  "reply": "Your response to the customer",
  "reason_if_low": "Explanation of why confidence is low (or null if high)"
}
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [{
                role: "user",
                parts: [{ text: message }]
            }],
            systemInstruction: {
                role: "system",
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                responseMimeType: "application/json"
            }
        }),
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${text}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    
    try {
        return JSON.parse(resultText);
    } catch (err) {
        // Fallback to low confidence if parsing fails
        return {
            confidence: "low",
            reply: "",
            reason_if_low: "Failed to parse JSON from AI: " + err.message
        };
    }
}
