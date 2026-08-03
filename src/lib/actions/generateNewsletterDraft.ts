"use server";

import { createAdminClient } from "@/app/api/_lib/supabaseClient";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

const supabase = createAdminClient();

function getArticleImageUrl(item: any): string {
    const post = item?.post || item;
    return (
        post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        post?.yoast_head_json?.og_image?.[0]?.url ||
        post?.jetpack_featured_media_url ||
        post?.featured_media_url ||
        post?.featured_image_url ||
        ""
    );
}

async function callOpenRouter(prompt: string, modelName: string) {
    if (!OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY environment variable.");

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": "Threshold Media Group (TMG)",
        },
        body: JSON.stringify({
            model: modelName,
            response_format: { type: "json_object" },
            messages: [{ role: "user", content: prompt }],
        }),
    });

    if (!response.ok) throw new Error(`OpenRouter request failed with status ${response.status}`);
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
}

const FREEMIUM_PROMPT = `
You are the lead editor for TMG (Threshold Media Group). 
Write the FREEMIUM WEEKLY DIGEST based on the provided articles.

CRITICAL CONSTRAINT: The combined text of all fields below MUST NOT exceed 100 words. Be extremely concise, punchy, and direct.

Output MUST be valid JSON matching this exact structure:
{
  "subject": "[Compelling email subject line]",
  "headline": "[Short, punchy main headline]",
  "openingNote": "[1-2 sentence opening note]",
  "signal_title": "[Headline for the Signal of the Week]",
  "signal_category": "[e.g., EXTRACTION, FINANCE, GEOPOLITICS]",
  "signal_content": "[1 brief paragraph summarizing the primary signal]",
  "signal_whyItMatters": "Why it matters: [1 short sentence detailing the strategic interpretation]",
  "signal_conclusion": "[A brief final sentence to conclude the analysis]"
}

STRICT RULES:
1. Do NOT output raw URLs.
2. Output MUST be strictly valid JSON.
`;

const PERSONAS = [
    { id: "mory", name: "Mory", role: "Governance & Reforms", instruction: `You are Mory, a sharp political analyst writing for TMG. Your tone is direct, incisive, and unsentimental. You cover governance, regulatory shifts, institutional architecture, electoral cycles. Write the weekly brief for your persona based ONLY on the provided articles.` },
    { id: "kadiatou", name: "Kadiatou", role: "Mining & Local Communities", instruction: `You are Kadiatou, a field-level analyst writing for TMG. Your tone is precise and grounded. You write from the terrain, following local content enforcement, ESG, and community displacement. Write the weekly brief for your persona based ONLY on the provided articles.` },
    { id: "ousmane", name: "Ousmane", role: "Finance & Trade", instruction: `You are Ousmane, a capital markets analyst writing for TMG. Your tone is calm, rigorous, and ahead of consensus. You watch debt markets, currency fluctuations, banking, and trade architecture. Write the weekly brief for your persona based ONLY on the provided articles.` },
    { id: "fatoumata", name: "Fatoumata", role: "Society, Education & Health", instruction: `You are Fatoumata, a long-term structural analyst writing for TMG. Your tone is warm but rigorous. You write about the human infrastructure behind economic growth. Write the weekly brief for your persona based ONLY on the provided articles.` },
    { id: "sekou", name: "Sekou", role: "Data Journalism", instruction: `You are Sekou, a data journalist writing for TMG. Your tone is methodical, skeptical, and transparent. You cross-reference datasets and track revisions. Write the weekly brief for your persona based ONLY on the provided articles.` },
    { id: "aicha", name: "Aïcha", role: "Diplomacy & ECOWAS", instruction: `You are Aïcha, a regional geopolitical analyst writing for TMG. Your tone is measured, informed, and deeply contextual. You follow bilateral agreements, multilateral negotiations, and ECOWAS dynamics. Write the weekly brief for your persona based ONLY on the provided articles.` },
];

const PERSONA_TEMPLATE = `
CRITICAL CONSTRAINT: The combined text of all fields below MUST NOT exceed 100 words. Be extremely concise.

Output MUST be valid JSON matching this exact structure:
{
  "subject": "[Persona specific subject line]",
  "headline": "[Persona specific main headline]",
  "openingNote": "[1-2 sentence paragraph in the persona's voice.]",
  "signal_title": "[The most important signal of the week for this persona]",
  "signal_category": "[e.g., GOVERNANCE, MINING, DIPLOMACY]",
  "signal_content": "[Fact or article summary]",
  "signal_whyItMatters": "Why it matters: [Strategic interpretation]",
  "signal_conclusion": "[A brief final concluding thought in persona]"
}
`;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateAndSaveNewsletter(articles: any[], isPremium: boolean) {
    const sourceMaterial = articles.map((item, index) => `
    --- ARTICLE ${index + 1} ---
    Title: ${item.post.title?.rendered || item.post.title}
    Content Snippet: ${item.post.content?.rendered?.substring(0, 3000) || item.post.excerpt?.rendered || ""} 
  `).join("\n\n");

    let freemiumData: any = null;
    let personaContentObj: Record<string, any> = {};

    const leadArticle = articles[0];
    const hardcodedImageUrl = leadArticle ? getArticleImageUrl(leadArticle) : "";
    const hardcodedArticleUrl = leadArticle ? leadArticle.originalUrl : "";

    try {
        if (!isPremium) {
            const prompt = `${FREEMIUM_PROMPT}\n\nSOURCE MATERIAL:\n${sourceMaterial}`;
            const responseText = await callOpenRouter(prompt, "google/gemini-2.5-flash");

            try {
                freemiumData = JSON.parse(responseText);
                freemiumData.signal_imageUrl = hardcodedImageUrl;
                freemiumData.signal_articleUrl = hardcodedArticleUrl;
            } catch (e) {
                throw new Error("AI did not return valid JSON for Freemium.");
            }
        } else {
            for (const persona of PERSONAS) {
                const prompt = `${persona.instruction}\n\n${PERSONA_TEMPLATE}\n\nSOURCE MATERIAL:\n${sourceMaterial}`;
                const responseText = await callOpenRouter(prompt, "google/gemini-2.5-flash-lite");

                try {
                    const parsedPersona = JSON.parse(responseText);
                    parsedPersona.signal_imageUrl = hardcodedImageUrl;
                    parsedPersona.signal_articleUrl = hardcodedArticleUrl;
                    personaContentObj[persona.id] = parsedPersona;
                } catch (e) {
                    throw new Error(`AI did not return valid JSON for ${persona.id}`);
                }
                await delay(5000);
            }
        }

        const today = new Date();
        const nextSunday = new Date(today.setDate(today.getDate() + (7 - today.getDay()))).toISOString().split("T")[0];

        const { data: insertedDraft, error } = await supabase
            .from("newsletter_drafts")
            .insert({
                scheduled_for: nextSunday,
                status: "draft",
                freemium_content: freemiumData,
                persona_content: personaContentObj,
            })
            .select("id")
            .single();

        if (error) throw new Error("Failed to save draft to database");

        return {
            id: insertedDraft.id,
            freemium_content: freemiumData,
            persona_content: personaContentObj,
        };
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate newsletter content");
    }
}