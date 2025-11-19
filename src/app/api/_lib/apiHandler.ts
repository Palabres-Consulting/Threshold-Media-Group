// lib/apiHandler.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCorsHeaders } from '@/lib/cors';

type ApiHandler = (req: NextRequest) => Promise<NextResponse>;

export function withCors(handler: ApiHandler) {
  return async (req: NextRequest) => {
    // Handle preflight
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(req),
      });
    }
    
    // Execute the actual handler
    const response = await handler(req);
    
    // Add CORS headers to response
    const corsHeaders = getCorsHeaders(req) || {};
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
  };
}