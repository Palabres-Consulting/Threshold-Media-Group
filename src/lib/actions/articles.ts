
export interface SaveArticlePayload {
  wp_url?: string;
  title: string;
  excerpt?: string | null;
  post_id: number;
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



export const removeArticleFromDb = async (postId: number) => {
  try {
    // PASS ID IN THE URL DIRECTLY
    const response = await fetch(`/api/articles/remove?post_id=${postId}`, {
      method: "DELETE",
    });

    // 1. Grab the raw response text NO MATTER WHAT
    const textResponse = await response.text();

    // 2. Try to parse it as JSON
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      // IF IT FAILS TO PARSE, PRINT THE HTML TO THE CONSOLE!
      console.error("🚨 SERVER CRASHED WITH HTML:", textResponse);
      throw new Error(`Server returned HTML instead of JSON (Status: ${response.status})`);
    }

    // 3. Normal error handling
    if (!response.ok) {
      throw new Error(data.error || "Something went wrong removing the article");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error removing article:", error);
    return { success: false, error: error.message };
  }
};