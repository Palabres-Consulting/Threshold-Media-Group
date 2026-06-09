import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Adjust path to where your shadcn primitive lives

const SectionSkeleton = () => {
  return (
    <div className="w-full flex flex-col gap-6 border-b border-foreground/5 pb-12 last:border-0">
      
      {/* 1. Header Skeleton */}
      <div className="flex justify-between items-center border-b border-sub pb-3 px-3 lg:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-32 hidden sm:block" />
      </div>

      {/* 2. Content Layout Blocks Simulation */}
      <div className="flex flex-col gap-8 px-3 lg:px-6">
        
        {/* Simulated Top Layout Block (e.g., Hero Grid / Main featured blocks) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Big Hero Left Card Layout */}
          <div className="lg:col-span-2 aspect-video w-full border border-sub/10 rounded-2xl flex flex-col justify-end p-6 gap-3 relative overflow-hidden">
            {/* The outer container acts as the card framework, containing individual element skeletons */}
            <Skeleton className="absolute inset-0 z-0" /> {/* Card Base Background */}
            <Skeleton className="h-4 w-1/4 z-10 opacity-80" />
            <Skeleton className="h-8 w-3/4 z-10" />
            <Skeleton className="h-4 w-1/2 z-10 opacity-60" />
          </div>
          
          {/* Right Supporting Sidebar Stack Layout */}
          <div className="flex flex-col gap-4 justify-between min-h-[300px] lg:min-h-auto">
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="h-[47%] w-full border border-sub/10 rounded-xl p-4 flex flex-col gap-2 justify-end relative overflow-hidden">
                <Skeleton className="absolute inset-0 z-0" />
                <Skeleton className="h-3 w-1/3 z-10 opacity-80" />
                <Skeleton className="h-5 w-5/6 z-10" />
              </div>
            ))}
          </div>
        </div>

        {/* Simulated Bottom Grid Layout Block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-3 w-1/2 opacity-70" />
            </div>
          ))}
        </div>

      </div>

      {/* Mobile CTA Button Skeleton */}
      <div className="mt-4 flex justify-end px-3 lg:hidden">
        <Skeleton className="w-full h-12 rounded-xl" />
      </div>

    </div>
  );
};

const DisplayHomePostsSkeleton = () => {
  return (
    <div className="flex flex-col gap-16 my-12">
      {/* Renders 3 structural placeholders to replicate the dynamic news feed length */}
      <SectionSkeleton />
      <SectionSkeleton />
      <SectionSkeleton />
    </div>
  );
};

export default DisplayHomePostsSkeleton;