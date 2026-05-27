"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoTriangleDown } from "react-icons/go";
import toast from "react-hot-toast";
import { User } from "@/app/types/types";
import { TranslationSchema } from "@/lib/locale";
import { useUser } from "../../app/[locale]/hook/useUser";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import cloudinaryLoader from "@/app/helpers/cloudinary";
import { createSupabaseServer } from "@/app/api/_lib/supabaseClient";
import { createClient } from "@/lib/supabase/supabaseBroswerCLient";

interface UserNavProps {
  dict: TranslationSchema["main"];
  authUrl: string;
}

const UserNav = ({ dict, authUrl }: UserNavProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useUser();

  // State and ref for handling click logic on touch devices
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();

    const logoutAction = async () => {
      // 1. Immediately wipe reactive client caches
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({ queryKey: ["user"] });
      localStorage.clear();
      sessionStorage.clear();

      try {
        // 2. Call local Supabase instance memory cleanup
        await supabase.auth.signOut();

        // 3. Clear cookies globally on backend
        await axios.post("/api/auth/logout", {}, { withCredentials: true });
      } catch (err) {
        console.error(
          "Network logout clearing pass completed with exceptions",
          err,
        );
      }

      // Safari Fix: Micro-timeout gives browser rendering threads space to finalize
      // cookie deletion blocks before structural route transitions happen
      setTimeout(() => {
        window.location.href = "/";
      }, 150);
    };

    toast.promise(logoutAction(), {
      loading: "Logging out...",
      success: "Logged out!",
      error: "Logout completed", // Don't block user if network step returns 200/500 variations
    });
  };

  if (isLoading) {
    return (
      <div className="px-1 py-1 flex items-center gap-2">
        <div className="h-[25px] w-[25px] rounded-full bg-foreground/10 animate-pulse" />
        <div className="h-3 w-16 bg-foreground/10 animate-pulse rounded" />
      </div>
    );
  }

  if (data) {
    return (
      <div
        className="relative group h-full flex items-center"
        ref={dropdownRef}
      >
        {/* User Trigger */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`px-2 py-1 flex items-center gap-2 cursor-pointer transition-colors ${
            isOpen ? "text-accent-main" : "group-hover:text-accent-main"
          }`}
        >
          <div className="h-[25px] w-[25px] rounded-full bg-foreground/10 relative overflow-hidden">
            <Image
              loader={cloudinaryLoader}
              src={data.avatar_url || "/images/profile/avatar-placeholder.png"}
              alt="Profile Avatar"
              fill
              className="object-cover"
            />
          </div>
          <h5 className="text-sm">
            {dict.nav.welcome}, {data.title.slice(0, 4)}
          </h5>
          <GoTriangleDown
            className={`transition-transform ${
              isOpen ? "rotate-180" : "group-hover:rotate-180"
            }`}
          />
        </div>

        {/* Dropdown Menu */}
        <div
          className={`absolute flex-col top-[100%] right-0 w-40 bg-background border border-sub shadow-xl rounded-md overflow-hidden z-50 ${
            isOpen ? "flex" : "hidden group-hover:flex"
          }`}
        >
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="px-4 py-3 text-sm hover:bg-foreground/5 hover:text-accent-main transition-colors"
          >
            Profile
          </Link>
          <button
            onClick={() => {
              setIsOpen(false);
              handleLogout();
            }}
            className="px-4 py-3 text-sm text-left hover:bg-foreground/5 hover:text-red-500 transition-colors border-t border-sub"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <Link href={authUrl} className="hover:text-accent-main transition-colors">
      {dict.nav.login}
    </Link>
  );
};

export default UserNav;
