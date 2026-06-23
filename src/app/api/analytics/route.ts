
import { NextResponse } from 'next/server';
import { tinybird } from '@/lib/tinybird';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("DEBUG: Tinybird Key exists?", !!process.env.TINYBIRD_TOKEN);

    await tinybird.pageViews.ingest({
      timestamp: body.timestamp,
      session_id: body.session_id,
      pathname: body.pathname,
      referrer: body.referrer || null,
    });

    return new NextResponse('OK', { status: 200 });
  } catch (error: any) {
    // CRITICAL: Let's log the full error stack to the terminal
    console.error('❌ TINYBIRD INGESTION CRASH:', error);
    
    // Return a 500 so the browser network tab shows us the error message
    return new NextResponse(
      JSON.stringify({ error: error.message || 'Unknown ingestion error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}