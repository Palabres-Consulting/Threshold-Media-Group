import AuthContainer from "@/app/[locale]/_components/forms/authForm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import React from "react";
import { Locale } from "../../context/types";
import { getTranslations } from "@/app/lib/locale/i18n/getTranslations";

function getIsSubdomain(hostname: string, primaryDomain: string) {
  const host = hostname.toLowerCase();

  // 1. Localhost rules
  // e.g. "tenant.localhost" → subdomain
  if (host.includes(".localhost")) {
    const parts = host.split(".");
    console.log("parts", parts);
    console.log(parts.length);
    return parts.length >= 2; // tenant.localhost → [tenant, localhost]
  }

  // 2. Production rules
  // e.g. "tenant.tresholdmediagroup.com" → subdomain
  if (host.endsWith(primaryDomain)) {
    const baseParts = primaryDomain.split(".").length; // e.g. 2
    const hostParts = host.split(".").length; // e.g. 3
    return hostParts > baseParts; // must be longer
  }

  // 3. Does not match primary domain or localhost
  return false;
}

const AuthPage = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const host = (await headers()).get("host")!;
  const { locale } = await params;
  const {main: dict} = await getTranslations(locale);

  const prodUrl = `${process.env.NEXT_PUBLIC_PROD_URL!}/auth`;
  const localUrl = `${process.env.NEXT_PUBLIC_LOCAL_BASE_URL!}/auth`;
  const isSub = getIsSubdomain(host, process.env.NEXT_PUBLIC_PROD_URL!);

  const redirectUrl =
    process.env.NODE_ENV === "production" ? prodUrl : localUrl;
  console.log(isSub);
  console.log("host from authpage", host);

  if (isSub) {
    redirect(`${redirectUrl}`);
  }

  return (
    <section className="min-h-[100vh] flex items-center justify-center">
      <AuthContainer dict={dict} />
    </section>
  );
};

export default AuthPage;
