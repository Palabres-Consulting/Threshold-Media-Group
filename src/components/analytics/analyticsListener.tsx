'use client';

import { useEffect } from 'react';

interface TrackerProps {
  articleId?: string;
  category?: string;
  locale?: string;
}

export default function ArticleTracker({ articleId, category, locale }: TrackerProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let sessionId = sessionStorage.getItem('threshold_session');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('threshold_session', sessionId);
    }

    const payload = {
      timestamp: new Date().toISOString(),
      session_id: sessionId,
      pathname: window.location.pathname,
      referrer: document.referrer || null,
      article_id: articleId || null,
      category: category || null,
      locale: locale || null,
    };

    const url = '/api/analytics';

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, JSON.stringify(payload));
    } else {
      fetch(url, { method: 'POST', body: JSON.stringify(payload), keepalive: true });
    }
  }, [articleId, category, locale]);

  return null;
}