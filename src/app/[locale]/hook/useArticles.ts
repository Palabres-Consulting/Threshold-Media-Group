// app/[locale]/hook/useArticles.ts
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { removeArticleFromDb, saveArticleToDb } from "@/lib/actions/articles";

export const useSavedArticleIds = () => {
  return useQuery({
    queryKey: ["saved-article-ids"], // Changed key name
    queryFn: async () => {
      const res = await fetch("/api/articles/saved_urls"); // Or rename endpoint if you want
      if (!res.ok) throw new Error("Failed to fetch saved articles");
      const data = await res.json();
      
      return data.savedIds as number[]; // Now returning numbers!
    },
    staleTime: 1000 * 60 * 5, 
  });
};

interface UseArticleSaveProps {
  postId: number; // ADDED THIS
  url: string;
  title: string;
  excerpt?: string;
}

export function useArticleSave({ postId, url, title, excerpt = "" }: UseArticleSaveProps) {
  const queryClient = useQueryClient();
  
  const { data: savedIds = [], isLoading: isInitializing } = useSavedArticleIds();


  console.log(savedIds);
  // Match strictly by ID now, completely immune to URL variations!
  const isSaved = savedIds.includes(postId); 
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const toggleSave = async () => {
    setIsSaving(true);
    setMessage("");

    const previousIds = queryClient.getQueryData<number[]>(["saved-article-ids"]) || [];

    if (isSaved) {
      queryClient.setQueryData(["saved-article-ids"], previousIds.filter((id) => id !== postId));
      const result = await removeArticleFromDb(postId); // Ensure remove function takes postId now
      if (!result.success) {
        queryClient.setQueryData(["saved-article-ids"], previousIds);
        setMessage(result.error || "Failed to remove");
      }
    } else {
      queryClient.setQueryData(["saved-article-ids"], [...previousIds, postId]);
      const result = await saveArticleToDb({ post_id: postId, wp_url: url, title, excerpt });
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
    isInitializing, // True when page first loads
    isSaving,       // True ONLY when button is clicked
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
  });
};