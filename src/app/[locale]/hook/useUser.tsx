import { User } from "@/app/types/types";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () =>
      (
        await axios.get<User>("http://localhost:3000/api/profile/user", {
          withCredentials: true,
        })
      ).data,
    gcTime: 1000 * 60 * 60, // 1 hour: How long to keep it in the cache
      // staleTime: 1000 * 60 * 60, // 1 hour: Data is considered fresh for this duration
  });
