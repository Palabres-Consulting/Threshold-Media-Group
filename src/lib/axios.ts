import axios from "axios";

export const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_LOCAL_BASE_URL
      : process.env.NEXT_PUBLIC_PROD_BASE_URL,
  withCredentials: true,
});
