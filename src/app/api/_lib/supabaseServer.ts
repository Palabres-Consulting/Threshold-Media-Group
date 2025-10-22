// import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

// // This client will handle auth + cookies for route handlers
// export const createSupabaseServerClient = () =>
//   createRouteHandlerClient({ cookies });

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// export async function createSupabaseServerClient() {
//   const cookieStore = await cookies();

//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
//   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
//   const supabaseServiceRoleKey =
//     process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

//   if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
//     throw new Error("Missing Supabase environment variables");
//   }

//   return createServerClient(supabaseUrl, supabaseServiceRoleKey, {
//     cookies: {
//       get(name) {
//         return cookieStore.get(name)?.value;
//       },
//       set(name, value, options) {
//         cookieStore.set({ name, value, ...options });
//       },
//       remove(name, options) {
//         cookieStore.set({ name, value: "", ...options });
//       },
//     },
//   });
// }
