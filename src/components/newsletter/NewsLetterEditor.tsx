"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArrowLeft, LayoutTemplate, Users, AlertCircle, Loader2, Save, CheckCircle, Send, Settings, Eye, Maximize, X } from "lucide-react";
import toast from "react-hot-toast";
import { updateNewsletterDraft, fetchDraftByIdFromDB } from "@/lib/actions/newsLetterDraftActions";
import { publishNewsletter } from "@/lib/actions/publishNewsletter";
import { buildTMGEmailHtml, HeaderType, ArticleItem } from "@/lib/template/tmgTemplate";
import { fetchAlsoThisWeek, fetchRecommendedReads } from "@/lib/actions/externalFetchActions";

interface EditorProps {
  draftId: string;
  onClear: () => void;
}

export default function NewsletterEditor({ draftId, onClear }: EditorProps) {
  const [draftData, setDraftData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("freemium");
  const [isConfirming, setIsConfirming] = useState(false);
  const [viewMode, setViewMode] = useState<"freemium" | "persona">("freemium");

  // Dynamic Content States
  const [alsoThisWeek, setAlsoThisWeek] = useState<ArticleItem[]>([]);
  const [recommendedReads, setRecommendedReads] = useState<ArticleItem[]>([]);
  const [isDynamicLoading, setIsDynamicLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Fetch WP and Tinybird data
  useEffect(() => {
    async function loadDynamicContent() {
      setIsDynamicLoading(true);
      try {
        const wpData = await fetchAlsoThisWeek();
        const tbData = await fetchRecommendedReads();
        setAlsoThisWeek(wpData || []);
        setRecommendedReads(tbData || []);
      } catch (error) {
        console.error("Failed to load dynamic sections", error);
      } finally {
        setIsDynamicLoading(false);
      }
    }
    loadDynamicContent();
  }, []);

  // 2. Fetch Draft Data
  useEffect(() => {
    const fetchDraft = async () => {
      setIsLoading(true);
      setViewMode("freemium");
      setActiveTab("freemium");

      const storageKey = `tmg_draft_${draftId}`;
      let draft: any = null;

      const localData = localStorage.getItem(storageKey);
      if (localData) {
        try { draft = JSON.parse(localData); } catch (e) { console.error("Cache error", e); }
      }

      if (!draft) {
        try {
          const dbDraft = await fetchDraftByIdFromDB(draftId);
          if (dbDraft) {
            draft = dbDraft;
            localStorage.setItem(storageKey, JSON.stringify(dbDraft));
          }
        } catch (e) { console.error("DB error", e); }
      }

      if (draft) {
        // Defensive parsing in case DB returned a stringified JSON
        let parsedFreemium = draft.freemium_content || {};
        if (typeof parsedFreemium === 'string') {
           try { parsedFreemium = JSON.parse(parsedFreemium); } catch(e) {}
        }
        
        let parsedPersona = draft.persona_content || {};
        if (typeof parsedPersona === 'string') {
           try { parsedPersona = JSON.parse(parsedPersona); } catch(e) {}
        }

        setDraftData({
            ...draft,
            freemium_content: parsedFreemium,
            persona_content: parsedPersona
        });
      } else {
        setDraftData(null);
      }
      setIsLoading(false);
    };
    fetchDraft();
  }, [draftId]);

  // 3. IDENTIFY ACTIVE DATA
  const activeData = viewMode === "freemium" 
    ? draftData?.freemium_content 
    : draftData?.persona_content?.[activeTab];

  // 4. Compile HTML (Memoized so it updates instantly on keystrokes)
  const currentCompiledHtml = useMemo(() => {
    return buildTMGEmailHtml({
      title: activeData?.subject || "TMG Weekly Digest",
      headerType: (activeData?.headerType as HeaderType) || "weekly_digest",
      headline: activeData?.headline,
      openingNote: activeData?.openingNote,
      signalOfTheWeek: activeData?.signal_title
        ? {
            title: activeData.signal_title,
            category: activeData.signal_category,
            imageUrl: activeData.signal_imageUrl,
            content: activeData.signal_content,
            whyItMatters: activeData.signal_whyItMatters,
            articleUrl: activeData.signal_articleUrl,
            conclusion: activeData.signal_conclusion, 
          }
        : undefined,
      alsoThisWeek: alsoThisWeek,
      recommendedReads: recommendedReads,
      adBannerUrl: activeData?.adBannerUrl,
      adBannerLink: activeData?.adBannerLink,
    });
  }, [activeData, alsoThisWeek, recommendedReads]);

  const personas = [
    { id: "mory", name: "Mory (Governance)" },
    { id: "kadiatou", name: "Kadiatou (Mining)" },
    { id: "ousmane", name: "Ousmane (Finance)" },
    { id: "fatoumata", name: "Fatoumata (Society)" },
    { id: "sekou", name: "Sekou (Data)" },
    { id: "aicha", name: "Aïcha (Diplomacy)" },
  ];

  // --- HANDLERS ---
  const handleFieldChange = (field: string, value: string) => {
    setDraftData((prev: any) => {
      if (!prev) return prev;
      
      if (viewMode === "freemium") {
        return {
          ...prev,
          freemium_content: { ...(prev.freemium_content || {}), [field]: value }
        };
      } else {
        return {
          ...prev,
          persona_content: {
            ...(prev.persona_content || {}),
            [activeTab]: { ...(prev.persona_content?.[activeTab] || {}), [field]: value }
          }
        };
      }
    });
  };

  const handleTabSwitch = (tabId: string) => {
    if (tabId === "freemium") {
      setViewMode("freemium");
      setActiveTab("freemium");
    } else {
      setViewMode("persona");
      setActiveTab(tabId);
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
    await toast.promise(savePromise(), { loading: "Saving draft...", success: (msg) => <b>{msg}</b>, error: <b>Failed to save draft</b> });
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
    await toast.promise(approvePromise(), { loading: "Approving newsletter...", success: (msg) => <b>{msg}</b>, error: <b>Failed to approve</b> });
    setIsProcessing(false);
  };

  const handlePublish = () => setIsConfirming(true);

  const executePublish = async () => {
    setIsConfirming(false);
    setIsProcessing(true);

    const publishPromise = async () => {
      const activeSubject = viewMode === "freemium" 
        ? draftData?.freemium_content?.subject 
        : draftData?.persona_content?.[activeTab]?.subject;
        
      const subject = activeSubject || "Threshold Media Update";

      if (viewMode === "freemium") {
        const freemiumData = draftData.freemium_content;
        if (!freemiumData) throw new Error("No Freemium content found.");

        const compiledFreemiumHtml = buildTMGEmailHtml({
          title: subject,
          headerType: freemiumData.headerType || "weekly_digest",
          headline: freemiumData.headline,
          openingNote: freemiumData.openingNote,
          signalOfTheWeek: freemiumData.signal_title ? {
                title: freemiumData.signal_title,
                category: freemiumData.signal_category,
                imageUrl: freemiumData.signal_imageUrl,
                content: freemiumData.signal_content,
                whyItMatters: freemiumData.signal_whyItMatters,
                conclusion: freemiumData.signal_conclusion,
                articleUrl: freemiumData.signal_articleUrl,
              } : undefined,
          alsoThisWeek,
          recommendedReads,
          adBannerUrl: freemiumData.adBannerUrl,
          adBannerLink: freemiumData.adBannerLink,
        });

        await publishNewsletter("freemium", subject, compiledFreemiumHtml);

      } else if (viewMode === "persona") {
        if (!draftData.persona_content) throw new Error("No Persona content found.");

        const compiledPersonaHtml: Record<string, string> = {};
        
        for (const [personaId, pData] of Object.entries(draftData.persona_content) as [string, any][]) {
          compiledPersonaHtml[personaId] = buildTMGEmailHtml({
            title: subject,
            headerType: pData.headerType || "weekly_digest",
            headline: pData.headline,
            openingNote: pData.openingNote,
            signalOfTheWeek: pData.signal_title ? {
                  title: pData.signal_title,
                  category: pData.signal_category,
                  imageUrl: pData.signal_imageUrl,
                  content: pData.signal_content,
                  whyItMatters: pData.signal_whyItMatters,
                  conclusion: pData.signal_conclusion,
                  articleUrl: pData.signal_articleUrl,
                } : undefined,
            alsoThisWeek,
            recommendedReads,
            adBannerUrl: pData.adBannerUrl,
            adBannerLink: pData.adBannerLink,
          });
        }
        await publishNewsletter("persona", subject, compiledPersonaHtml);
      }

      const storageKey = `tmg_draft_${draftId}`;
      const updatedLocalData = { ...draftData, status: "published" };
      localStorage.setItem(storageKey, JSON.stringify(updatedLocalData));
      setDraftData(updatedLocalData);

      return `Newsletter published successfully to ${viewMode}!`;
    };

    await toast.promise(publishPromise(), { loading: "Transmitting to Mailchimp...", success: (msg) => <b>{msg}</b>, error: (err) => <b>{err.message || "Failed to publish"}</b> });
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[50vh]">
        <Loader2 size={32} className="animate-spin text-accent-main mb-3" />
        <p className="text-sm opacity-60">Loading content workspace context...</p>
      </div>
    );
  }

  if (!draftData) {
    return (
      <div className="rounded-2xl border-sub p-8 text-center flex flex-col items-center justify-center gap-4">
        <AlertCircle size={36} className="text-red-500" />
        <div>
          <p className="font-semibold">Target Document Missing</p>
          <p className="text-sm opacity-60">This draft was not found in local cache or database parameters.</p>
        </div>
        <button onClick={onClear} className="text-accent-main hover:underline text-sm font-semibold">
          Return to Hub Dashboard
        </button>
      </div>
    );
  }

  const hasPersonas = Boolean(draftData?.persona_content && Object.keys(draftData.persona_content).length > 0);
  const currentStatus = draftData?.status || "draft";

  // Force a unique key for the iframe so React repaints it when dynamic articles load
  const iframeKey = `preview-${activeTab}-${alsoThisWeek.length}-${recommendedReads.length}`;

  return (
    <>
      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-gray-900/90 flex flex-col backdrop-blur-sm">
          <div className="flex justify-between items-center p-4 bg-gray-900 text-white shadow-md">
            <h2 className="text-sm font-bold opacity-80">Full Screen Preview</h2>
            <button onClick={() => setIsFullscreen(false)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 w-full flex justify-center p-6 overflow-hidden">
            <iframe
              key={`fs-${iframeKey}`}
              srcDoc={currentCompiledHtml}
              className="w-full max-w-[800px] h-full bg-white rounded-xl shadow-2xl border-0"
              title="Fullscreen Newsletter Preview"
            />
          </div>
        </div>
      )}

      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-background border border-sub p-6 rounded-2xl max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-lg mb-2">Confirm Publication</h3>
            <p className="text-sm opacity-60 mb-6">
              This will send the current newsletter draft to your active Mailchimp segments. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsConfirming(false)} className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-foreground/5 hover:bg-foreground/10">
                Cancel
              </button>
              <button onClick={executePublish} className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-main text-white hover:opacity-90">
                Confirm & Publish
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6 w-full min-h-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b gap-4">
          <div className="flex items-center gap-4">
            <button onClick={onClear} className="p-2 border-sub rounded-xl hover:bg-foreground/5 transition-all text-foreground/60 hover:text-foreground">
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold">Content Workspace</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase border ${
                  currentStatus === "published" ? "bg-green-500/10 text-green-500 border-green-500/20"
                    : currentStatus === "approved" ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                    : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                }`}>
                  {currentStatus}
                </span>
              </div>
              <p className="text-xs opacity-50 font-mono mt-0.5">UID: {draftId}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button onClick={handleSaveDraft} disabled={isProcessing || currentStatus === "published"} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-foreground/5 text-foreground/80 hover:bg-foreground/10 transition-all">
              <Save size={14} /> Save Draft
            </button>
            <div className="h-4 w-[1px] bg-foreground/15 mx-1" />
            {currentStatus !== "approved" && currentStatus !== "published" && (
              <button onClick={handleApprove} disabled={isProcessing} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-emerald-500/10 text-emerald-600 transition-all">
                <CheckCircle size={14} /> Approve
              </button>
            )}
            <button onClick={handlePublish} disabled={isProcessing || currentStatus !== "approved"} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-main text-white hover:opacity-90 transition-all disabled:opacity-30">
              <Send size={14} /> Publish
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* LEFT SIDEBAR: Structure & Settings */}
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-6 bg-foreground/5 p-4 rounded-2xl border border-sub">
            <div className="flex items-center gap-2 border-b border-sub pb-2 mb-2">
              <Settings size={16} />
              <span className="text-sm font-bold">Email Content Editor</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Subject Line</label>
              <input type="text" value={activeData?.subject || ""} onChange={(e) => handleFieldChange("subject", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60">Banner Style</label>
              <select value={activeData?.headerType || "weekly_digest"} onChange={(e) => handleFieldChange("headerType", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs">
                <option value="weekly_digest">Weekly Digest</option>
                <option value="weekly_brief">Weekly Brief</option>
                <option value="ai_or_die">AI or Die</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 border-b border-sub pb-1">Intro Section</label>
              <input type="text" placeholder="Headline" value={activeData?.headline || ""} onChange={(e) => handleFieldChange("headline", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs font-bold" />
              <textarea placeholder="Opening Note..." rows={3} value={activeData?.openingNote || ""} onChange={(e) => handleFieldChange("openingNote", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs resize-none" />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 border-b border-sub pb-1">Signal of the Week</label>
              <input type="text" placeholder="Signal Title" value={activeData?.signal_title || ""} onChange={(e) => handleFieldChange("signal_title", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs font-bold" />
              <input type="text" placeholder="Category" value={activeData?.signal_category || ""} onChange={(e) => handleFieldChange("signal_category", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs" />
              <textarea placeholder="Signal content..." rows={4} value={activeData?.signal_content || ""} onChange={(e) => handleFieldChange("signal_content", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs resize-none" />
              <textarea placeholder="Why it matters..." rows={3} value={activeData?.signal_whyItMatters || ""} onChange={(e) => handleFieldChange("signal_whyItMatters", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs resize-none border-l-4 border-l-accent-main" />
              
              <input type="text" placeholder="Article URL" value={activeData?.signal_articleUrl || ""} onChange={(e) => handleFieldChange("signal_articleUrl", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs text-blue-500" />
              <textarea placeholder="Conclusion (After link)..." rows={2} value={activeData?.signal_conclusion || ""} onChange={(e) => handleFieldChange("signal_conclusion", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs resize-none" />
              
              <input type="text" placeholder="Hero Image URL" value={activeData?.signal_imageUrl || ""} onChange={(e) => handleFieldChange("signal_imageUrl", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs opacity-50" />
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-[10px] font-bold uppercase tracking-wider opacity-60 border-b border-sub pb-1">Ad Placement</label>
              <input type="text" placeholder="Ad Image URL" value={activeData?.adBannerUrl || ""} onChange={(e) => handleFieldChange("adBannerUrl", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs" />
              <input type="text" placeholder="Ad Destination URL" value={activeData?.adBannerLink || ""} onChange={(e) => handleFieldChange("adBannerLink", e.target.value)} className="w-full bg-background border border-sub rounded-lg px-3 py-2 text-xs" />
            </div>

            {/* Distribution Mode Toggle */}
            <div className="flex flex-col gap-1 mt-4 border-t border-sub pt-4">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-40 px-2 mb-1">Distribution Mode</span>
              <button onClick={() => handleTabSwitch("freemium")} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${viewMode === "freemium" ? "bg-accent-main text-white shadow-sm" : "text-foreground/70 hover:bg-foreground/5"}`}>
                <LayoutTemplate size={14} /> <span>Freemium Base Digest</span>
              </button>
              {hasPersonas && (
                <button onClick={() => handleTabSwitch("mory")} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${viewMode === "persona" ? "bg-accent-main text-white shadow-sm" : "text-foreground/70 hover:bg-foreground/5"}`}>
                  <Users size={14} /> <span>Targeted Pro Segments</span>
                </button>
              )}
            </div>

            {viewMode === "persona" && hasPersonas && (
              <div className="flex flex-col gap-1 animate-in slide-in-from-left-2 duration-300">
                <div className="flex gap-2 border-l border-sub ml-3 pl-3 w-fit">
                  {personas.map((persona) => (
                    <button key={persona.id} onClick={() => handleTabSwitch(persona.id)} className={`text-left px-3 py-2 rounded-lg text-xs text-nowrap font-medium transition-all ${activeTab === persona.id ? "bg-foreground/10 text-foreground font-semibold" : "text-foreground/60 hover:bg-foreground/5"}`}>
                      {persona.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* MAIN WORKSPACE CANVAS: LIVE PREVIEW IFRAME */}
          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold opacity-60 px-1">
              <span>
                Live Preview: {activeTab === "freemium" ? "Freemium Digest" : personas.find((p) => p.id === activeTab)?.name}
              </span>
              <div className="flex items-center gap-3">
                {isDynamicLoading ? (
                  <span className="font-mono text-[10px] flex items-center gap-1 text-accent-main">
                    <Loader2 className="animate-spin" size={12}/> Fetching Articles...
                  </span>
                ) : (
                  <span className="font-mono text-[10px] flex items-center gap-1 text-green-600">
                    <CheckCircle size={10}/> Content Synced
                  </span>
                )}
                <span className="font-mono text-[10px] flex items-center gap-1">
                  <Eye size={12}/> Auto-updating
                </span>
                <button onClick={() => setIsFullscreen(true)} className="flex items-center gap-1 px-2 py-1 bg-foreground/5 hover:bg-foreground/10 rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider">
                  <Maximize size={12}/> Fullscreen
                </button>
              </div>
            </div>

            <div className={`w-full border border-sub rounded-2xl overflow-hidden shadow-sm bg-gray-50 h-[800px] flex flex-col ${currentStatus === "published" ? "opacity-80" : ""}`}>
              <iframe
                key={iframeKey}
                srcDoc={currentCompiledHtml}
                className="w-full h-full border-0 bg-white"
                title="Live Newsletter Preview"
              />
            </div>
            
            {currentStatus === "published" && (
              <p className="text-xs text-green-500 text-center mt-2 font-medium flex items-center justify-center gap-1">
                <CheckCircle size={12} /> This document has been published and is locked from further edits.
              </p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}