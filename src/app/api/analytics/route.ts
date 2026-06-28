import { NextResponse } from 'next/server';
import { tinybird } from '@/lib/tinybird';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    await tinybird.pageViews.ingest({
      timestamp: body.timestamp,
      session_id: body.session_id,
      pathname: body.pathname,
      referrer: body.referrer || null,
      article_id: body.article_id || null,
      category: body.category || null,
      locale: body.locale || null,
    });

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('Tinybird Ingestion Error:', error);
    return new NextResponse('Error', { status: 200 });
  }
}