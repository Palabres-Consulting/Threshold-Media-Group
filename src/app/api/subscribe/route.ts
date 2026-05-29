import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, persona, plan } = await req.json();

    //user id should come from authenticated session. 
    

    // 1. PLACEHOLDER: Default to Freemium for now
    // Later, this line becomes: const computedTier = await determineUserTier(userId);
    const computedTier = "Freemium"; 

    // 2. Push to Resend exactly as planned
    await resend.contacts.create({
      email: email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
      properties: {
        persona: persona || "Unassigned",
        tier: computedTier, 
      },
    });

    return NextResponse.json({ success: true, tier: computedTier });
  } catch (error) {
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}