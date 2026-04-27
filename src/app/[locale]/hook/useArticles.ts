import { useState } from "react";
import { saveArticleToDb, removeArticleFromDb } from "@/lib/actions/articles";

interface UseArticleSaveProps {
  url: string;
  title: string;
  excerpt?: string;
  isSavedInitially?: boolean;
}

export function useArticleSave({ 
  url, 
  title, 
  excerpt = "", 
  isSavedInitially = false 
}: UseArticleSaveProps) {
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleSave = async () => {
    setIsLoading(true);
    setMessage("");

    if (isSaved) {
      // UNSAVE
      const result = await removeArticleFromDb(url);
      if (result.success) {
        setIsSaved(false);
        setMessage("Removed from saved.");
      } else {
        setMessage(result.error);
      }
    } else {
      // SAVE
      const result = await saveArticleToDb({
        wp_url: url,
        title: title,
        excerpt: excerpt,
      });
      if (result.success) {
        setIsSaved(true);
        setMessage("Saved successfully!");
      } else {
        setMessage(result.error);
      }
    }

    setIsLoading(false);
    
    // Clear the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  };

  return {
    isSaved,
    isLoading,
    message,
    toggleSave
  };
}