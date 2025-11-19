// middleware.ts (top)
import { NextResponse, type NextRequest } from "next/server";

const ROOT_API_ORIGIN = process.env.ROOT_API_ORIGIN || "http://localhost:3000";

export async function proxyApiRequest(req: NextRequest) {


  const url = req.nextUrl.clone();
  const targetPath = url.pathname; // e.g. /api/profile/user
  const target = `${ROOT_API_ORIGIN}${targetPath}${url.search}`;

  // Build headers to forward from the browser request.
  const headers = new Headers();
  for (const [k, v] of req.headers) {
    // Skip hop-by-hop headers that shouldn't be forwarded.
    if (["host", "connection", "content-length"].includes(k)) continue;
    headers.set(k, v as string);
  }

  headers.set("x-proxy-internal", "1");


  // Ensure cookie header is forwarded (browser will include cookie if same-origin)
  const cookie = req.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  // Prepare body if needed
  let body: ArrayBuffer | undefined = undefined;
  if (!["GET", "HEAD"].includes(req.method)) {
    try {
      // Edge runtime supports arrayBuffer on NextRequest
      body = await req.arrayBuffer();
    } catch (e) {
      // No body or unsupported; fall through
    }
  }

  // Perform server-side fetch to real API origin
  const fetchRes = await fetch(target, {
    method: req.method,
    headers,
    body: body ? body : undefined,
    // no credentials here — server-to-server
  });

  // Build a response to return to browser
  const resHeaders = new Headers(fetchRes.headers);

  // Optionally remove security headers you don't want to forward
  // e.g. resHeaders.delete("content-security-policy");

  // Convert streamed body to ArrayBuffer for NextResponse
  const resBuffer = await fetchRes.arrayBuffer();

  return new NextResponse(resBuffer, {
    status: fetchRes.status,
    headers: resHeaders,
  });
}
