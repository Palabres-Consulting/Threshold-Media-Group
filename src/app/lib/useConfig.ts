// lib/useConfig.ts
"use client";
import { siteConfigs } from "./config";
import { useSubdomain } from "../context/subDomainContext";

export function useConfig() {
  const subdomain = useSubdomain();
  return siteConfigs[subdomain] || siteConfigs.main;
}
