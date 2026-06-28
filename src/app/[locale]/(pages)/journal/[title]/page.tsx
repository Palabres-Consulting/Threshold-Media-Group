"use client";

import { getTitleValue } from "@/components/PostDisplaySections/hero";
import PageContainer from "@/components/PostDisplaySections/pageContainer";
import Sidebar from "@/components/PostDisplaySections/sidebar";
import EmptyState from "@/components/ui/empty";
import EmptyFull from "@/components/ui/emptyFull";
import useSinglePost from "@/app/[locale]/hook/useSinglePost";
import { useClientSite } from "@/app/[locale]/hook/useSite";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import { useLocale } from "@/lib/locale/context/translationContext";
import Image from "next/image";
import {
  useParams,
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useArticleSave } from "@/app/[locale]/hook/useArticles"; // <-- Import added
import ShareArticleButton from "@/components/utilities/shareArticleButton";
import { getTopLevelCategory } from "@/app/helpers/categoriesMap";
import ArticleTracker from "@/components/analytics/analyticsListener";

const UniquePost = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const slug = params.title as string;
  const postType = searchParams.get("type") || "main";
  const idParam = searchParams.get("id");
  const idFromUrl =
    idParam && /^\d+$/.test(idParam) ? parseInt(idParam, 10) : null;
  const [storedId, setStoredId] = useState<number | null>(null);

  const site = useClientSite();

  const postTypeMap: Record<
    string,
    "innovation" | "posts" | "extraction" | "asint"
  > = {
    innovation: "innovation",
    main: "posts",
    extraction: "extraction",
    asint: "asint",
  };

  const storageKey = `post-id-${site}-${slug}`;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (idFromUrl) return;

    const savedId = window.localStorage.getItem(storageKey);
    if (savedId && /^\d+$/.test(savedId)) {
      setStoredId(parseInt(savedId, 10));
    }
  }, [idFromUrl, storageKey]);

  const identifier = idFromUrl || storedId || slug;
  console.log("Using identifier:", identifier, "for postType:", postType);
  const {
    data: post,
    isLoading,
    isError,
  } = useSinglePost(identifier, postType);

  console.log("Fetched post:", post);

  // Option A: Get the original, uncompressed full-size image (Best for large hero sections)
  const imageUrl = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  // Option B: Get the 'large' optimized size (Typically capped at 1024px wide, good balance of quality and speed)
  // const imageUrl = post?._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.large?.source_url;

  // Fallback in case 'large' doesn't exist on older images
  const finalImageUrl =
    imageUrl || post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  useEffect(() => {
    if (!post) return;

    const validPostType = postTypeMap[site] || "posts";
    queryClient.setQueryData(
      ["single-post", validPostType, post.id, locale],
      post,
    );

    const currentSearch = new URLSearchParams(searchParams.toString());
    currentSearch.set("type", postType);
    currentSearch.set("id", post.id.toString());

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, post.id.toString());
    }

    const newPath = `/${locale}/journal/${post.slug}?${currentSearch.toString()}`;
    const currentPath = window.location.pathname + window.location.search;

    if (currentPath !== newPath && pathname.startsWith(`/${locale}`)) {
      router.replace(newPath);
    }
  }, [
    post,
    locale,
    postType,
    router,
    searchParams,
    storageKey,
    queryClient,
    site,
  ]);

  const formattedTitle = getTitleValue(post ? [post] : undefined, 0);

  // --- SAVE HOOK INTEGRATION ---
  const postUrl = `/${locale}/journal/${post?.slug}?type=${postType}&id=${post?.id}`;
  const { isSaved, isInitializing, isSaving, message, toggleSave } =
    useArticleSave({
      postId: post?.id as number,
      url: postUrl,
      title: formattedTitle || "",
      excerpt: post?.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || "",
    });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading post...</div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>
          <EmptyState
            locale={locale}
            title="POST NOT FOUND"
            description="This article was not found in our archives, please crosscheck the post title"
          />
        </div>
      </div>
    );
  }

  const topCatObj = getTopLevelCategory(post);
  console.log("Top-level category object:", topCatObj);
  const category = topCatObj.name ? topCatObj.name : "Uncategorized";

  const formattedCategory = category
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "’")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8211;/g, "–")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”");

  return (
    <PageContainer id="unique-post" path="" title="Unique Post">

      <ArticleTracker 
      articleId={post.id.toString()} 
      category={post.type} 
      locale={locale} 
    />

      <div className="w-full flex">
        <div className="lg:w-[70%] ">
          <div className="border-sub p-6">
            <div className="flex justify-between items-center py-2">
              <div className="flex gap-6 text-foreground/50 items-center">
                <p className="text-sm">{formattedCategory}</p>
                <div className="h-[5px] w-[5px] bg-foreground/50 rounded-full"></div>
                <div className="relative">
                  <ShareArticleButton
                    title={formattedTitle || "Post Title"}
                    url={postUrl}
                  />
                </div>
              </div>

              {/* --- SAVE BUTTON ADDED HERE --- */}
              <div className="flex items-center gap-2">
                {message && (
                  <span className="text-xs text-foreground/60">{message}</span>
                )}
                <button
                  onClick={toggleSave}
                  disabled={isSaving || isInitializing}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${
                    isSaved
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-foreground/30 hover:border-foreground"
                  }`}
                >
                  {isInitializing
                    ? "Checking..." // Or an empty state, or a spinner
                    : isSaving
                      ? "Saving..."
                      : isSaved
                        ? "★ Saved"
                        : "☆ Save Article"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-10 mb-20 mt-4">
              <h1 className="lg:text-[3.5rem] text-[2rem] font-bold ">
                {formattedTitle || "Post Title"}
              </h1>

              {/* Image Container */}
              <div className="rounded-2xl lg:h-[60vh] h-[40vh]  w-full border-sub bg-foreground/5 relative overflow-hidden">
                <Image
                  loader={cloudinaryLoader}
                  src={finalImageUrl || "/images/homepage/home4.png"}
                  alt={post?.title?.rendered || "Post Image"}
                  className="object-cover h-full w-full transition-transform duration-500 hover:scale-105"
                  priority
                  width={1000}
                  height={1000}
                />
              </div>

              <div
                className="max-w-4xl mx-auto
        [&_h2]:lg:text-4xl [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-6
        [&_h3]:lg:text-2xl [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-4
        [&_p]:text-lg [&_p]:leading-8 [&_p]:mb-6 [&_p]:text-foreground
        [&_strong]:text-foreground
      "
                dangerouslySetInnerHTML={{
                  __html: post?.content?.rendered || "",
                }}
              />
            </div>
          </div>
          <div className="">{/* <ThresholdOpinions /> */}</div>
        </div>
        <div className="lg:w-[30%] hidden lg:block relative overflow-hidden">
          {/* <EmptyFull lang={locale} title="No Content Yet" description="" /> */}
          <Sidebar site={site} lang={locale} />
        </div>
      </div>
    </PageContainer>
  );
};

export default UniquePost;
