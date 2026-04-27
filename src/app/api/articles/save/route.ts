import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../_lib/supabaseClient";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  // 1. Authenticate the user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Extract article details from the request body
    const { wp_url, title, excerpt } = await req.json();

    // Basic validation to ensure required fields are present
    if (!wp_url || !title) {
      return NextResponse.json(
        { error: "URL and Title are required" },
        { status: 400 }
      );
    }

    // 3. Insert into the saved_articles table
    const { data, error: insertError } = await supabase
      .from("saved_articles")
      .insert([
        {
          user_id: user.id, // Securely grabbed from the authenticated session
          wp_url,
          title,
          excerpt,
          // saved_at and created_at should default to now() in Supabase
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save the article" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Article saved successfully", data });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}