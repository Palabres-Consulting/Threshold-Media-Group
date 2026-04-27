import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../_lib/supabaseClient";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all saved articles for this user, newest first
    const { data, error } = await supabase
      .from("saved_articles")
      .select("*")
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ articles: data });
  } catch (err) {
    console.error("Failed to fetch saved articles:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}