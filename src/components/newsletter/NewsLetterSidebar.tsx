// 📍 Location: components/newsletter/NewsLetterSidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Plus, List, FileEdit, FolderOpen } from "lucide-react";
import { NewsletterDraft, NewsletterView } from "@/app/types/types";
import { fetchDraftsFromDB } from "@/lib/actions/newsLetterDraftActions"; // <-- Import the action

interface SidebarProps {
  currentView: NewsletterView;
  setView: (view: NewsletterView) => void;
  currentDraftId: string | null;
  setDraftId: (id: string | null) => void;
  refreshTrigger: number;
}

export default function NewsletterSidebar({
  currentView,
  setView,
  currentDraftId,
  setDraftId,
  refreshTrigger
}: SidebarProps) {
  const [drafts, setDrafts] = useState<NewsletterDraft[]>([]);

  useEffect(() => {
    const fetchAndCombineDrafts = async () => {
      // 1. Fetch from LocalStorage
      const localDrafts: NewsletterDraft[] = [];
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith("tmg_draft_")) {
            const item = localStorage.getItem(key);
            if (item) localDrafts.push(JSON.parse(item));
          }
        }
      } catch (e) {
        console.error("Failed to read local cache drafts", e);
      }

      // 2. Fetch from Database
      let dbDrafts: NewsletterDraft[] = [];
      try {
        dbDrafts = (await fetchDraftsFromDB()) as NewsletterDraft[];
        // console.log("Fetched DB drafts:", dbDrafts);
      } catch (e) {
        console.error("Failed to fetch DB drafts", e);
      }

      // 3. Combine and Deduplicate (Database version overwrites Local if IDs match)
      const combinedDraftsMap = new Map<string, NewsletterDraft>();
      
      localDrafts.forEach((draft) => combinedDraftsMap.set(draft.id, draft));
      dbDrafts.forEach((draft) => combinedDraftsMap.set(draft.id, draft));

      const combinedDrafts = Array.from(combinedDraftsMap.values());

      // Sort chronologically (newest first)
      combinedDrafts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setDrafts(combinedDrafts);
    };

    fetchAndCombineDrafts();
  }, [refreshTrigger, currentDraftId]);

  const navigationItems: { id: NewsletterView; label: string; icon: React.ReactNode }[] = [
    { id: "form", label: "Create Brief", icon: <Plus size={18} /> },
    { id: "list", label: "All Newsletters", icon: <List size={18} /> },
  ];

  return (
    // Changed border-r to border-l to support your right-hand layout perfectly
    <aside className="w-64 border-l border-sub p-4 flex flex-col gap-6 bg-background shrink-0 hidden md:flex">
      {/* Branding Header */}
      <div className="px-2 py-1">
        <h2 className="text-xl font-bold tracking-tight">TMG Dispatch</h2>
        <p className="text-xs opacity-60">Newsletter Management</p>
      </div>

      {/* Global Module Switcher */}
      <div className="flex flex-col gap-1.5">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setView(item.id);
              if (item.id !== "editor") setDraftId(null);
            }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium transition-all text-sm ${
              currentView === item.id && !currentDraftId
                ? "bg-accent-main text-white"
                : "hover:bg-foreground/5 text-foreground/80"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <div className="h-[1px] bg-foreground/10 my-1" />

      {/* Dynamic Content Cache Feed */}
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-foreground/40 px-2 flex items-center gap-2">
          <FolderOpen size={12} /> Recent Cached Drafts
        </span>
        
        <div className="flex flex-col gap-1 mt-1">
          {drafts.length === 0 ? (
            <p className="text-xs text-foreground/40 px-2 italic py-2">No items found</p>
          ) : (
            drafts.map((draft) => (
              <button
                key={draft.id}
                onClick={() => {
                  setDraftId(draft.id);
                  setView("editor");
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono truncate transition-all border ${
                  currentDraftId === draft.id
                    ? "bg-foreground/5 border-sub font-semibold text-accent-main"
                    : "border-transparent text-foreground/60 hover:bg-foreground/5"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="truncate">#{draft.id.slice(-8)}</span>
                  <span className="opacity-40 text-[10px]">
                    {new Date(draft.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}