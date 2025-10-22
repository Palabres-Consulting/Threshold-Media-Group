import { cookies } from "next/headers";

export async function useCookieSubDomain() {
  const cookieStore = await cookies();
  const site = (cookieStore.get("site")?.value || "main") as
    | "main"
    | "extraction"
    | "asint";

  return site;
}
