import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_components/base/header";
import Footer from "./_components/base/footer";
import { ToastProvider } from "./_components/sections/toasters";
import { SubdomainProvider } from "./context/subDomainContext";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { getDictionary } from "../lib/dict";
import { LocalizationProvider } from "./context/localizationContext";

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

export default async function RootLayout({
  children,
  params, // params contains { locale } from the folder structure [locale]
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "en" | "fr" }>;
}) {
  const cookieStore = await cookies();
  const site = cookieStore.get("site")?.value || "main";

  const { locale } = await params;

  const dict = await getDictionary(locale);

  return (
    <html lang={locale} data-site={site}>
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
          <LocalizationProvider locale={locale} dict={dict}>
            <SubdomainProvider>
              <ToastProvider>
                <Header />
                {children}
                <Footer />
              </ToastProvider>
            </SubdomainProvider>
          </LocalizationProvider>
        </Suspense>
      </body>
    </html>
  );
}
