// supabase/functions/send-welcome-email/index.ts
import { Resend } from 'npm:resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

Deno.serve(async (req) => {
  try {
    // 1. Parse the webhook payload from Supabase
    const payload = await req.json()
    const { type, record, old_record } = payload

    // 2. THE FILTER: We only care if this is an UPDATE event where 
    // email_confirmed_at just changed from NULL to a timestamp.
    if (
      type !== 'UPDATE' || 
      !record?.email_confirmed_at || 
      old_record?.email_confirmed_at !== null
    ) {
      // Return a 200 OK so the database knows we received it, but we safely ignore it.
      return new Response("Not a new verification event. Ignoring.", { status: 200 })
    }

    // 3. Send the Welcome Email
    const { data, error } = await resend.emails.send({
      from: 'Threshold Media Group <onboarding@resend.dev>', // Update with your custom domain later
      to: "dkayode@palabres-consulting.com",
      subject: 'Welcome to Threshold Media Group!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
          <h2>We are thrilled to have you!</h2>
          <p>Your email has been verified and your account is officially active.</p>
          <p>You can now log in to your dashboard to get started.</p>
          <a href="https://thresholdmedia.group/" style="background: #e65100; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px;">
            Go to Dashboard
          </a>
        </div>
      `
    })

    if (error) throw error

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
    
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})