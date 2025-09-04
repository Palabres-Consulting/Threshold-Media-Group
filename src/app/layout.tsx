import type { Metadata } from "next";
import { Geist, Geist_Mono, Courier_Prime } from "next/font/google";
import "./globals.css";
import Header from "./_components/base/header";
import Footer from "./_components/base/footer";
import { ToastProvider } from "./_components/sections/toasters";
import { SubdomainProvider } from "./context/subDomainContext";
import { Suspense } from "react";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
          <SubdomainProvider>
            <ToastProvider>
              <Header />
              {children}
              <Footer />
            </ToastProvider>
          </SubdomainProvider>
        </Suspense>
      </body>
    </html>
  );
}
