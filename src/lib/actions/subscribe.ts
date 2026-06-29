"use server";

import {
    createAdminClient,
    createServerSupabaseClient,
} from "@/app/api/_lib/supabaseClient";
import { revalidatePath } from "next/cache";
import { newsletterService } from "./newsletter";

export async function activateFreemiumTier() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "You must be logged in." };
    }

    // 1. Call the unified database engine
    const { data, error } = await supabase.rpc(
        "activate_freemium_subscription",
        {
            p_user_id: user.id,
        },
    );

    if (error || !data.success) {
        console.error("[FREEMIUM_ACTION_ERROR]", error || data.error);
        return {
            success: false,
            error: data?.error || "Failed to process subscription.",
        };
    }

    // 2. Fetch the profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("persona, interests")
        .eq("id", user.id)
        .single();

    // 3. Prepare data
    // Use persona if it exists, else 'General'. Default interests to empty array.
    const persona = profile?.persona || "General";
    const interests = profile?.interests || [];

    // 4. Sync with Mailchimp
    if (user.email) {
        await newsletterService.subscribe(user.email, interests, persona);
    }

    revalidatePath("/");
    return { success: true };
}

export async function cancelSubscription() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    // Call the database function directly
    const { data, error } = await supabase.rpc("cancel_subscription", {
        p_user_id: user.id,
        p_reason: "User initiated cancellation from dashboard",
    });

    if (error || !data.success) {
        console.error("RPC Cancellation Failed:", error || data.error);
        return { success: false, error: error?.message || data.error };
    }

    if (user.email) await newsletterService.unsubscribe(user.email);

    return { success: true };
}
