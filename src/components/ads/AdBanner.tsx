'use client';

import { useEffect, useRef, useState } from 'react';

interface AdBannerProps {
  adSlot: string;
}

export default function AdBanner({ adSlot }: AdBannerProps) {
  const hasLoaded = useRef(false);
  const [isAdFilled, setIsAdFilled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasLoaded.current) {
      const timer = setTimeout(() => {
        try {
          const adElement = document.querySelector(`[data-ad-slot="${adSlot}"]`);
          if (adElement && adElement.clientWidth > 0) {
            ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            hasLoaded.current = true;

            // Monitor if Google actually fills the ad or leaves it blank
            const observer = new MutationObserver(() => {
              // Google sets a 'data-ad-status' attribute to 'filled' when an ad loads
              if (adElement.getAttribute('data-ad-status') === 'filled') {
                setIsAdFilled(true);
                observer.disconnect(); // Stop watching once filled
              }
            });

            observer.observe(adElement, { attributes: true });
          }
        } catch (error) {
          console.error('AdSense error: ', error);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [adSlot]);

  return (
    <div 
      className="w-full my-6 flex flex-col items-center justify-center relative" 
      style={{ minWidth: '300px', minHeight: '250px', width: '100%' }}
    >
      {/* 1. Visual Placeholder Box (Only visible while ad is NOT filled) */}
      {!isAdFilled && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center  border border-dashed border-gray-300 bg-gray-50 text-gray-400"
          style={{ pointerEvents: 'none' }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider">Sponsored Google Advertisement</span>
          {/* <span className="text-[10px] mt-1 text-gray-400">(Will appear here once approved)</span> */}
        </div>
      )}

      {/* 2. Actual Google Ad Tag */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '250px' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}