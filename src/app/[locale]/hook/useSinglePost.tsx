/* hooks/useSinglePost.ts */
import { useQuery } from "@tanstack/react-query";
import { fetchPostBySlug } from "../../lib/fetchLib";
import { useLocalization } from "../context/localizationContext";


const useSinglePost = (slug: string, type: string = "posts") => {
  const { locale } = useLocalization();

  // Map "main" from your Hero site prop back to "posts" for the API
  const postTypeMap: Record<string, "posts" | "extraction" | "asint"> = {
    main: "posts",
    extraction: "extraction",
    asint: "asint",
  };

  const validPostType = postTypeMap[type] || "posts";

  return useQuery({
    queryKey: ["single-post", validPostType, slug, locale],
    queryFn: () => fetchPostBySlug(validPostType, slug, locale),
    enabled: !!slug,
  });
};

export default useSinglePost;