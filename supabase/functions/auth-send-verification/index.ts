import { Resend } from 'npm:resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
// Change this to your actual production domain
const SITE_URL = "https://thresholdmedia.group" 

Deno.serve(async (req) => {
  try {
    const payload = await req.json()
    const { user, email_data } = payload

    // Construct the link properly for your unified callback
    const confirmationLink = `${SITE_URL}/api/auth/callback?token_hash=${email_data.token_hash}&type=${email_data.email_action_type}`

    const { data, error } = await resend.emails.send({
      from: 'Threshold <onboarding@resend.dev>', // Update this later with your domain
      to: "dkayode@palabres-consulting.com",
      subject: 'Verify your Threshold account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <h2>Welcome!</h2>
          <p>Click the link below to verify your email and get started:</p>
          <a href="${confirmationLink}" style="background: #000; color: #fff; padding: 12px 20px; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </div>
      `,
    })

    if (error) throw error

    return new Response(JSON.stringify({ done: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})