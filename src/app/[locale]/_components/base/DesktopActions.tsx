"use client";

import UserNav from "./userNav";

interface DesktopActionsProps {
  dict: any;
}

export default function DesktopActions({ dict }: DesktopActionsProps) {
  const baseUrl = process.env.NEXT_PUBLIC_PROD_URL || "https://www.tresholdmediagroup.com";
  const localBase = process.env.NEXT_PUBLIC_LOCAL_BASE_URL || "http://localhost:3000";

  const authUrl = process.env.NODE_ENV === "production" ? `${baseUrl}/auth` : `${localBase}/auth`;

  return (
    <div className="flex flex-col lg:flex-row lg:gap-5 lg:my-0 my-10 gap-10 lg:items-center">
      <UserNav dict={dict} authUrl={authUrl} />
    </div>
  );
}