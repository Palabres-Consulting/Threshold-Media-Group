import { NextResponse } from "next/server";
import { createSupabaseServer } from "../../_lib/supabaseClient";

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServer();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { avatar_url } = await req.json();

  if (!avatar_url) {
    return NextResponse.json({ error: "Avatar URL is required" }, { status: 400 });
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Profile picture updated successfully", avatar_url });
}