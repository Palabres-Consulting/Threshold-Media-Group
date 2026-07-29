"use client";

import React, { useState, useEffect } from "react";
import { FileText, Eye, CheckCircle, Flame } from "lucide-react";
import { NewsletterDraft } from "@/app/types/types";

type FilterStatus = "draft" | "approved" | "published";

export default function NewsletterList({ onSelectDraft }: { onSelectDraft: (id: string) => void }) {
  const [filter, setFilter] = useState<FilterStatus>("draft");
  const [items, setItems] = useState<NewsletterDraft[]>([]);

  useEffect(() => {
    // Collect local and runtime entries
    const collection: NewsletterDraft[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("tmg_draft_")) {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            collection.push(JSON.parse(value));
          } catch (_) {}
        }
      }
    }
    // Sort descending chronologically
    collection.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setItems(collection);
  }, [filter]);

  // Filters local mock items matching chosen states
  const filteredItems = items.filter(item => (item.status || "draft") === filter);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold mb-1">Newsletter Archives</h1>
        <p className="text-sm opacity-60">Review, sort, and launch pending historical content blocks across production timelines.</p>
      </div>

      {/* Directory Status Tab Switcher - Derived Directly from Auth Container Layout */}
      <div className="rounded-[2em] flex w-full p-1 border-sub max-w-md">
        {(["draft", "approved", "published"] as FilterStatus[]).map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setFilter(status)}
            className={`rounded-[2em] cursor-pointer w-full py-2.5 text-xs font-semibold capitalize transition-all duration-400 ${
              filter === status ? "bg-accent-main text-white" : "hover:bg-foreground/5 text-foreground/70"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Data Table Grid List */}
      <div className="border-sub rounded-2xl overflow-hidden bg-background">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-sm opacity-50 italic">
            No entries found matching status state parameters.
          </div>
        ) : (
          <div className="divide-y divide-sub flex flex-col">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="p-4 flex items-center justify-between hover:bg-foreground/[0.02] transition-colors gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-2.5 rounded-xl border ${
                    status === 'published' ? 'border-green-500/20 bg-green-500/10 text-green-500' :
                    status === 'approved' ? 'border-blue-500/20 bg-blue-500/10 text-blue-500' :
                    'border-sub bg-foreground/5 text-foreground/60'
                  }`}>
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-sm truncate font-medium">Brief-#{item.id.slice(-12)}</p>
                    <p className="text-xs opacity-50 mt-0.5">
                      Created: {new Date(item.createdAt).toLocaleString()} • {item.links?.length || 0} attached feeds
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDraft(item.id)}
                  className="flex items-center gap-2 px-4 py-2 text-xs border border-sub rounded-xl hover:bg-foreground/5 font-medium transition-all text-foreground/80"
                >
                  <Eye size={14} />
                  <span>Open Document</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}