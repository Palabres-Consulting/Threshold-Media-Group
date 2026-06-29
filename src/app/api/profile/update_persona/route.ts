import { NextResponse } from "next/server";
import { createSupabaseServer } from "../../_lib/supabaseClient";

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServer();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { persona } = await req.json(); // Accept persona parameter directly from client side

  console.log("PERSONA RECEIVED", persona)

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ 
      persona,             // Assigning target identity (e.g. 'mory')
      avatar_type: "persona" // Enforces type switch sync in case they had a custom upload before
    })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Persona updated successfully" });
}

export const dynamic = "force-dynamic";