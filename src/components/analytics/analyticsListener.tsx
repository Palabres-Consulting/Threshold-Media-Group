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

    const startTime = Date.now();
    let sessionId = sessionStorage.getItem('threshold_session');
    
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('threshold_session', sessionId);
    }

    const url = '/api/analytics';
    const basePayload = {
      session_id: sessionId,
      pathname: window.location.pathname,
      referrer: document.referrer || null,
      article_id: articleId || null,
      category: category || null,
      locale: locale || null,
    };

    // 1. Track the initial view
    const viewPayload = {
      ...basePayload,
      event_type: 'page_view',
      timestamp: new Date().toISOString(),
      duration_seconds: 0
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, JSON.stringify(viewPayload));
    } else {
      fetch(url, { method: 'POST', body: JSON.stringify(viewPayload), keepalive: true });
    }

    let hasSentLeave = false;

    // 2. Track time spent on exit/hide
    const handleLeave = () => {
      if (hasSentLeave) return; // Prevent duplicate ingestion
      hasSentLeave = true;

      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      
      const leavePayload = {
        ...basePayload,
        event_type: 'page_leave',
        timestamp: new Date().toISOString(),
        duration_seconds: durationSeconds
      };

      // fetch with keepalive outlives the tab close and allows custom headers
      fetch(url, { 
        method: 'POST', 
        body: JSON.stringify(leavePayload), 
        keepalive: true,
        headers: { 'Content-Type': 'application/json' }
      }).catch(() => {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(url, JSON.stringify(leavePayload));
        }
      });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') handleLeave();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handleLeave);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handleLeave);
    };
  }, [articleId, category, locale]);

  return null;
}