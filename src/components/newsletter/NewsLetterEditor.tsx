// 📍 Location: components/newsletter/NewsletterEditor.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  LayoutTemplate,
  Users,
  AlertCircle,
  Loader2,
  Save,
  CheckCircle,
  Send,
  Eye,
} from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import toast from "react-hot-toast";
import { marked } from "marked";
import {
  updateNewsletterDraft,
  publishNewsletterDraft,
  fetchDraftByIdFromDB,
} from "@/lib/actions/newsLetterDraftActions";
import { publishNewsletter } from "@/lib/actions/publishNewsletter";
import { buildTMGEmailHtml } from "@/lib/template/tmgTemplate";
import NewsletterPreviewModal from "./newsLetterPreviewModal";

// ✅ 1. Configure marked specifically for Email safely
// breaks: true is the magic setting that converts \n into <br> so emails don't clump text
marked.setOptions({
  gfm: true,
  breaks: true,
});

interface EditorProps {
  draftId: string;
  onClear: () => void;
}

export default function NewsletterEditor({ draftId, onClear }: EditorProps) {
  const [draftData, setDraftData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("freemium");
  const [editedContent, setEditedContent] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [viewMode, setViewMode] = useState<"freemium" | "persona">("freemium");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // ✅ 2. Use the configured marked parser
  const parsedPreviewHtml = marked.parse(editedContent || "", {
    async: false,
  }) as string;

  const currentCompiledHtml = buildTMGEmailHtml({
    title: draftData?.title || "TMG Weekly Digest",
    markdownContent: parsedPreviewHtml,
    headerImage: draftData?.headerImage || undefined,
  });

  const personas = [
    { id: "mory", name: "Mory (Governance)" },
    { id: "kadiatou", name: "Kadiatou (Mining)" },
    { id: "ousmane", name: "Ousmane (Finance)" },
    { id: "fatoumata", name: "Fatoumata (Society)" },
    { id: "sekou", name: "Sekou (Data)" },
    { id: "aicha", name: "Aïcha (Diplomacy)" },
  ];

  useEffect(() => {
    const fetchDraft = async () => {
      setIsLoading(true);
      setViewMode("freemium");
      setActiveTab("freemium");
      setEditedContent("");

      const storageKey = `tmg_draft_${draftId}`;
      let draft: any = null;

      const localData = localStorage.getItem(storageKey);
      if (localData) {
        try {
          draft = JSON.parse(localData);
        } catch (e) {
          console.error("Failed to parse local draft cache", e);
        }
      }

      if (!draft) {
        try {
          const dbDraft = await fetchDraftByIdFromDB(draftId);
          if (dbDraft) {
            draft = dbDraft;
            localStorage.setItem(storageKey, JSON.stringify(dbDraft));
          }
        } catch (e) {
          console.error("Failed to fetch draft from DB", e);
        }
      }

      if (draft) {
        setDraftData(draft);
        if (draft.freemium_content || draft.freemium_content === "") {
          setEditedContent(draft.freemium_content);
        } else if (
          draft.persona_content &&
          Object.keys(draft.persona_content).length > 0
        ) {
          const firstPersona = Object.keys(draft.persona_content)[0];
          setViewMode("persona");
          setActiveTab(firstPersona);
          setEditedContent(draft.persona_content[firstPersona]);
        }
      } else {
        setDraftData(null);
      }

      setIsLoading(false);
    };

    fetchDraft();
  }, [draftId]);

  const handleContentChange = (newContent: string) => {
    setEditedContent(newContent);
    setDraftData((prev: any) => {
      if (!prev) return prev;
      if (activeTab === "freemium") {
        return { ...prev, freemium_content: newContent };
      } else {
        return {
          ...prev,
          persona_content: { ...prev.persona_content, [activeTab]: newContent },
        };
      }
    });
  };

  const handleTabSwitch = (tabId: string) => {
    if (tabId === "freemium") {
      setViewMode("freemium");
      setActiveTab("freemium");
      setEditedContent(draftData?.freemium_content || "");
    } else {
      setViewMode("persona");
      setActiveTab(tabId);
      setEditedContent(draftData?.persona_content?.[tabId] || "");
    }
  };

  const handleSaveDraft = async () => {
    setIsProcessing(true);
    const savePromise = async () => {
      await updateNewsletterDraft(draftId, "draft", draftData);
      const storageKey = `tmg_draft_${draftId}`;
      const updatedLocalData = { ...draftData, status: "draft" };
      localStorage.setItem(storageKey, JSON.stringify(updatedLocalData));
      setDraftData(updatedLocalData);
      return "Draft saved successfully";
    };

    await toast.promise(savePromise(), {
      loading: "Saving draft...",
      success: (msg) => <b>{msg}</b>,
      error: <b>Failed to save draft</b>,
    });
    setIsProcessing(false);
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    const approvePromise = async () => {
      await updateNewsletterDraft(draftId, "approved", draftData);
      const storageKey = `tmg_draft_${draftId}`;
      const updatedLocalData = { ...draftData, status: "approved" };
      localStorage.setItem(storageKey, JSON.stringify(updatedLocalData));
      setDraftData(updatedLocalData);
      return "Newsletter marked as Approved!";
    };

    await toast.promise(approvePromise(), {
      loading: "Approving newsletter...",
      success: (msg) => <b>{msg}</b>,
      error: <b>Failed to approve</b>,
    });
    setIsProcessing(false);
  };

  const handlePublish = () => setIsConfirming(true);

  const executePublish = async () => {
    setIsConfirming(false);
    setIsProcessing(true);

    const publishPromise = async () => {
      const subject = draftData.title || "Threshold Media Update";
      const headerImg = draftData?.headerImage || undefined;
      if (viewMode === "freemium") {
        if (!draftData.freemium_content)
          throw new Error("No Freemium content found.");

        // ✅ Passed directly. The template handles parsing and inline styles now.
        const compiledFreemiumHtml = buildTMGEmailHtml({
          title: subject,
          markdownContent: draftData.freemium_content,
          headerImage: headerImg,
        });

        console.log("Compiled Freemium HTML:", compiledFreemiumHtml);

        await publishNewsletter("freemium", subject, compiledFreemiumHtml);
      } else if (viewMode === "persona") {
        if (!draftData.persona_content)
          throw new Error("No Persona content found.");

        const compiledPersonaHtml: Record<string, string> = {};
        for (const [personaId, markdown] of Object.entries(
          draftData.persona_content,
        )) {
          // ✅ Passed directly to template
          compiledPersonaHtml[personaId] = buildTMGEmailHtml({
            title: subject,
            markdownContent: markdown as string,
            headerImage: headerImg,
          });
        }

        console.log("Compiled Persona HTML:", compiledPersonaHtml);

        await publishNewsletter("persona", subject, compiledPersonaHtml);
      }

      const storageKey = `tmg_draft_${draftId}`;
      const updatedLocalData = { ...draftData, status: "published" };
      localStorage.setItem(storageKey, JSON.stringify(updatedLocalData));
      setDraftData(updatedLocalData);

      return `Newsletter published successfully to ${viewMode}!`;
    };

    await toast.promise(publishPromise(), {
      loading: "Transmitting to Mailchimp...",
      success: (msg) => <b>{msg}</b>,
      error: (err) => <b>{err.message || "Failed to publish"}</b>,
    });
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[50vh]">
        <Loader2 size={32} className="animate-spin text-accent-main mb-3" />
        <p className="text-sm opacity-60">
          Loading content workspace context...
        </p>
      </div>
    );
  }

  if (!draftData) {
    return (
      <div className="rounded-2xl border-sub p-8 text-center flex flex-col items-center justify-center gap-4">
        <AlertCircle size={36} className="text-red-500" />
        <div>
          <p className="font-semibold">Target Document Missing</p>
          <p className="text-sm opacity-60">
            This draft was not found in local cache or database parameters.
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-accent-main hover:underline text-sm font-semibold"
        >
          Return to Hub Dashboard
        </button>
      </div>
    );
  }

  const hasPersonas = Boolean(
    draftData?.persona_content &&
    Object.keys(draftData.persona_content).length > 0,
  );

  const currentStatus = draftData?.status || "draft";

  return (
    <>
      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-sub p-6 rounded-2xl max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-lg mb-2">Confirm Publication</h3>
            <p className="text-sm opacity-60 mb-6">
              This will send the current newsletter draft to your active
              Mailchimp segments. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirming(false)}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-foreground/5 hover:bg-foreground/10"
              >
                Cancel
              </button>
              <button
                onClick={executePublish}
                className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-main text-white hover:opacity-90"
              >
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      <NewsletterPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        compiledHtml={currentCompiledHtml}
      />

      <div className="flex flex-col gap-6 w-full min-h-0">
        {/* View Functional Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onClear}
              className="p-2 border-sub rounded-xl hover:bg-foreground/5 transition-all text-foreground/60 hover:text-foreground"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold">Content Workspace</h1>

                {/* Dynamic Status Badge */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase border ${
                    currentStatus === "published"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : currentStatus === "approved"
                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }`}
                >
                  {currentStatus}
                </span>
              </div>
              <p className="text-xs opacity-50 font-mono mt-0.5">
                UID: {draftId}
              </p>
            </div>
          </div>

          {/* Action Toolset */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* Utility 1: Preview (Ghost/Bordered Button) */}
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-foreground/15 text-foreground/80 hover:bg-foreground/5 hover:text-foreground transition-all whitespace-nowrap"
            >
              <Eye size={14} />
              Preview
            </button>

            {/* Utility 2: Save Draft (Subtle Neutral) */}
            <button
              onClick={handleSaveDraft}
              disabled={isProcessing || currentStatus === "published"}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-foreground/5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Save size={14} />
              Save Draft
            </button>

            {/* Subtle Visual Separator */}
            <div className="h-4 w-[1px] bg-foreground/15 mx-1" />

            {/* Lifecycle Action 1: Approve (Only visible before approval) */}
            {currentStatus !== "approved" && currentStatus !== "published" && (
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all whitespace-nowrap"
              >
                <CheckCircle size={14} />
                Approve
              </button>
            )}

            {/* Lifecycle Action 2: Publish (Primary CTA) */}
            <button
              onClick={handlePublish}
              disabled={isProcessing || currentStatus !== "approved"}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-main text-white hover:opacity-90 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none whitespace-nowrap"
            >
              <Send size={14} />
              Publish
            </button>
          </div>
        </div>

        {/* Editor Main Segment Grid */}
        <div className="flex flex-col gap-6 items-start">
          <div className="w-full lg:w-56 shrink-0 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 px-2 mb-1">
                Distribution Mode
              </span>

              {/* Freemium Button */}
              <button
                onClick={() => handleTabSwitch("freemium")}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                  viewMode === "freemium"
                    ? "bg-accent-main text-white shadow-sm"
                    : "text-foreground/70 hover:bg-foreground/5"
                }`}
              >
                <LayoutTemplate size={14} />
                <span>Freemium Base Digest</span>
              </button>

              {/* Persona Button */}
              {hasPersonas && (
                <button
                  onClick={() => handleTabSwitch("mory")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                    viewMode === "persona"
                      ? "bg-accent-main text-white shadow-sm"
                      : "text-foreground/70 hover:bg-foreground/5"
                  }`}
                >
                  <Users size={14} />
                  <span>Targeted Pro Segments</span>
                </button>
              )}
            </div>

            {/* Persona List */}
            {viewMode === "persona" && hasPersonas && (
              <div className="flex flex-col gap-1 animate-in slide-in-from-left-2 duration-300">
                <div className="flex gap-2 border-l border-sub ml-3 pl-3 w-fit">
                  {personas.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => handleTabSwitch(persona.id)}
                      className={`text-left px-3 py-2 rounded-lg text-xs text-nowrap font-medium transition-all ${
                        activeTab === persona.id
                          ? "bg-foreground/10 text-foreground font-semibold"
                          : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                      }`}
                    >
                      {persona.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Workspace Canvas Frame */}
          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold opacity-60 px-1">
              <span>
                Focus Area:{" "}
                {activeTab === "freemium"
                  ? "Freemium Digest"
                  : personas.find((p) => p.id === activeTab)?.name}
              </span>
              <span className="font-mono text-[10px]">
                Tiptap Markdown Engine
              </span>
            </div>

            <div
              className={
                currentStatus === "published"
                  ? "pointer-events-none opacity-80"
                  : ""
              }
            >
              <RichTextEditor
                content={editedContent}
                onChange={handleContentChange}
              />
            </div>
            {currentStatus === "published" && (
              <p className="text-xs text-green-500 text-center mt-2 font-medium flex items-center justify-center gap-1">
                <CheckCircle size={12} /> This document has been published and
                is locked from further edits.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
