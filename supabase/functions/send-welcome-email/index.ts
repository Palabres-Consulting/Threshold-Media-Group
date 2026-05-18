import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

Deno.serve(async (req) => {
  const { record } = await req.json();
  const email = record.email;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "dkayode@palabres-consulting.com",
    subject: "Welcome aboard!",
    html: `
      <h1>You are officially verified!</h1>
      <p>Welcome to the platform. Here is how to get started...</p>
    `,
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
});
