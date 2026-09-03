"use client";

import { socialLinks } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const PageContainer: React.FC<{
  id: string;
  title: string;
  path: string;
  children: ReactNode;
}> = ({ id, title, path, children }) => {
  // Extract and capitalize the path. 
  // We removed the hardcoded .slice(0, 30) + "..." logic.
  const rawPathname = usePathname().slice(4);
  const displayPathname = rawPathname.charAt(0)?.toUpperCase() + rawPathname.slice(1);

  const socialMediaLinks = [
    { href: socialLinks.facebook, icon: FaFacebook },
    { href: socialLinks.instagram, icon: FaInstagram },
    { href: socialLinks.linkedin, icon: FaLinkedin },
    { href: socialLinks.youtube, icon: FaYoutube },
  ];

  return (
    <section>
      {/* Container: Stacks on mobile (flex-col), sits side-by-side on desktop (md:flex-row) */}
      <div className="py-5 bg-foreground/5 border-sub-side px-6 border-sub-bottom flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        
        {/* Breadcrumbs: min-w-0 is critical here; it prevents the flex child from overflowing its parent */}
        <div className="flex items-center gap-2 text-sm opacity-50 min-w-0 w-full md:w-auto">
          <Link href="/" className="shrink-0 hover:underline">Home</Link> 
          <span className="shrink-0">/</span>
          
          {/* The 'truncate' class automatically adds '...' ONLY when there isn't enough screen space */}
          <span className="truncate block" title={displayPathname}>
            {displayPathname}
          </span>
        </div>

        {/* Social Icons: shrink-0 prevents them from getting squished by long breadcrumbs */}
        <div className="shrink-0">
          <ul className="flex gap-3 md:gap-4">
            {socialMediaLinks.map(({ href, icon: Icon }, index) => (
              <li key={index} className="flex">
                <Link
                  href={href}
                  target="_blank"
                  // Slightly smaller padding/text on mobile, scaling up on md screens
                  className="rounded-full p-2 md:p-3 text-xl md:text-[1.5rem] border-sub text-accent-main hover:bg-foreground/10 transition-colors"
                >
                  <Icon />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="border-sub-side">{children}</div>
    </section>
  );
};

export default PageContainer;