"use server";

import { createAdminClient } from "@/app/api/_lib/supabaseClient";

// Initialize Environment Variables based on image_ae5800.png
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL ||
    "https://openrouter.ai/api/v1";

const supabase = createAdminClient();

// --- OPENROUTER HELPER ---
async function callOpenRouter(prompt: string, modelName: string) {
    if (!OPENROUTER_API_KEY) {
        throw new Error("Missing OPENROUTER_API_KEY environment variable.");
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            // Optional but recommended by OpenRouter for ranking
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ||
                "http://localhost:3000",
            "X-Title": "Threshold Media Group (TMG)",
        },
        body: JSON.stringify({
            model: modelName,
            messages: [{ role: "user", content: prompt }],
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", errorText);
        throw new Error(
            `OpenRouter request failed with status ${response.status}`,
        );
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
}

// --- 1. PROMPT DEFINITIONS ---

const FREEMIUM_PROMPT = `
You are the lead geopolitical and economic editor for TMG (Threshold Media Group). 
Write the FREEMIUM WEEKLY DIGEST based on the provided article summaries.
Output MUST be perfectly formatted Markdown. Do NOT include a main title heading (like # TMG Weekly Digest), as the layout header handles it.

Tone & Style Guidelines:
- Write with a sharp, intelligent, and authoritative voice. 
- Avoid robotic or formulaic transitions. Every section should flow naturally into the next as a cohesive narrative.
- Maintain professional journalistic prose—serious, engaging, and clear without feeling heavy.
- **STRICT LINK RULE:** Never paste raw URLs into the text body. Every link must use descriptive markdown anchor text format, like this: [Read the full article](URL) or [Source Link](URL). Never output the raw URL string.
- STRICT IMAGE RULE: DO NOT ALTER OR REPLACE THE PROVIDED IMAGE URLS. Use them exactly as given in the source material.
Format structure:
**[Write a compelling, sophisticated subject line here]**

## OPENING NOTE
[Write a fluid 2-3 sentence paragraph introducing this week's overarching economic and strategic theme across West Africa.]

## SIGNAL OF THE WEEK
[Write a cohesive, narrative paragraph highlighting the single most important development of the week. Choose the most relevant article's Image URL and include it directly beneath using markdown: ![Article Image](Image URL)]

### [Main Article Title]
[Write a smooth, story-driven summary that captures the core insight rather than choppy bullet points.]
[Link]

## THIS WEEK ON TMG
[Briefly synthesize the remaining key articles into a smooth, connected paragraphs or clean sub-items with their links.]

## FROM THE PREMIUM DESK
[Write a compelling teaser highlighting deeper insights found in TMG Pro, without giving everything away.]

## WHAT TO WATCH NEXT
[A sharp concluding paragraph pointing to the key actor, trend, or policy shift to monitor next week.]

`;

const PERSONA_TEMPLATE = `
You are a senior intelligence analyst writing a specialized TMG briefing. 
Output MUST be perfectly formatted Markdown. Do NOT include a top-level document heading, start directly with the subject line below.

Tone & Style Guidelines:
- Speak directly to the persona's specific interests with high analytical depth.
- Avoid choppy slot-filling. Use smooth transitions so the briefing reads like a cohesive executive memo.

Format structure:
**SUBJECT LINE:** [Persona-specific subject line tied to the week's core signal]

## OPENING NOTE
[A sharp, natural-sounding opening paragraph (4 to 6 lines max) framing the week's stakes for this specific vertical.]

## KEY SIGNAL
[A cohesive narrative explaining the critical signal driving this sector this week. If applicable, integrate the primary article's image URL using markdown: ![Signal Image](Image URL)]

## WHAT HAPPENED
[Write a flowing analytical summary of the core events or reports this week, weaving facts and implications together naturally.]

## WHY IT MATTERS
[Deep strategic interpretation explaining what industry players must understand beyond the surface headlines.]

## WHAT TO WATCH NEXT
[A clear, forward-looking note on the primary actor, risk, or regulatory decision on the horizon.]

## RECOMMENDED READS
### [Article title]
[A concise, insightful one-line synthesis of the read]
[Link]

## CTA
- Read the full analysis
- Explore your vertical
- Save this briefing
- Manage your persona
`;

// Map out the personas based on your provided definitions
const PERSONAS = [
    {
        id: "mory",
        name: "Mory",
        role: "Governance & Reforms",
        instruction:
            `You are Mory, a sharp political analyst writing for TMG. Your tone is direct, incisive, and unsentimental. You cut through political noise and call things as they are. You cover governance, regulatory shifts, institutional architecture, electoral cycles. Write the weekly brief for your persona based ONLY on the provided articles.`,
    },
    {
        id: "kadiatou",
        name: "Kadiatou",
        role: "Mining & Local Communities",
        instruction:
            `You are Kadiatou, a field-level analyst writing for TMG. Your tone is precise and grounded. You write from the terrain, following local content enforcement, ESG, and community displacement. Write the weekly brief for your persona based ONLY on the provided articles.`,
    },
    {
        id: "ousmane",
        name: "Ousmane",
        role: "Finance & Trade",
        instruction:
            `You are Ousmane, a capital markets analyst writing for TMG. Your tone is calm, rigorous, and ahead of consensus. You watch debt markets, currency fluctuations, banking, and trade architecture. Write the weekly brief for your persona based ONLY on the provided articles.`,
    },
    {
        id: "fatoumata",
        name: "Fatoumata",
        role: "Society, Education & Health",
        instruction:
            `You are Fatoumata, a long-term structural analyst writing for TMG. Your tone is warm but rigorous. You write about the human infrastructure behind economic growth. Write the weekly brief for your persona based ONLY on the provided articles.`,
    },
    {
        id: "sekou",
        name: "Sekou",
        role: "Data Journalism",
        instruction:
            `You are Sekou, a data journalist writing for TMG. Your tone is methodical, skeptical, and transparent. You cross-reference datasets and track revisions. Write the weekly brief for your persona based ONLY on the provided articles.`,
    },
    {
        id: "aicha",
        name: "Aïcha",
        role: "Diplomacy & ECOWAS",
        instruction:
            `You are Aïcha, a regional geopolitical analyst writing for TMG. Your tone is measured, informed, and deeply contextual. You follow bilateral agreements, multilateral negotiations, and ECOWAS dynamics. Write the weekly brief for your persona based ONLY on the provided articles.`,
    },
];

// --- 2. MAIN GENERATOR FUNCTION ---
// Utility function to pause execution and respect API rate limits
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateAndSaveNewsletter(
    articles: any[],
    isPremium: boolean,
) {
    // 1. Format the articles using their summaries/excerpts instead of raw content blocks
    const sourceMaterial = articles.map((item, index) => {
        const post = item.post;

        // Prioritize ACF summary field, fallback to WP excerpt or short text clip
        const summaryText = post.acf?.summary ||
            post.summary ||
            post.excerpt?.rendered?.replace(/<[^>]*>?/gm, "") ||
            post.content?.rendered?.substring(0, 400) || "";
        const imageUrl =
            post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
            "/images/homepage/home4.png";
        return `
    --- ARTICLE ${index + 1} ---
    Title: ${post.title?.rendered || post.title}
    Link: ${item.originalUrl}
    Image URL: ${imageUrl}
    Summary: ${summaryText}
    `;
    }).join("\n\n");

    let freemiumMarkdown: string | null = null;
    let personaContentObj: Record<string, string> | null = null;

    try {
        if (!isPremium) {
            // --- FREEMIUM WORKFLOW ---
            console.log("Generating Freemium content from summaries...");
            const prompt =
                `${FREEMIUM_PROMPT}\n\nSOURCE MATERIAL:\n${sourceMaterial}`;

            freemiumMarkdown = await callOpenRouter(
                prompt,
                "google/gemini-2.5-flash",
            );

            if (!freemiumMarkdown) {
                throw new Error(
                    "Missing AI response text for Freemium generation.",
                );
            }
        } else {
            // --- PREMIUM WORKFLOW ---
            console.log(
                "Generating Premium Persona contents sequentially from summaries...",
            );
            personaContentObj = {};

            for (const persona of PERSONAS) {
                console.log(`Generating content for ${persona.name}...`);

                const prompt =
                    `${persona.instruction}\n\n${PERSONA_TEMPLATE}\n\nSOURCE MATERIAL:\n${sourceMaterial}`;

                const text = await callOpenRouter(
                    prompt,
                    "google/gemini-2.5-flash-lite",
                );

                if (!text) {
                    throw new Error(
                        `Missing AI response text for persona ${persona.id}`,
                    );
                }

                personaContentObj[persona.id] = text;

                // Add a 5-second delay between calls to avoid hitting rate limits
                await delay(5000);
            }
        }

        // 3. Calculate next week's date for 'scheduled_for'
        const today = new Date();
        const nextSunday =
            new Date(today.setDate(today.getDate() + (7 - today.getDay())))
                .toISOString().split("T")[0];

        // 4. Save to Supabase matching your SQL schema
        const { data: insertedDraft, error } = await supabase
            .from("newsletter_drafts")
            .insert({
                scheduled_for: nextSunday,
                status: "draft",
                freemium_content: freemiumMarkdown,
                persona_content: personaContentObj,
            })
            .select("id")
            .single();

        if (error) {
            console.error("Supabase Insert Error:", error);
            throw new Error("Failed to save draft to database");
        }

        // 5. Return the newly minted draft ID and payload to the frontend
        return {
            id: insertedDraft.id,
            freemium_content: freemiumMarkdown,
            persona_content: personaContentObj,
        };
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate newsletter content");
    }
}
