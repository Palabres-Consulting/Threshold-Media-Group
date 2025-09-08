"use client";

import { useSearchParams } from "next/navigation";

export function useSubdomain() {
  const searchParams = useSearchParams();

  console.log("searchParams", searchParams.get("site"));

  return searchParams.get("site") || "main";
}
