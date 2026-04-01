"use client";

import { useEffect, useState } from "react";
type domain = "main" | "extraction" | "asint";

export function useClientSite() {
  const [site, setSite] = useState<string>("main");

  useEffect(() => {
    const html = document.documentElement; // <html>
    const siteAttr = html.getAttribute("data-site");
    if (siteAttr) setSite(siteAttr);
  }, []);

  return site as domain;
}
