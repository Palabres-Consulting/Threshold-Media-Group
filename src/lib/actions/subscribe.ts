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

    // Call the unified database engine
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

    if (user.email) await newsletterService.subscribe(user.email);
    // Refresh UI
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
