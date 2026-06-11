"use client";

import cloudinaryLoader from "@/app/helpers/cloudinary";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/toasters";
// 💡 FIX 1: Drop auth-helpers, import your unified browser client constructor
import { createClient } from "@/lib/supabase/supabaseBroswerCLient"; 

// Defined Persona configurations matching your profile selector spec
const personas = [
  { name: "Mory", role: "Governance", color: "#1a2744" },
  { name: "Kadiatou", role: "Mining", color: "#7c3a1e" },
  // ... rest of your personas
];

export const ProfileDetails: React.FC<{
  avatar_url: string;
  username?: string;
  subscriber: boolean;
}> = ({ avatar_url, username, subscriber }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { setSuccess, setError } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  // 💡 FIX 2: Initialize using your explicit SSR-compatible browser builder
  const supabase = createClient();

  const navLinks = [
    { id: 0, href: "your-personal-information", title: "Your Personal Information" },
    { id: 1, href: "your-subscription", title: "Your Subscription" },
    { id: 2, href: "need-help", title: "Need Help?" },
    { id: 3, href: "saved-articles", title: "Saved Articles" },
  ];

  const activePersona = personas.find(
    (p) => p.name.toLowerCase() === avatar_url?.toLowerCase(),
  );

  const isUploadedImage = avatar_url && avatar_url.startsWith("http");

  const mutation = useMutation({
    mutationFn: async (newUrl: string) => {
      const response = await axios.patch("/api/profile/update_avatar", {
        avatar_url: newUrl,
      });
      return response.data;
    },
    onMutate: async (newUrl) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const prevUser = queryClient.getQueryData<any>(["user"]);

      queryClient.setQueryData(["user"], (old: any) => ({
        ...old,
        avatar_url: newUrl,
      }));
      return { prevUser };
    },
    onError: (_err, _data, ctx) => {
      if (ctx?.prevUser) queryClient.setQueryData(["user"], ctx.prevUser);
      setError("Failed to sync your new profile picture to your account.");
    },
    onSuccess: () => {
      setSuccess("Profile picture updated successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      e.target.value = ""; 
      return;
    }

    try {
      setIsUploading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("User session not found. Are you logged in client-side?");
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(data.path);

      mutation.mutate(publicUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="w-full min-h-[100vh] relative">
      <div className="sticky top-30">
        <div className="py-5 flex flex-col gap-3 items-center justify-center">
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            style={{ backgroundColor: activePersona ? activePersona.color : undefined }}
            className="group rounded-full h-20 w-20 overflow-hidden relative cursor-pointer border-2 border-transparent hover:border-accent-main transition-all flex items-center justify-center bg-foreground/5"
            title="Click to upload a custom profile picture"
          >
            {isUploadedImage ? (
              <Image
                src={avatar_url || "/images/profile/avatar-placeholder.png"}
                alt="Profile Avatar"
                fill
                className={`object-cover transition-opacity group-hover:opacity-40 ${isUploading ? "opacity-30" : ""}`}
                unoptimized
              />
            ) : activePersona ? (
              <div className={`w-full h-full flex flex-col items-center justify-center text-white select-none transition-opacity group-hover:opacity-30 ${isUploading ? "opacity-20" : ""}`}>
                <span className="text-2xl font-bold tracking-wider">
                  {activePersona.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-[10px] opacity-75 max-w-full truncate px-1">
                  {activePersona.name}
                </span>
              </div>
            ) : (
              <Image
                src="/images/profile/avatar-placeholder.png"
                alt="Profile Avatar"
                fill
                className={`object-cover transition-opacity group-hover:opacity-40 ${isUploading ? "opacity-30" : ""}`}
              />
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center px-1 text-black dark:text-white bg-white/20 dark:bg-black/20 backdrop-blur-xs">
              {isUploading ? "Uploading..." : "Upload Pic"}
            </div>

            {isUploading && (
              <div className="absolute animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-black dark:border-white" />
            )}
          </div>

          {username ? (
            <h3 className="font-semibold text-[1.5rem]">{username}</h3>
          ) : (
            <h3 className="font-semibold text-[1.5rem] blur-sm">John Doe</h3>
          )}

          <div className="rounded-lg p-3 border-sub text-xs">
            {subscriber ? "Subscriber" : "Free User"}
          </div>
        </div>

        <div className="border-sub-top grid w-full">
          {navLinks.map(({ href, id, title }) => (
            <Link
              key={id}
              href={`#${href}`}
              className="text-center py-4 text-sm w-full border-sub-bottom hover:bg-foreground/5 hover:border-l-2 hover:border-l-accent-main"
            >
              {title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};