"use client";
import { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";

const SubdomainContext = createContext("main");

export function SubdomainProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const subdomain = searchParams.get("subdomain") || "main";

  return (
    <SubdomainContext.Provider value={subdomain}>
      {children}
    </SubdomainContext.Provider>
  );
}

export function useSubdomain() {
  return useContext(SubdomainContext);
}
