import { NextRequest, NextResponse } from "next/server";

export function handleDynamicSubdomainRedirect(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  const hostname = url.hostname;
  const path = url.pathname;
  let host = req.headers.get("x-forwarded-host") || req.nextUrl.host;

  const PRIMARY_DOMAIN = new URL(process.env.NEXT_PUBLIC_PROD_BASE_URL!)
    .hostname;

  const isSubdomain = hostname !== PRIMARY_DOMAIN;

  console.log("HostName", hostname);

  console.log("url", url);
  console.log("host", host);

  console.log("host without port", host.split(":")[0]);

  const hostWithoutPort = host.split(":")[0];

  if (process.env.NODE_ENV === "development" && hostWithoutPort.includes(".")) {
    console.log("we're on a subdomain path, update isSubdomain");
  }

  const isAuthPath = path.includes("/auth");

  console.log(isSubdomain, isAuthPath);

  if (isSubdomain && isAuthPath) {
    console.log("user is on subdomain, redirect");

    if (process.env.NODE_ENV === "development") {
      return NextResponse.redirect("http://localhost:3000/auth");
    }

    const redirectUrl = new URL(
      `${process.env.NEXT_PUBLIC_PROD_BASE_URL}${path}`
    );
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.redirect("/");
}
