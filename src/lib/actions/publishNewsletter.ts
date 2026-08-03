"use server";

import mailchimp from "@mailchimp/mailchimp_marketing";

// Assuming you already have this config somewhere in your lib
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER, // e.g., "us14"
});

const LIST_ID = process.env.MAILCHIMP_AUDIENCE_ID!;

// Map your Next.js persona IDs to your Mailchimp Segment IDs
const PERSONA_SEGMENTS: Record<string, number> = {
  mory: Number(process.env.MAILCHIMP_SEGMENT_MORY),
  kadiatou: Number(process.env.MAILCHIMP_SEGMENT_KADIATOU),
  ousmane: Number(process.env.MAILCHIMP_SEGMENT_OUSMANE),
  fatoumata: Number(process.env.MAILCHIMP_SEGMENT_FATOUMATA),
  sekou: Number(process.env.MAILCHIMP_SEGMENT_SEKOU),
  aicha: Number(process.env.MAILCHIMP_SEGMENT_AICHA),
};

// Helper function to create and send a single campaign
async function createAndSendCampaign(
    subject: string, 
    htmlContent: string, 
    segmentId?: number
) {
  // 1. Define recipients. If no segmentId is provided, it goes to the whole list.
  const recipients: any = { list_id: LIST_ID };
  if (segmentId) {
    recipients.segment_opts = { saved_segment_id: segmentId };
  }

  // 2. Create the Campaign Shell
  const campaign = await mailchimp.campaigns.create({
    type: "regular",
    recipients: recipients,
    settings: {
      subject_line: subject,
      reply_to: "editorial@thresholdmedia.group", // Update this
      from_name: "Threshold Media Group",
    },
  });
  
  // Ensure the SDK returned a campaign object with an id (it may return an ErrorResponse)
  if (!campaign || typeof (campaign as any).id !== "string") {
    // Bubble up useful information when creation fails
    throw new Error(`Mailchimp campaign creation failed: ${JSON.stringify(campaign)}`);
  }

  const campaignId = (campaign as any).id as string;

  // 3. Inject the HTML directly into the Campaign (No marked parsing!)
  await mailchimp.campaigns.setContent(campaignId, {
    html: htmlContent, 
  });

  // 4. Send the Campaign
  // Note: Change this to mailchimp.campaigns.schedule(campaignId, { schedule_time }) if you want to schedule it instead
  await mailchimp.campaigns.send(campaignId);
  
  return campaignId;
}

export async function publishNewsletter(
    publishType: "freemium" | "persona", 
    subjectLine: string,
    contentPayload: string | Record<string, string> // Expects HTML strings here
) {
  try {
    if (publishType === "freemium") {
      // PATH A: General Release (Broadcast to everyone)
      if (typeof contentPayload !== "string") throw new Error("Freemium expects a single HTML string");
      
      console.log("Publishing Freemium broadcast to entire audience...");

      await createAndSendCampaign(subjectLine, contentPayload);
      
    } else if (publishType === "persona") {
      // PATH B: Personalized Release
      if (typeof contentPayload !== "object") throw new Error("Persona expects a mapped object of HTML strings");
      
      console.log("Publishing Persona batches...");
      const activePersonas = Object.keys(contentPayload);

      // Loop through and fire off a campaign for each persona
      for (const personaKey of activePersonas) {
        const html = contentPayload[personaKey];
        const segmentId = PERSONA_SEGMENTS[personaKey];

        if (!segmentId) {
          console.warn(`Missing Mailchimp Segment ID for ${personaKey}. Skipping.`);
          continue;
        }

        console.log(`Sending campaign to segment: ${personaKey}`);
        await createAndSendCampaign(
            `${subjectLine} - ${personaKey.toUpperCase()}`, // Customize per persona if desired
            html,
            segmentId
        );
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Mailchimp Publishing Error:", error);
    throw new Error("Failed to publish to Mailchimp.");
  }
}