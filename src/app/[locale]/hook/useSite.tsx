"use client";

import { useEffect, useState } from "react";

export function useClientSite() {
  const [site, setSite] = useState<string>("main");

  useEffect(() => {
    const html = document.documentElement; // <html>
    const siteAttr = html.getAttribute("data-site");
    if (siteAttr) setSite(siteAttr);
  }, []);

  return site;
}
