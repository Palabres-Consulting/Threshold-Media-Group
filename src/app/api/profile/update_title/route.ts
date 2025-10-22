// app/api/user/update-title/route.ts
import { NextResponse } from "next/server";
import {
  createSupabaseServer,
  createSupabaseServerClient,
} from "../../_lib/supabaseClient";
 
export async function PATCH(req: Request) {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title } = await req.json();

  console.log(title);

  const { error: updateError, data } = await supabase
    .from("profiles")
    .update({ title })
    .eq("id", user.id);

  console.log(data);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Profile title updated" });
}
