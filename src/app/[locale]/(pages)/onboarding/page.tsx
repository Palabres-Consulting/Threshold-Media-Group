import { redirect } from "next/navigation";
import OnboardingClientForm from "@/components/forms/onboardingForm";
import { createSupabaseServer } from "@/app/api/_lib/supabaseClient";

// Enforce dynamic server rendering to always look up fresh onboarding status
export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 1. Fetch current active session

    console.log("OnboardingPage - Supabase Auth Check:", { user, error });


  // 2. Fetch their corresponding database profile status
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("onboarding_status")
    .eq("id", user?.id)
    .single();



  if (profileError) {
    console.error("Error checking onboarding profile state:", profileError);
    // If the profile record doesn't exist yet, we still let them proceed to initialize it
  }

  // Route Guard: If they already finished the onboarding process, don't let them re-run it
  if (profile?.onboarding_status === "completed") {
    redirect("/"); // Or wherever your primary home route lives
  }

  return (
    <main className="min-h-screen bg-background flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[35em] flex flex-col gap-4">
        
        {/* Brand Header Space */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <span className="text-xs tracking-widest uppercase font-semibold text-accent-main bg-accent-main/10 px-3 py-1 rounded-full">
            TMG Onboarding
          </span>
        </div>

        {/* Client Multi-step Flow Container */}
        <OnboardingClientForm />
        
        {/* Verification Meta Info */}
        <p className="text-center text-[11px] text-foreground/40 italic">
          TMG — Internal Platform Setup / Secure Session
        </p>
      </div>
    </main>
  );
}