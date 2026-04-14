"use client";

import { getTitleValue } from "@/app/[locale]/_components/sections/hero";
import PageContainer from "@/app/[locale]/_components/sections/pageContainer";
import Sidebar from "@/app/[locale]/_components/sections/sidebar";
import SubscribeCard from "@/app/[locale]/_components/sections/subscribeCard";
import ThresholdOpinions from "@/app/[locale]/_components/sections/thresholdOpinions";
import EmptyState from "@/app/[locale]/_components/ui/empty";
import EmptyFull from "@/app/[locale]/_components/ui/emptyFull";
import useSinglePost from "@/app/[locale]/hook/useSinglePost";
import cloudinaryLoader from "@/app/lib/cloudinary";
import { useLocale } from "@/app/lib/locale/context/translationContext";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const UniquePost = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const title = params.title;

  const slug = params.title as string;
  // Get the type from the URL query ?type=extraction
  const postType = searchParams.get("type") || "main";
  const { data: post, isLoading, isError } = useSinglePost(slug, postType);

  console.log("POST", post);
  console.log(title);

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
          <Sidebar />
        </div>
      </div>
    </PageContainer>
  );
};

export default UniquePost;
