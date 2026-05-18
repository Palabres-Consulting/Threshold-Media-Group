"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/supabaseBroswerCLient";

const VerifyRequestPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // State for the resend button cooldown
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Handle the Cooldown Timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Handle the Resend Action
  const handleResend = async () => {
    if (!email) return;

    setIsResending(true);

    const resendPromise = async () => {
      const supabaseAnonClient = createClient();
      const { error } = await supabaseAnonClient.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      // Start the 60-second cooldown to prevent rate limit spam
      setCooldown(60);
      return "Verification link resent!";
    };

    toast.promise(resendPromise(), {
      loading: "Sending new link...",
      success: (msg) => <b>{msg}</b>,
      error: (err) => <b>{err.message || "Failed to resend link"}</b>,
    });

    setIsResending(false);
  };

  return (
    <div className="flex flex-col gap-6 lg:w-[25em] w-full mx-auto p-3 lg:p-6 rounded-2xl border-sub bg-background">
      {/* Icon Header */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-16 h-16 rounded-full bg-accent-main/10 flex items-center justify-center text-accent-main">
          <Mail size={32} />
        </div>
        <h1 className="text-2xl font-bold">Check your inbox</h1>
        <p className="text-center text-foreground/60">
          We sent a verification link to <br />
          <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>

      {/* Divider */}
      <div className="flex gap-4 items-center mt-2">
        <div className="h-[2px] bg-foreground/5 w-full"></div>
        <p className="text-sm opacity-40 italic text-nowrap">Still waiting?</p>
        <div className="h-[2px] bg-foreground/5 w-full"></div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-foreground/60">
          Didn't receive it? Check your spam or{" "}
          <button
            onClick={handleResend}
            disabled={isResending || cooldown > 0}
            className={`font-semibold transition-colors ${
              cooldown > 0
                ? "text-foreground/40 cursor-not-allowed"
                : "text-accent-main hover:underline cursor-pointer"
            }`}
          >
            {cooldown > 0 ? `resend link in ${cooldown}s` : "resend link"}
          </button>
        </p>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-sm text-foreground/40 hover:text-foreground transition-colors mt-4"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default VerifyRequestPage;
