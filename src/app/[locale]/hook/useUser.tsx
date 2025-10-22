
import { User } from "@/app/types/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUser = () =>
  useQuery({
    queryKey: ["user"],
    queryFn: async () => (await axios.get<User>("/api/profile/user")).data,
    gcTime: 1000 * 60 * 60, 
  });

