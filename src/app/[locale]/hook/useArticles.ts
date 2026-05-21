// app/[locale]/hook/useArticles.ts
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { removeArticleFromDb, saveArticleToDb } from "@/lib/actions/articles";

export const useSavedArticleIds = () => {
  return useQuery({
    queryKey: ["saved-article-ids"],
    queryFn: async () => {
      const res = await fetch("/api/articles/saved_urls");

      // 💡 THE FIX: If they are unauthorized, just return an empty array immediately.
      // This prevents React Query from treating it as an "Error" state.
      if (res.status === 401) {
        return [];
      }

      if (!res.ok) throw new Error("Failed to fetch saved articles");

      const data = await res.json();
      return data.savedIds as number[];
    },
    staleTime: 1000 * 60 * 5,

    // 💡 THE FIXES:
    retry: false,
    refetchOnWindowFocus: false,
  });
};

interface UseArticleSaveProps {
  postId: number; // ADDED THIS
  url: string;
  title: string;
  excerpt?: string;
}

export function useArticleSave(
  { postId, url, title, excerpt = "" }: UseArticleSaveProps,
) {
  const queryClient = useQueryClient();

  // 💡 OPTIMIZATION: Extract the logic out using TanStack select transformation.
  // This turns the observer subscription value into a simple primitive boolean.
  const { data: isSaved = false, isLoading: isInitializing } = useQuery({
    queryKey: ["saved-article-ids"],
    queryFn: async () => {
      const res = await fetch("/api/articles/saved_urls");
      if (!res.ok) throw new Error("Failed to fetch saved articles");
      const data = await res.json();
      return data.savedIds as number[];
    },
    staleTime: 1000 * 60 * 5,
    select: (ids) => ids.includes(postId), // 🌟 ONLY triggers component updates if THIS specific boolean flips!
    retry: false,
    refetchOnWindowFocus: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const toggleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setMessage("");

    const previousIds =
      queryClient.getQueryData<number[]>(["saved-article-ids"]) || [];

    if (isSaved) {
      queryClient.setQueryData(
        ["saved-article-ids"],
        previousIds.filter((id) => id !== postId),
      );
      const result = await removeArticleFromDb(postId);
      if (!result.success) {
        queryClient.setQueryData(["saved-article-ids"], previousIds);
        setMessage(result.error || "Failed to remove");
      }
    } else {
      queryClient.setQueryData(["saved-article-ids"], [...previousIds, postId]);
      const result = await saveArticleToDb({
        post_id: postId,
        wp_url: url,
        title,
        excerpt,
      });
      if (!result.success) {
        queryClient.setQueryData(["saved-article-ids"], previousIds);
        setMessage(result.error || "Failed to save");
      }
    }

    setIsSaving(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return {
    isSaved,
    isInitializing,
    isSaving,
    message,
    toggleSave,
  };
}

export type SavedArticle = {
  id: string;
  post_id: number;
  wp_url: string;
  title: string;
  excerpt: string | null;
  saved_at: string;
};

export const useSavedArticles = () => {
  return useQuery({
    queryKey: ["saved-articles-full"],
    queryFn: async () => {
      const res = await fetch("/api/articles/saved_articles");
      if (!res.ok) throw new Error("Failed to fetch saved articles");

      const data = await res.json();
      return data.articles as SavedArticle[];
    },
    // Cache the list for a little bit to avoid spamming the DB
    staleTime: 1000 * 60 * 2,

    retry: false,
    refetchOnWindowFocus: false,
  });
};
