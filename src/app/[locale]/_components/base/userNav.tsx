"use client";

import React from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { GoTriangleDown } from "react-icons/go";
import toast from "react-hot-toast";
import { User } from "@/app/types/types";
import { TranslationSchema } from "@/app/lib/locale";
import { useUser } from "../../hook/useUser";
import { useQueryClient } from "@tanstack/react-query";

interface UserNavProps {
  dict: TranslationSchema["main"];
  authUrl: string;
}

const UserNav = ({ dict, authUrl }: UserNavProps) => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useUser();

  const handleLogout = async () => {
    const logoutAction = async () => {
      queryClient.setQueryData(["user"], null); 
      queryClient.removeQueries({ queryKey: ["user"] });
      localStorage.clear();
      sessionStorage.clear();
      // 1. Kill session on server
      await axios.post("/api/auth/logout", {}, { withCredentials: true });

      
      window.location.href = "/";
    };

    toast.promise(logoutAction(), {
      loading: "Logging out...",
      success: "Logged out!",
      error: "Logout failed",
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
      <div className="relative group h-full flex items-center">
        {/* User Trigger */}
        <div className="px-2 py-1 flex items-center gap-2 cursor-pointer group-hover:text-accent-main transition-colors">
          <div className="h-[25px] w-[25px] rounded-full bg-foreground/10" />
          <h5 className="text-sm">
            {dict.nav.welcome}, {data.title.slice(0, 4)}
          </h5>
          <GoTriangleDown className="group-hover:rotate-180 transition-transform" />
        </div>

        {/* Dropdown Menu */}
        <div className="absolute hidden group-hover:flex flex-col top-[100%] right-0 w-40 bg-background border border-sub shadow-xl rounded-md overflow-hidden z-50">
          <Link
            href="/profile"
            className="px-4 py-3 text-sm hover:bg-foreground/5 hover:text-accent-main transition-colors"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
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
