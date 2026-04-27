import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { removeArticleFromDb, saveArticleToDb } from "@/lib/actions/articles";

interface UseArticleSaveProps {
  url: string;
  title: string;
  excerpt?: string;
}

export function useArticleSave({ url, title, excerpt = "" }: UseArticleSaveProps) {
  const queryClient = useQueryClient();
  
  // 1. Fetch the global list of saved URLs
  const { data: savedUrls = [], isLoading: isFetchingStatus } = useSavedArticleUrls();

  // 2. Derive the saved status dynamically (No useState needed for isSaved!)
  const isSaved = savedUrls.includes(url);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState("");

  const toggleSave = async () => {
    setIsProcessing(true);
    setMessage("");

    // OPTIMISTIC UI UPDATE: Instantly change the cache before the DB finishes
    const previousUrls = queryClient.getQueryData<string[]>(["saved-article-urls"]) || [];

    if (isSaved) {
      // Optimistically remove from UI
      queryClient.setQueryData(["saved-article-urls"], previousUrls.filter((u) => u !== url));
      
      const result = await removeArticleFromDb(url);
      if (!result.success) {
        // Rollback if DB fails
        queryClient.setQueryData(["saved-article-urls"], previousUrls);
        setMessage(result.error || "Failed to remove");
      }
    } else {
      // Optimistically add to UI
      queryClient.setQueryData(["saved-article-urls"], [...previousUrls, url]);
      
      const result = await saveArticleToDb({ wp_url: url, title, excerpt });
      if (!result.success) {
         // Rollback if DB fails
        queryClient.setQueryData(["saved-article-urls"], previousUrls);
        setMessage(result.error || "Failed to save");
      }
    }

    setIsProcessing(false);
    setTimeout(() => setMessage(""), 3000);
  };

  return {
    isSaved,
    // It's "loading" if the button is clicked OR if the initial fetch is still happening
    isLoading: isProcessing || isFetchingStatus, 
    message,
    toggleSave,
  };
}





export const useSavedArticleUrls = () => {
  return useQuery({
    queryKey: ["saved-article-urls"],
    queryFn: async () => {
      const res = await fetch("/api/articles/saved-urls");
      if (!res.ok) throw new Error("Failed to fetch saved articles");
      const data = await res.json();
      return data.savedUrls as string[]; 
    },
    // Cache the list for 5 minutes. If a user opens 10 articles, 
    // it still only makes 1 API call!
    staleTime: 1000 * 60 * 5, 
  });
};