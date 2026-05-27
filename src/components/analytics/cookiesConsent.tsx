
"use client";

import React, { useState, useEffect } from "react";
import { Cookie, ShieldCheck, Settings, X } from "lucide-react";

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already saved cookie preferences
    const savedConsent = localStorage.getItem("tmg-cookie-consent");
    if (!savedConsent) {
      setIsOpen(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setSettings(parsed);
      } catch (e) {
        // Fallback for legacy single-string values
        if (savedConsent === "accepted") {
          setSettings({ necessary: true, analytics: true, marketing: true });
        }
      }
    }
  }, []);

  const savePreferences = (updatedSettings: CookieSettings) => {
    localStorage.setItem("tmg-cookie-consent", JSON.stringify(updatedSettings));
    setIsOpen(false);
    setShowPreferences(false);
    window.location.reload(); // Refresh to securely initialize authorized trackers
  };

  const handleAcceptAll = () => {
    const allOn = { necessary: true, analytics: true, marketing: true };
    savePreferences(allOn);
  };

  const handleSavePreferences = () => {
    savePreferences(settings);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Primary Banner View */}
      {!showPreferences && (
        <div className="fixed bottom-4 right-10 left-4 md:left-auto md:max-w-md z-50 bg-background border border-sub p-5 rounded-2xl shadow-xl flex flex-col gap-4 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex gap-3 items-start">
            <div className="p-2 rounded-xl bg-foreground/5 text-accent-main shrink-0">
              <Cookie className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-md text-foreground">Cookie Preference</h3>
              <p className="text-xs leading-relaxed text-foreground/70">
                We use cookies to optimize performance, preserve your login session, and deliver personalized newsletter briefs matching your strategic persona.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end gap-2 text-xs font-medium">
            <button
              onClick={() => setShowPreferences(true)}
              className="px-4 py-2 border border-sub rounded-full hover:bg-foreground/5 text-foreground transition-colors flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              Preferences
            </button>
            <button
              onClick={handleAcceptAll}
              className="bg-accent-main text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              Accept All
            </button>
          </div>
        </div>
      )}

      {/* Advanced Preferences Modal ("Manage Options") */}
      {showPreferences && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-background border border-sub w-full max-w-md rounded-2xl shadow-2xl p-6 flex flex-col gap-5 relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setShowPreferences(false)}
              className="absolute top-4 right-4 p-1 text-foreground/40 hover:text-foreground rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent-main" />
              <h2 className="text-lg font-bold">Privacy Preference Center</h2>
            </div>

            <p className="text-xs text-foreground/60 leading-relaxed">
              Tailor your data compliance footprint. Strictly functional tracking settings remain enabled to authorize your media dashboard access.
            </p>

            <div className="flex flex-col gap-4 my-2">
              {/* Category 1: Necessary */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-sub bg-foreground/[0.01]">
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                  <span className="text-xs font-semibold">Strictly Necessary</span>
                  <span className="text-[10px] text-foreground/50 leading-normal">
                    Required for user authentication sessions (Supabase) and baseline localization operations.
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-accent-main bg-accent-main/10 px-2 py-1 rounded">
                  Required
                </div>
              </div>

              {/* Category 2: Analytics */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-sub">
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                  <span className="text-xs font-semibold">Performance & Analytics</span>
                  <span className="text-[10px] text-foreground/50 leading-normal">
                    Allows Google Analytics 4 to measure anonymous traffic volume and popular article engagement.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.analytics}
                  onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
                  className="w-4 h-4 rounded border-sub text-accent-main focus:ring-accent-main accent-accent-main cursor-pointer"
                />
              </div>

              {/* Category 3: Marketing */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-sub">
                <div className="flex flex-col gap-0.5 max-w-[75%]">
                  <span className="text-xs font-semibold">Contextual Personalization</span>
                  <span className="text-[10px] text-foreground/50 leading-normal">
                    Logs subdomain content interest paths to automatically configure your custom intelligence newsletter persona.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.marketing}
                  onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })}
                  className="w-4 h-4 rounded border-sub text-accent-main focus:ring-accent-main accent-accent-main cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 text-xs font-medium pt-2 border-t border-sub">
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-foreground/70 hover:text-foreground transition-colors"
              >
                Allow All
              </button>
              <button
                onClick={handleSavePreferences}
                className="bg-accent-main text-white px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
              >
                Save Preferences
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}