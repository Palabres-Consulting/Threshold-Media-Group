import { createSupabaseServer } from "./supabaseClient";

export async function determineUserTier(userId: string): Promise<string> {
    const supabase = await createSupabaseServer();

    const { data: subscription, error } = await supabase
        .from("Subscriptions") // Explicit matching of the casing in image_afb0fc.png
        .select("status, price_id")
        .eq("user_id", userId)
        .in("status", ["active", "trialing"])
        .maybeSingle();

    if (error || !subscription) {
        return "Freemium"; // Default fall-through state from image_bcdb85.png
    }

    // Map your payment portal Price IDs directly to your visual tier names
    switch (subscription.price_id) {
        case process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_INDIVIDUAL:
            return "TMG Pro Individual";
        case process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_BUSINESS:
            return "TMG Pro Business";
        default:
            return "Freemium";
    }
}
