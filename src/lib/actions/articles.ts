
export interface SaveArticlePayload {
  wp_url: string;
  title: string;
  excerpt?: string | null;
}

export const saveArticleToDb = async (article: SaveArticlePayload) => {
  try {
    const response = await fetch("/api/articles/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong saving the article");
    }

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Error saving article:", error);
    return { success: false, error: error.message };
  }
};


export const removeArticleFromDb = async (wp_url: string) => {
  try {
    const response = await fetch("/api/articles/unsave", {
      method: "DELETE", // Note the DELETE method
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wp_url }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong removing the article");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error removing article:", error);
    return { success: false, error: error.message };
  }
};