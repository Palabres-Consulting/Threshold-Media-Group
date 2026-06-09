import React from "react";
import { Locale } from "@/app/[locale]/context/types";
import {
  fetchExtractionPosts,
  fetchAsintPosts,
  fetchInnovationPosts,
} from "@/app/helpers/fetchLib";
import { normalizePosts } from "@/app/helpers/normalizeData";
import { searchParamsCache } from "@/app/helpers/searchParams";
import SearchInterfaceClient from "@/components/search/searchInterface";
import { useServerSite } from "../../hook/useServerSite";

interface SearchPageProps {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params;

  // Safely parse search parameters on the server side using the nuqs cache match
  const parsedParams = searchParamsCache.parse(await searchParams);
  const query = parsedParams.q || "";

  const site = await useServerSite();

  let mainResults: any[] = [];
  let extractionResults: any[] = [];
  let asintResults: any[] = [];

  // Execute queries only if a valid search string is provided
  if (query.trim().length > 0) {
    const apiParams = {
      search: query,
      search_columns: "post_title",
      per_page: 12,
      lang: locale,
    };

    // Execute concurrent fetches to avoid serial request blocking
    const [rawMain, rawExtraction, rawAsint] = await Promise.all([
      fetchInnovationPosts(apiParams).catch(() => []),
      fetchExtractionPosts(apiParams).catch(() => []),
      fetchAsintPosts(apiParams).catch(() => []),
    ]);

    // Normalize data formats for standard rendering consumption
    mainResults = normalizePosts(rawMain, "main");
    extractionResults = normalizePosts(rawExtraction, "extraction");
    asintResults = normalizePosts(rawAsint, "asint");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 ">
      <div className="flex flex-col gap-2 mb-8">
        <h1 className="text-3xl  font-black tracking-tight uppercase">
          Search Intelligence
        </h1>
        <p className="text-sm text-foreground/50">
          Query cross-platform databases simultaneously across networks.
        </p>
      </div>

      <SearchInterfaceClient
        site={site}
        initialQuery={query}
        results={{
          main: mainResults,
          extraction: extractionResults,
          asint: asintResults,
        }}
      />
    </div>
  );
}
