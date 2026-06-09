"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MEDIA_TABS = [
  { name: "All Highlights", href: "/transverse", typeId: undefined },
  { name: "AI or Die", href: "/transverse/ai-or-die", typeId: "ai-or-die" },
  {
    name: "Guinea Means Business",
    href: "/transverse/guinea-means-business",
    typeId: "guinea-means-business",
  },
  {
    name: "One Quarter, One City",
    href: "/transverse/one-quarter-one-city",
    typeId: "one-quarter-one-city",
  },
];

export default function MediaTabs() {
  const params = useParams();
  const pathname = usePathname();

  const currentType = params.type as string | undefined;

  return (
    <div className="flex flex-wrap gap-4 md:gap-8 border-b border-foreground/10 pb-4 mb-8">
      {MEDIA_TABS.map((tab) => {
        // Evaluate active logic gracefully based on route configuration parameter
        const isActive = currentType === tab.typeId;

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`text-sm md:text-lg font-bold tracking-tight uppercase transition-colors relative pb-4 -mb-[18px] ${
              isActive
                ? "text-foreground border-b-2 border-foreground"
                : "text-foreground/40 hover:text-foreground"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
