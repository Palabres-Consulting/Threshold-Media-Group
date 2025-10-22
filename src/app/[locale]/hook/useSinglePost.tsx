import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ParamValue } from "next/dist/server/request/params";

// Custom hook to fetch single post
const useSinglePost = (postId: ParamValue) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL!}/posts/${postId}`
      );
      return data;
    },
    enabled: !!postId, // Only run if postId exists
    retry: (failureCount, error: any) => {
      // Don't retry on 404s
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

export default useSinglePost;
