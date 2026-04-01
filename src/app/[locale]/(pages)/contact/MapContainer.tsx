"use client";

import dynamic from 'next/dynamic';

// This is the magic line. ssr: false prevents the error.
export const Mapbox = dynamic(() => import('@/components/map'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-lg" />
});

