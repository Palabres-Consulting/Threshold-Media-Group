import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../../components/base/header";
import Footer from "../../components/base/footer";
import { ToastProvider } from "../../components/ui/toasters";
import { SubdomainProvider } from "./context/subDomainContext";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getDictionary } from "../helpers/dict";
import QueryProvider from "./context/queryProvider";
import { TranslationProvider } from "../../lib/locale/context/translationContext";
import { getTranslations } from "../../lib/locale/i18n/getTranslations";
import { Toaster } from "react-hot-toast";
import CookieConsent from "@/components/analytics/cookiesConsent";
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Threshold Media Group",
  description: "",
  keywords: [""],
};

const SUPPORTED_LOCALES = ["en", "fr"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export interface TranslationProps {
  locale: "en" | "fr";
  messages: Record<string, object | Record<string, string>>;
  params: Promise<{ locale: "en" | "fr" }>;
}

export default async function RootLayout({
  children,
  params,

  // params contains { locale } from the folder structure [locale]
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "en" | "fr" }>;
}) {
  const cookieStore = await cookies();
  const site = (cookieStore.get("site")?.value || "main") as
    | "main"
    | "extraction"
    | "asint";

  const { locale } = await params;

  const dict = await getDictionary(site, locale);

  const userLocale = SUPPORTED_LOCALES.includes(locale as SupportedLocale)
    ? (locale as SupportedLocale)
    : "fr";

  const messages = await getTranslations(userLocale);

  return (
    <html lang={locale} data-site={site}>
      <head>
        <Script
          id="adsense-init"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense
          fallback={
            <div className="flex justify-center items-center min-h-[100vh]">
              Loading...
            </div>
          }
        >
          <TranslationProvider
            initialMessages={messages}
            initialLocale={locale}
          >
            <SubdomainProvider>
              <QueryProvider>
                <ToastProvider>
                  <Toaster position="top-center" reverseOrder={false} />
                  <NuqsAdapter>

                  <div className=" mx-auto   border-sub-side">

                    <Header t={messages} site={site} />
                    <div className="max-w-[1340px] lg:mx-auto">{children}</div>

                    <Footer dict={messages.main} site={site} />

                    <CookieConsent />
                  </div>
                  </NuqsAdapter>
                </ToastProvider>
              </QueryProvider>
            </SubdomainProvider>
          </TranslationProvider>
        </Suspense>
      </body>
    </html>
  );
}
