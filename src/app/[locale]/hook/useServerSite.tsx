import { cookies } from "next/headers";

export async function useServerSite() {
  const cookieStore = await cookies();
  const site = cookieStore.get("site")?.value || "main";

  return site;
}
