// lib/newsletter.ts
import mailchimp from "@mailchimp/mailchimp_marketing";
import crypto from "crypto";

mailchimp.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_API_SERVER,
});

const getSubscriberHash = (email: string) => {
    return crypto.createHash("md5").update(email.toLowerCase()).digest("hex");
};

export const newsletterService = {
    subscribe: async (email: string, tags: string[] = [], persona?: string) => {
        const subscriberHash = getSubscriberHash(email);

        try {
            await mailchimp.lists.setListMember(
                process.env.MAILCHIMP_AUDIENCE_ID!,
                subscriberHash,
                {
                    email_address: email,
                    status_if_new: "subscribed",
                    status: "subscribed",
                    merge_fields: {
                        PERSONA: persona || "General", // Falls back to "General" if null
                    },
                },
            );

            if (tags && tags.length > 0) {
                await mailchimp.lists.updateListMemberTags(
                    process.env.MAILCHIMP_AUDIENCE_ID!,
                    subscriberHash,
                    {
                        // Map your string array into the { name, status } format Mailchimp expects
                        tags: tags.map((tag) => ({
                            name: tag,
                            status: "active",
                        })),
                    },
                );
            }
        } catch (error) {
            console.error("Mailchimp Subscription Error:", error);
            // We don't throw here so we don't break the user's DB subscription
        }
    },

    unsubscribe: async (email: string) => {
        try {
            await mailchimp.lists.updateListMember(
                process.env.MAILCHIMP_AUDIENCE_ID!,
                getSubscriberHash(email),
                {
                    status: "unsubscribed",
                },
            );
        } catch (error) {
            console.error("Mailchimp Unsubscription Error:", error);
        }
    },
};
