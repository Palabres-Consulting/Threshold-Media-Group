// 1. IMPORT NextRequest
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../_lib/supabaseClient";

// 2. USE NextRequest here
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. SAFELY GET PARAMS USING nextUrl (No new URL() needed)
    const post_id = req.nextUrl.searchParams.get("post_id");

    console.log("POST ID:", post_id)


    if (!post_id || post_id === "undefined") {
      return NextResponse.json(
        { error: "Valid Post ID is required to unsave" },
        { status: 400 }
      );
    }

    const { error: deleteError } = await supabase
      .from("saved_articles")
      .delete()
      .match({ 
        user_id: user.id, 
        post_id: Number(post_id) 
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
    console.error("FATAL UNSAVE ERROR:", err); 
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}