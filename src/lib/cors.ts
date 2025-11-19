// lib/cors.ts
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_SUBDOMAINS = [
  'main',
  'extraction', 
  'app',
  // Add your subdomains here
];

export function getCorsHeaders(req: NextRequest): HeadersInit | undefined {
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  
  if (!origin) {
    // Same-origin request, no CORS needed
    return undefined;
  }

  try {
    const originUrl = new URL(origin);
    const originHost = originUrl.hostname;
    const hostWithoutPort = host?.split(':')[0] || '';
    
    // Extract base domain (example.com from app.example.com)
    const getBaseDomain = (hostname: string) => {
      const parts = hostname.split('.');
      if (hostname.endsWith('.localhost')) {
        return 'localhost';
      }
      // For production domains like app.example.com -> example.com
      return parts.slice(-2).join('.');
    };
    
    const originBase = getBaseDomain(originHost);
    const hostBase = getBaseDomain(hostWithoutPort);
    
    // Allow if same base domain (subdomain of same site)
    if (originBase === hostBase) {
      return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-site',
        'Access-Control-Allow-Credentials': 'true',
      };
    }
  } catch (e) {
    console.error('CORS origin parse error:', e);
  }
  
  return undefined;
}

export function corsResponse(req: NextRequest, response?: NextResponse) {
  const corsHeaders = getCorsHeaders(req);
  
  if (req.method === 'OPTIONS') {
    // Preflight request
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  if (response) {
    if (corsHeaders) {
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    return response;
  }
  
  if (corsHeaders) {
    const res = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });
    return res;
  }
  
  return NextResponse.next();
}