export const trackPageView = () => {
  if (typeof window === 'undefined') return;

  // Grab or generate a persistent session id for the current tab session
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
  };

  const url = '/api/analytics';

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, JSON.stringify(payload));
  } else {
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      keepalive: true,
    });
  }
};