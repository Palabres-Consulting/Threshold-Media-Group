/* hooks/useSinglePost.ts */
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug } from "../../lib/fetchLib";
import { useBrowserLanguage } from "./usePosts";

const useSinglePost = (slug: string, type: string = "posts") => {
  const lang = useBrowserLanguage();
  
  // Map "main" from your Hero site prop back to "posts" for the API
  const postTypeMap: Record<string, "posts" | "extraction" | "asint"> = {
    main: "posts",
    extraction: "extraction",
    asint: "asint",
  };

  const validPostType = postTypeMap[type] || "posts";

  return useQuery({
    queryKey: ["single-post", validPostType, slug, lang],
    queryFn: () => fetchPostBySlug(validPostType, slug, lang),
    enabled: !!slug,
  });
};

export default useSinglePost;