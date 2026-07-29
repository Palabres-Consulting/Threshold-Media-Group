"use client";

import React, { useState, useEffect } from "react";
import { X, Smartphone, Monitor } from "lucide-react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  compiledHtml: string;
}

export default function NewsletterPreviewModal({
  isOpen,
  onClose,
  compiledHtml,
}: PreviewModalProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  // Handle global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Backdrop Overlay (Clicking outside closes modal) */
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      {/* Modal Content Box (e.stopPropagation keeps clicks inside from closing modal) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-zinc-900 border border-zinc-800 w-full max-w-5xl h-[90vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
      >
        
        {/* Modal Controls Bar */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-bold text-sm">Email Client Preview</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
              TMG Digest Layout
            </span>
          </div>

          {/* Desktop/Mobile Device Toggle */}
          <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setDevice("desktop")}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                device === "desktop" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Monitor size={14} /> Desktop
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                device === "mobile" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              <Smartphone size={14} /> Mobile
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Iframe Viewport Container */}
        <div className="flex-1 bg-zinc-950 flex items-center justify-center p-6 overflow-y-auto">
          <iframe
            title="Newsletter Preview"
            srcDoc={compiledHtml}
            className={`h-full bg-white transition-all duration-300 rounded-xl shadow-lg border-0 ${
              device === "desktop" ? "w-full max-w-[650px]" : "w-[375px]"
            }`}
          />
        </div>
      </div>
    </div>
  );
}