"use client";

import React, { useState, useEffect } from "react";
import { useQueryState } from "nuqs";
import NewsletterSidebar from "@/components/newsletter/NewsLetterSidebar";
import NewsletterForm from "@/components/newsletter/NewsLetterForm";
import NewsletterEditor from "@/components/newsletter/NewsLetterEditor";
import NewsletterList from "@/components/newsletter/NewsLetterList";
import { NewsletterView } from "@/app/types/types";

export default function AdminNewsletterPage() {
  const [view, setView] = useState<NewsletterView>("form");
  const [draftId, setDraftId] = useQueryState("draftId");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Synchronize view state automatically based on URL search params
  useEffect(() => {
    if (draftId) {
      setView("editor");
    } else if (view === "editor" && !draftId) {
      setView("form");
    }
  }, [draftId]);

  const triggerSidebarRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex h-full bg-background text-foreground ">
      {/* Sidebar - Retained globally across views */}

      {/* Primary Workspace Panel */}
      <main className="flex-1 lg:p-8 p-4 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {view === "form" && (
            <NewsletterForm
              onSuccess={(id) => {
                setDraftId(id);
                triggerSidebarRefresh();
              }}
            />
          )}

          {view === "editor" && draftId && (
            <NewsletterEditor
              draftId={draftId}
              onClear={() => setDraftId(null)}
            />
          )}

          {view === "list" && (
            <NewsletterList onSelectDraft={(id) => setDraftId(id)} />
          )}
        </div>
      </main>
      <NewsletterSidebar
        currentView={view}
        setView={setView}
        currentDraftId={draftId}
        setDraftId={setDraftId}
        refreshTrigger={refreshTrigger}
      />
    </div>
  );
}
