"use client";

import { getTitleValue } from "@/app/[locale]/_components/PostDisplaySections/hero";
import PageContainer from "@/app/[locale]/_components/PostDisplaySections/pageContainer";
import Sidebar from "@/app/[locale]/_components/PostDisplaySections/sidebar";
import EmptyState from "@/app/[locale]/_components/ui/empty";
import EmptyFull from "@/app/[locale]/_components/ui/emptyFull";
import useSinglePost from "@/app/[locale]/hook/useSinglePost";
import { useClientSite } from "@/app/[locale]/hook/useSite";
import cloudinaryLoader from "@/app/lib/cloudinary";
import { useLocale } from "@/app/lib/locale/context/translationContext";
import Image from "next/image";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import React, { useEffect,  useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const UniquePost = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();
  const slug = params.title as string;
  const postType = searchParams.get("type") || "main";
  const idParam = searchParams.get("id");
  const idFromUrl = idParam && /^\d+$/.test(idParam) ? parseInt(idParam, 10) : null;
  const [storedId, setStoredId] = useState<number | null>(null);
  
  const site = useClientSite();

  // Map "main" from your Hero site prop back to "posts" for the API
  const postTypeMap: Record<string, "posts" | "extraction" | "asint"> = {
    main: "posts",
    extraction: "extraction",
    asint: "asint",
  };

  const storageKey = `post-id-${site}-${slug}`;
  
  
  // console.log("Storage Key:", storageKey)
  // console.log("ID from URL:", idFromUrl);
  // console.log("Stored ID from localStorage:", storedId);



  useEffect(() => {
    if (typeof window === "undefined") return;
    if (idFromUrl) return;

    const savedId = window.localStorage.getItem(storageKey);
    if (savedId && /^\d+$/.test(savedId)) {
      setStoredId(parseInt(savedId, 10));
    }
  }, [idFromUrl, storageKey]);

  const identifier = idFromUrl || storedId || slug;
  const { data: post, isLoading, isError } = useSinglePost(identifier, site);

  console.log(post);

  useEffect(() => {
    if (!post) return;

    // Set the query data for the ID key to prevent refetch when identifier changes
    const validPostType = postTypeMap[site] || "posts";
    queryClient.setQueryData(["single-post", validPostType, post.id, locale], post);

    const currentSearch = new URLSearchParams(searchParams.toString());
    currentSearch.set("type", site);
    currentSearch.set("id", post.id.toString());

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, post.id.toString());
    }

    const newPath = `/${locale}/journal/${post.slug}?${currentSearch.toString()}`;
    const currentPath = window.location.pathname + window.location.search;

    if (currentPath !== newPath) {
      router.replace(newPath);
    }
  }, [post, locale, postType, router, searchParams, storageKey, queryClient, site]);

  const formattedTitle = getTitleValue(post ? [post] : undefined, 0);

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

  return (
    <PageContainer id="unique-post" path="" title="Unique Post">
      <div className="w-full flex">
        <div className="lg:w-[70%] ">
          <div className="border-sub p-6">
            <div className="flex gap-6 py-2 text-foreground/50 items-center">
              <p className="text-sm">Product</p>
              <div className="h-[5px] w-[5px] bg-foreground/50 rounded-full"></div>
            </div>

            <div className="flex flex-col gap-10 mb-20">
              <h1 className="lg:text-[3.5rem] text-[2rem] font-bold ">
                {formattedTitle || "Post Title"}
              </h1>

              {/* Image Container */}
              <div className="rounded-2xl h-[60vh] w-full border-sub bg-foreground/5 relative overflow-hidden">
                <Image
                  loader={cloudinaryLoader}
                  src={"/images/homepage/home4.png"}
                  alt={post?.title?.rendered || "Post Image"}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  priority
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
          <EmptyFull lang={locale} title="No Content Yet" description="" />
          <Sidebar lang={locale} />
        </div>
      </div>
    </PageContainer>
  );
};

export default UniquePost;
