"use client"

import Link from "next/link";
import { useParams } from "next/navigation";

const MEDIA_TABS = [
  // { name: "Highlights", href: "/transverse", typeId: undefined }, // Base page has no 'type'
  { name: "AI or Die", href: "/transverse/ai-or-die", typeId: "ai-or-die" },
  // { name: "Guinea Means Business", href: "/transverse/guinea-means-business", typeId: "guinea-means-business" },
  // { name: "One Quarter, One City", href: "/transverse/one-quarter-one-city", typeId: "one-quarter-one-city" },
];

export default function MediaTabs() {
  const params = useParams(); 
  
  const currentType = params.type as string | undefined;

  console.log("Current Type Param:", currentType);

  return (
    <div className="flex flex-wrap gap-6 border-b border-foreground/20 pb-4 mb-12">
      {MEDIA_TABS.map((tab) => {
        // Now we match purely based on the route parameter, ignoring the rest of the URL path
        const isActive = currentType === tab.typeId;

        return (
          <Link 
            key={tab.name} 
            href={tab.href}
            className={`text-sm md:text-base font-medium transition-colors ${
              isActive 
                ? "text-foreground border-b-2 border-foreground pb-4 -mb-[18px]" 
                : "text-foreground/50 hover:text-foreground"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}