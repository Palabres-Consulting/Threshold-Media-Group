import { NextResponse } from "next/server";
import { createSupabaseServer } from "../_lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();

    // 1. Authenticate Request using your server instance
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: "Unauthorized access. Please sign in again." },
        { status: 401 }
      );
    }

    // 2. Parse incoming Multipart Form Data
    const formData = await req.formData();
    const action = formData.get("action"); // 'complete' or 'skip'
    const title = formData.get("title");

    // 3. Handle 'skip' Flow Scenario
    if (action === "skip") {
      const { error: skipError } = await supabase
        .from("profiles")
        .update({
          title,
          onboarding_status: "skipped",
        })
        .eq("id", user.id);

      if (skipError) {
        throw new Error(skipError.message);
      }

      return NextResponse.json(
        { message: "Onboarding skipped successfully." },
        { status: 200 }
      );
    }

    // 4. Handle 'complete' Flow Scenario
    const flowType = formData.get("flowType"); // 'custom' or 'persona'
    let avatarType = null;
    let finalAvatarUrl = null;
    let interestsArray: string[] = [];

    if (flowType === "persona") {
      avatarType = "persona";
      // Save the persona ID string (e.g. 'mory', 'kadiatou') directly as the target identifier
      finalAvatarUrl = formData.get("avatarValue"); 
    } else if (flowType === "custom") {
      avatarType = "upload";
      
      // Safeguard and parse topics of interest array
      const rawInterests = formData.get("interests");
      if (rawInterests) {
        try {
          interestsArray = JSON.parse(rawInterests as string);
        } catch (parseErr) {
          console.error("Failed parsing interests json array:", parseErr);
        }
      }

      // Handle the physical file upload to your Supabase Storage Bucket
      const file = formData.get("file") as File | null;
      if (file) {
        const fileExt = file.name.split(".").pop();
        // Generate clean, deterministic unique naming per profile profile space
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: true
          });

        if (uploadError) {
          throw new Error(`Avatar storage upload failed: ${uploadError.message}`);
        }

        // Generate the structural asset path URL string
        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
          
        finalAvatarUrl = publicUrl;
      }
    }

    // 5. Update the profile record already created inside your signup execution
    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({
        title,
        onboarding_status: "completed",
        avatar_type: avatarType,
        avatar_url: finalAvatarUrl, // Reuses your established column mapping patterns cleanly
        interests: interestsArray,
      })
      .eq("id", user.id);

      console.log("Profile update result:", { profile, updateError });

    if (updateError) {
      throw new Error(updateError.message);
    }

    return NextResponse.json(
      { message: "Profile configurations updated smoothly!" },
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Onboarding Route Handler Error:", err);
    return NextResponse.json(
      { message: err.message ?? "An internal processing issue occurred." },
      { status: 500 }
    );
  }
}