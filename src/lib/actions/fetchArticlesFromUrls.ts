import { fetchPostById } from "@/app/helpers/fetchLib";

// Action 1: Parse URLs and Fetch Data
export async function fetchArticlesFromUrls(urls: string[]) {
    const fetchPromises = urls.map(async (url) => {
        if (!url.trim()) return null;

        try {
            const urlObj = new URL(url);
            const idStr = urlObj.searchParams.get("id");
            const typeStr = urlObj.searchParams.get("type") as
                | "innovation"
                | "posts"
                | "extraction"
                | "asint";

            if (!idStr || !typeStr) throw new Error("Invalid URL parameters");

            const post = await fetchPostById(typeStr, parseInt(idStr), "en"); // Hardcoded to English for MVP
            
            if (!post) return null;

            // Securely bind the original website URL to the WordPress data
            return {
                post: post,
                originalUrl: url
            };

        } catch (error) {
            console.error("Failed to parse or fetch URL:", url, error);
            return null;
        }
    });

    const results = await Promise.all(fetchPromises);

    // Filter out any nulls from failed fetches
    return results.filter((result) => result !== null); 
}






// Action 3: Generate AI Content & Save to Supabase
export async function generateAndSaveNewsletter(
    articles: any[],
    isPremium: boolean,
) {
    // 1. AI Generation Logic goes here using your mega-prompt
    // const generatedDraft = await generateNewsletterDraft(articles, isPremium);

    // 2. Supabase Insert Logic goes here
    // const { data, error } = await supabase.from('newsletter_drafts').insert({...}).select().single();

    // 3. Return the new draft ID
    // return data.id;

    // Mocking a delay and returning a fake ID for UI building
    await new Promise((res) => setTimeout(res, 2000));
    return `draft_${Math.random().toString(36).substr(2, 9)}`;
}


