// app/api/wp/[[...path]]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ path?: string[] }> }
) {
  // Await the params object (Required in Next.js 15+)
  const params = await props.params;
  const pathArray = params.path || [];
  const endpoint = pathArray.join("/");

  if (!endpoint) {
    return NextResponse.json({ error: "Endpoint required" }, { status: 400 });
  }

  // Grab all query parameters sent by the client
  const { searchParams } = new URL(request.url);

  // Securely grab and format credentials on the server
  const username = process.env.TMG_READER_USER || "";
  const rawPassword = process.env.TMG_READER_PASS || "";
  const password = rawPassword.replace(/\s+/g, "");

  const authHeader = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const wpUrl = new URL(`https://wp.tresholdmediagroup.com/wp-json/wp/v2/${endpoint}`);
    
    searchParams.forEach((value, key) => {
      wpUrl.searchParams.append(key, value);
    });

    const wpResponse = await fetch(wpUrl.toString(), {
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    });

    const data = await wpResponse.json();
    return NextResponse.json(data, { status: wpResponse.status });
  } catch (error) {
    console.error("WP Proxy Error:", error);
    return NextResponse.json({ error: "Failed to fetch from WP" }, { status: 500 });
  }
}