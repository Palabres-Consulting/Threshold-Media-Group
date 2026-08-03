"use server";

import { createAdminClient } from "@/app/api/_lib/supabaseClient";

// 1. Update Draft (Save Draft or Approve)
export async function updateNewsletterDraft(
  draftId: string, 
  status: "draft" | "approved", 
  payload: { freemium_content?: string; persona_content?: Record<string, string> }
) {
  const supabase = createAdminClient();
  // const user = await supabase.auth.getUser();

  // const subCheck = await supabase.from("subscriptions").select("*").eq("user_id", user.data.user?.id).single();



  const { error } = await supabase
    .from("newsletter_drafts")
    .update({
      status: status,
      freemium_content: payload.freemium_content,
      persona_content: payload.persona_content,
    //   updated_at: new Date().toISOString(), // Assuming you have an updated_at column
    })
    .eq("id", draftId);

  if (error) {
    console.error("Supabase update error:", error);
    throw new Error("Failed to update the newsletter draft in the database.");
  }

  return { success: true };
}

// 2. Publish to Mailchimp & Update Status
export async function publishNewsletterDraft(
  draftId: string, 
  payload: { freemium_content?: string; persona_content?: Record<string, string> }
) {
  const supabase = createAdminClient();

  try {
    /* 
      ======================================================
      MAILCHIMP API LOGIC GOES HERE
      ======================================================
      Example Workflow:
      1. Create Campaign: POST https://<dc>.api.mailchimp.com/3.0/campaigns
      2. Set Content: PUT https://<dc>.api.mailchimp.com/3.0/campaigns/{campaign_id}/content
         (Passing payload.freemium_content converted to HTML)
      3. Send: POST https://<dc>.api.mailchimp.com/3.0/campaigns/{campaign_id}/actions/send
    */
    
    // Simulate API delay for now
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // After successful Mailchimp dispatch, mark as published in Supabase
    const { error } = await supabase
      .from("newsletter_drafts")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
      })
      .eq("id", draftId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Publishing failed:", error);
    throw new Error(error.message || "Failed to publish newsletter via Mailchimp.");
  }
}



export async function fetchDraftsFromDB() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("newsletter_drafts")
    .select("id, status, created_at") // Add any other columns your NewsletterDraft type needs
    .order("created_at", { ascending: false })
    .limit(10); // Limit to recent items for the sidebar

  if (error) {
    console.error("Supabase fetch drafts error:", error);
    return []; // Return empty array on failure so UI doesn't crash
  }

  // Map database properties (snake_case) to standard frontend properties (camelCase)
  return data.map((item) => ({
    ...item,
    id: item.id,
    createdAt: item.created_at, 
  }));
}


export async function fetchDraftByIdFromDB(draftId: string) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("newsletter_drafts")
    .select("*")
    .eq("id", draftId)
    .single();

  if (error || !data) {
    console.error("Supabase single draft fetch error:", error);
    return null;
  }

  return {
    ...data,
    createdAt: data.created_at,
    // updatedAt: data.updated_at,
  };
}