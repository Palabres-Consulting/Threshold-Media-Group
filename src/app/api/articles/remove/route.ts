import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../_lib/supabaseClient"; // Adjust path as needed

export async function DELETE(req: Request) {
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
    // 2. Extract the identifier (wp_url) from the request
    const { wp_url } = await req.json();

    if (!wp_url) {
      return NextResponse.json(
        { error: "Article URL is required to unsave" },
        { status: 400 }
      );
    }

    // 3. Delete from the saved_articles table
    // Using .match() ensures we only delete the row if BOTH the user_id and wp_url match
    const { error: deleteError } = await supabase
      .from("saved_articles")
      .delete()
      .match({ 
        user_id: user.id, 
        wp_url: wp_url 
      });

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to remove the article" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Article removed successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request payload" },
      { status: 400 }
    );
  }
}