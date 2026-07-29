"use client";

import React, { useState } from "react";
import { Plus, Trash2, LayoutTemplate, Loader2 } from "lucide-react";
import { fetchArticlesFromUrls } from "@/lib/actions/fetchArticlesFromUrls";
import { generateAndSaveNewsletter } from "@/lib/actions/generateNewsletterDraft";
import toast, { Toaster } from "react-hot-toast"; 

export default function NewsletterForm({ onSuccess }: { onSuccess: (id: string) => void }) {
  const [links, setLinks] = useState<string[]>(["", "", ""]);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<"idle" | "fetching" | "generating">("idle");

  const addLinkInput = () => setLinks([...links, ""]);
  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const removeLink = (index: number) => {
    if (links.length <= 1) return;
    setLinks(links.filter((_, i) => i !== index));
  };


  const handleGenerate = async () => {
    const validLinks = links.filter((link) => link.trim() !== "");
    if (validLinks.length === 0) {
      toast.error("Please add at least one valid URL.");
      return;
    }

    // Create the promise wrapper for the toast
    const generatePromise = async () => {
      setLoadingState("fetching");
      const articles = await fetchArticlesFromUrls(validLinks);

      if (!articles || articles.length === 0) {
        // Throwing an error here triggers the toast 'error' state
        throw new Error("Failed to fetch articles. Check the URLs.");
      }

      setLoadingState("generating");
      const response = await generateAndSaveNewsletter(articles, isPremium);

      const storageKey = `tmg_draft_${response.id}`;
      const payload = {
        ...response,
        status: "draft",
        createdAt: new Date().toISOString(),
        links: validLinks
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));

      onSuccess(response.id);
      return "Draft generated successfully!";
    };

    // Execute the toast promise
    toast.promise(generatePromise(), {
      loading: 'Processing newsletter workflow...',
      success: (msg) => <b>{msg}</b>,
      error: (err) => <b>{err.message || "Something went wrong"}</b>,
    }).finally(() => {
      // Reset button state regardless of success or failure
      setLoadingState("idle");
    });
  };

  return (
    <>


      <div className="rounded-2xl lg:p-6 p-4 flex flex-col gap-6 border-sub bg-background">
        <div>
          <h1 className="text-2xl font-bold mb-1">Create Newsletter Draft</h1>
          <p className="text-sm opacity-60">Paste your content item source URLs to assemble the weekly automated digest.</p>
        </div>

        {/* Target Segmentation Switcher */}
        <div className="rounded-[2em] flex w-full p-1 border-sub max-w-md">
          <button
            type="button"
            onClick={() => setIsPremium(false)}
            className={`rounded-[2em] cursor-pointer w-full py-2.5 text-sm font-medium transition-all duration-400 ${
              !isPremium ? "bg-accent-main text-white" : "hover:bg-foreground/5 text-foreground/70"
            }`}
          >
            Freemium Only
          </button>
          <button
            type="button"
            onClick={() => setIsPremium(true)}
            className={`rounded-[2em] cursor-pointer w-full py-2.5 text-sm font-medium transition-all duration-400 ${
              isPremium ? "bg-accent-main text-white" : "hover:bg-foreground/5 text-foreground/70"
            }`}
          >
            Premium Personas
          </button>
        </div>

        {/* Links Form Fields */}
        <div className="flex flex-col gap-4">
          {links.map((link, index) => (
            <div key={index} className="flex flex-col gap-1.5 group">
              <label className="text-xs font-semibold opacity-60">Source Link {String(index + 1).padStart(2, '0')}</label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updateLink(index, e.target.value)}
                  placeholder="https://thresholdmedia.group/journal/article-slug"
                  className="input flex-1"
                  disabled={loadingState !== "idle"}
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  disabled={links.length === 1 || loadingState !== "idle"}
                  className="p-3 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-20 opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-500/20"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addLinkInput}
            disabled={loadingState !== "idle"}
            className="flex items-center gap-2 self-start mt-1 text-sm font-semibold text-accent-main hover:opacity-80 transition-opacity"
          >
            <Plus size={16} />
            <span>Add another article</span>
          </button>
        </div>

        {/* Form Submission Action */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loadingState !== "idle" || links.every((l) => l.trim() === "")}
          className="btn-var1 py-4 flex justify-center items-center gap-3 w-full"
        >
          {loadingState === "idle" && (
            <>
              <LayoutTemplate size={18} />
              <span>Generate Newsletter Draft</span>
            </>
          )}
          {loadingState === "fetching" && (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Extracting Article Context...</span>
            </>
          )}
          {loadingState === "generating" && (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>AI Compiling Content Ecosystem...</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}