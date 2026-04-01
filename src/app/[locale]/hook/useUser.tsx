import { User } from "@/app/types/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await axios.get<User>("/api/profile/user", {
        withCredentials: true,
      });
      return data;
    },
    // Only keep data fresh for a short time to catch auth changes
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });