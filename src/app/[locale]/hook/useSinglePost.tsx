/* hooks/useSinglePost.ts */
import { useQuery } from "@tanstack/react-query";
import { fetchPostById, fetchPostBySlug } from "../../lib/fetchLib";
import { useLocalization } from "../context/localizationContext";


const useSinglePost = (identifier: string | number, type: string = "posts") => {
  const { locale } = useLocalization();

  // Map "main" from your Hero site prop back to "posts" for the API
  const postTypeMap: Record<string, "posts" | "extraction" | "asint"> = {
    main: "posts",
    extraction: "extraction",
    asint: "asint",
  };

  const validPostType = postTypeMap[type] || "posts";

  const queryFn = typeof identifier === 'number' 
    ? () => fetchPostById(validPostType, identifier, locale) 
    : () => fetchPostBySlug(validPostType, identifier, locale);

  return useQuery({
    queryKey: ["single-post", validPostType, identifier, locale],
    queryFn,
    enabled: !!identifier,
  });
};

export default useSinglePost;