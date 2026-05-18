"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Mail, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";

const VerifyRequestPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";

  // Logic to determine mail provider for the button
  const domain = email.split("@")[1]?.toLowerCase();
  const isGmail = domain?.includes("gmail");
  const mailUrl = isGmail ? "https://mail.google.com" : "https://outlook.live.com";

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

      {/* Primary Action Button (Matches your btn-var1 or accent style) */}
      <a
        href={mailUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-accent-main text-white rounded-[2em] py-3 px-6 flex items-center justify-center gap-2 hover:opacity-90 transition-all font-medium"
      >
        Open {isGmail ? "Gmail" : "Outlook"}
        <ExternalLink size={18} />
      </a>

      {/* Divider (Matches your form divider) */}
      <div className="flex gap-4 items-center">
        <div className="h-[2px] bg-foreground/5 w-full"></div>
        <p className="text-sm opacity-40 italic text-nowrap">Still waiting?</p>
        <div className="h-[2px] bg-foreground/5 w-full"></div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-foreground/60">
          Didn't receive it? Check your spam or{" "}
          <button 
            onClick={() => { /* You can trigger a resend toast here */ }}
            className="text-accent-main font-semibold hover:underline"
          >
            resend link
          </button>
        </p>

        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 text-sm text-foreground/40 hover:text-foreground transition-colors mt-2"
        >
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default VerifyRequestPage;