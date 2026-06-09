import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Locale } from "@/app/[locale]/context/types";

// Import your existing display blocks
import HeroSection from "@/components/PostDisplaySections/hero2";
import GridPosts from "@/components/PostDisplaySections/gridPosts";
import MorePosts from "@/components/PostDisplaySections/morePosts";
import { fetchPostsByType } from "@/app/helpers/fetchLib";
import { normalizePosts } from "@/app/helpers/normalizeData";
import AdDisplay from "../PostDisplaySections/adDisplay";

interface DisplayHomePostsProps {
  locale: Locale;
}

const DisplayHomePosts = async ({ locale }: DisplayHomePostsProps) => {
  // 1. Scale up the per_page limit to fetch a deep pool of articles per post type
  const queryParams = {
    per_page: 16,
    lang: locale,
  };

  // Concurrent fetching to prevent backend waterfalls
  const [asintRaw, extractionRaw, innovationRaw] =
    await Promise.all([
      fetchPostsByType("asint", queryParams).catch(() => []),
      fetchPostsByType("extraction", queryParams).catch(() => []),
      fetchPostsByType("innovation", queryParams).catch(() => []),
    ]);

  // Data Normalization
  const asintPosts = normalizePosts(asintRaw, "asint");
  const extractionPosts = normalizePosts(extractionRaw, "extraction");
  const innovationPosts = normalizePosts(innovationRaw, "innovation");

  const sections = [
    {
      title: "ASINT Intel",
      slug: "asint",
      posts: asintPosts,
      isSubdomain: true,
    },
    {
      title: "Extraction",
      slug: "extraction",
      posts: extractionPosts,
      isSubdomain: true,
    },
    {
      title: "Innovation & Tech",
      slug: "innovation",
      posts: innovationPosts,
      isSubdomain: false,
    },
  
  ];

  return (
    <div className="flex flex-col gap-24 my-12">
      {sections.map((section) => {
        if (!section.posts || section.posts.length === 0) return null;

        // 2. Deep distribution slicing across your UI blocks
        const tier1Hero = section.posts.slice(0, 6); // 3 Posts (Main Hero layouts)
        const tier2MorePosts = section.posts.slice(3, 8); // 5 Posts (Vertical list layout)
        const tier3Grid = section.posts.slice(8, 12); // 4 Posts (Visual sidebar blocks)
        const tier4BottomGrid = section.posts.slice(12, 16); // 4 Posts (Footer row layout)

        // Compute correct routing base URLs
        const destinationUrl = section.isSubdomain
          ? `https://${section.slug}.yourdomain.com`
          : `/${locale}/${section.slug}`;

        return (
          <section
            key={section.slug}
            className="w-full flex flex-col gap-8 border-b border-sub/30 pb-16 last:border-0"
          >
            {/* Section Heading */}
            <div className="flex justify-between items-center  border-foreground pb-3 px-3 lg:px-6">
              <h2 className="text-2xl lg:text-4xl font-black tracking-tight uppercase">
                {section.title}
              </h2>
              <Link
                href={destinationUrl}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:underline group"
              >
                View All Stories
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* High-Density Layout Container */}
            <div className="flex flex-col gap-10">
              {/* BLOCK 1: Top Dynamic Hero Layout */}
              {tier1Hero.length > 0 && (
                <HeroSection site={section.slug} posts={tier1Hero} />
              )}

              {/* BLOCK 2: Two-Column Split Content Matrix */}
              {(tier2MorePosts.length > 0 || tier3Grid.length > 0) && (
                <div className="w-full flex flex-col lg:flex-row gap-8 border-t border-b border-sub/10 py-6">
                  {/* Left Main Stream Section (70% width) */}
                  <div className="w-full lg:w-[70%]">
                    {tier2MorePosts.length > 0 && (
                      <MorePosts
                        lang={locale}
                        posts={tier2MorePosts}
                        site={section.slug}
                      />
                    )}
                  </div>

                  {/* Vertical Divider Line for desktop */}
                  {/* <div className="hidden lg:block w-[1px] bg-sub/10 self-stretch" /> */}

                  {/* Right Dense Context Grid Block (32% width) */}
                  <div className="w-full lg:w-[30%]">
                    <div className="w-full py-10 relative overflow-hidden">
                      <AdDisplay />
                    </div>
                  </div>
                </div>
              )}

              {/* BLOCK 3: Bottom Full-Width Closing Content Grid */}
              {tier4BottomGrid.length > 0 && (
                <div className="pt-4">
                  <GridPosts site={section.slug} gridPosts={tier4BottomGrid} />
                </div>
              )}
            </div>

            {/* Bottom Footer Call-To-Action Link */}
            <div className="mt-6 px-3">
              <Link
                href={destinationUrl}
                className="w-full py-4 bg-foreground/5 hover:bg-foreground/10 transition-colors  font-bold text-sm flex items-center justify-center gap-2 border border-sub/20"
              >
                Go to {section.title} Homepage
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default DisplayHomePosts;
