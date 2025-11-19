"use client";

import { createClient } from "@/lib/supabase/supabaseBroswerCLient";
import { Loader2 } from "lucide-react";

interface GoogleAuthButtonProps {
  onClick: () => Promise<void> | void;
  label?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

const GoogleAuthButton = ({
  onClick,
  label,
  isLoading = false,
  disabled = false,
}: GoogleAuthButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className=" [&_svg]:!w-4 flex cursor-pointer hover:bg-accent-main hover:text-white justify-center gap-4 py-4 rounded-lg w-full px-5 font-semibold items-center border-sub bg-foreground/5 text-center"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
            fill="currentColor"
          />
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
};

export const handleGoogleSignUp = async (
  setIsLoading: (val: boolean) => void,
  setError: (val: string | null) => void
) => {
  const supabase = createClient();
  setIsLoading(true);
  setError(null);

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    console.log(window.location.origin);

    if (error) throw error;
    // Redirect happens automatically on success
  } catch (error: unknown) {
    setError(error instanceof Error ? error.message : "An error occurred");
    setIsLoading(false);
  }
};

export default GoogleAuthButton;
