import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../_lib/supabaseClient";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { newPassword, oldPassword } = await req.json();

  // Re-authenticate user (Supabase requires recent login for sensitive operations)
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: user.email!,
      password: oldPassword,
    });


  
  if (signInError) {
    return NextResponse.json(
      { error: "Old password is incorrect" },
      { status: 400 }
    );
  }
  

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Password updated successfully" });
}
