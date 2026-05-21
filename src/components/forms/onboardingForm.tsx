"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Upload, ArrowRight, Check } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type FlowType = "custom" | "persona";

const PERSONAS = [
  { id: "mory", name: "Mory", domain: "Governance", color: "#1a2744", initial: "M" },
  { id: "kadiatou", name: "Kadiatou", domain: "Mining", color: "#7c3a1e", initial: "K" },
  { id: "ousmane", name: "Ousmane", domain: "Finance", color: "#2c4a2e", initial: "O" },
  { id: "fatoumata", name: "Fatoumata", domain: "Society", color: "#3d1a4a", initial: "F" },
  { id: "sekou", name: "Sekou", domain: "Data", color: "#1e3a4a", initial: "S" },
  { id: "aicha", name: "Aïcha", domain: "Diplomacy", color: "#4a3010", initial: "A" },
];

const INTERESTS = [
  "Extraction", "Macro strategy", "AI & Innovation", 
  "Finance", "Geopolitics", "Trade & Customs"
];

// Single Unified Schema for the entire Multi-step Flow
const onboardingSchema = z.object({
  title: z.string().min(2, { message: "Please enter your professional title" }),
  flowType: z.enum(["custom", "persona"]),
  selectedPersona: z.string().optional(),
  selectedInterests: z.array(z.string()),
  photoFile: z.any().optional(),
}).refine((data) => {
  // Conditional validation rule for step 2 details
  if (data.flowType === "persona" && !data.selectedPersona) return false;
  if (data.flowType === "custom" && data.selectedInterests.length === 0) return false;
  return true;
}, {
  message: "Please complete your selections before finishing",
  path: ["selectedPersona"]
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingClientForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);

  // Single form control orchestrating all sub-elements
  const { register, handleSubmit, control, trigger, watch, setValue, formState: { errors, isSubmitting } } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      title: "",
      flowType: "custom",
      selectedPersona: "",
      selectedInterests: [],
      photoFile: null,
    }
  });

  // Watch fields reactively to update UI presentation smoothly
  const currentFlowType = watch("flowType");
  const currentPersona = watch("selectedPersona");
  const currentInterests = watch("selectedInterests");
  const currentPhotoFile = watch("photoFile");

  // Step 1 check routine 
const proceedToStepTwo = async () => {
  // 💡 Force React Hook Form to validate ONLY the 'title' field
  const isTitleValid = await trigger("title");

  if (isTitleValid) {
    setStep(2);
  }
};
  const toggleInterest = (interest: string) => {
    const updated = currentInterests.includes(interest)
      ? currentInterests.filter((i) => i !== interest)
      : [...currentInterests, interest];
    setValue("selectedInterests", updated);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File must be less than 2MB");
        return;
      }
      setValue("photoFile", file);
    }
  };

  // Execution pipeline for submission
  const onSubmitData = async (data: OnboardingFormData, isSkipping: boolean = false) => {
    const submitPromise = async () => {
      const formData = new FormData();
      formData.append("action", isSkipping ? "skip" : "complete");
      formData.append("title", data.title); // Retained safely in form memory!

      if (!isSkipping) {
        formData.append("flowType", data.flowType);
        if (data.flowType === "persona") {
          if (!data.selectedPersona) throw new Error("Please select a persona");
          formData.append("avatarValue", data.selectedPersona);
        } else {
          if (data.selectedInterests.length === 0) throw new Error("Please select at least one interest");
          if (data.photoFile) formData.append("file", data.photoFile);
          formData.append("interests", JSON.stringify(data.selectedInterests));
        }
      }

      const response = await axios.post("/api/onboarding", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        router.push("/");
        queryClient.invalidateQueries({ queryKey: ["user"] });
        router.refresh();

        return isSkipping ? "Skipped for now" : "Profile configured!";
      }
    };

    toast.promise(submitPromise(), {
      loading: "Saving profile...",
      success: (msg) => <b>{msg}</b>,
      error: (err) => <b>{err.message || "Failed to save profile"}</b>,
    });
  };

  return (
    <div className="rounded-2xl lg:p-6 p-3 flex flex-col gap-6 lg:w-[35em] w-full mx-auto border-sub bg-background">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-2xl font-bold">
          {step === 1 ? "What do you call yourself?" : "Customize your identity"}
        </h2>
        <p className="text-sm text-foreground/60">
          {step === 1 ? "Let's personalize your TMG experience." : "Choose how you appear in the community."}
        </p>
      </div>

      {step === 1 ? (
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="title-input" className="text-sm font-medium">Username / Professional Title</label>
            <input
              id="title-input"
              {...register("title")}
              className="input mt-2"
              type="text"
              placeholder="e.g. Senior Data Analyst"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>
          <button 
            type="button" 
            onClick={proceedToStepTwo} 
            className="btn-var1 flex items-center justify-center gap-2"
          >
            Continue <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit((data) => onSubmitData(data, false))} className="flex flex-col gap-6">
          {/* Flow Toggle */}
          <div className="rounded-[2em] flex w-full p-1 border-sub">
            <button
              type="button"
              className={`rounded-[2em] cursor-pointer w-full py-3 transition-all duration-400 text-sm font-medium ${
                currentFlowType === "custom" ? "bg-accent-main text-white" : "hover:bg-foreground/5"
              }`}
              onClick={() => setValue("flowType", "custom")}
            >
              My Photo & Interests
            </button>
            <button
              type="button"
              className={`rounded-[2em] cursor-pointer w-full py-3 transition-all duration-400 text-sm font-medium ${
                currentFlowType === "persona" ? "bg-accent-main text-white" : "hover:bg-foreground/5"
              }`}
              onClick={() => setValue("flowType", "persona")}
            >
              TMG Persona
            </button>
          </div>

          {/* Conditional UI Subsections */}
          {currentFlowType === "custom" ? (
            <div className="space-y-6">
              <div className="p-4 border-sub rounded-xl bg-foreground/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-background border-sub flex items-center justify-center overflow-hidden">
                    {currentPhotoFile ? (
                      <img 
                        src={URL.createObjectURL(currentPhotoFile)} 
                        alt="Preview" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <Upload size={20} className="text-foreground/40" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">Upload Photo</p>
                    <p className="text-xs text-foreground/60">JPG/PNG, max 2MB</p>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png" 
                  onChange={handlePhotoUpload} 
                  className="text-sm max-w-[180px]" 
                />
              </div>

              <div>
                <p className="font-medium text-sm mb-3">Topics of Interest (Select at least 1)</p>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                        currentInterests.includes(interest)
                          ? "bg-accent-main text-white border-accent-main"
                          : "bg-background border-sub text-foreground/60 hover:border-accent-main/50"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-medium text-sm text-center">Select your TMG Persona</p>
              <div className="grid grid-cols-3 gap-4">
                {PERSONAS.map((persona) => (
                  <div
                    key={persona.id}
                    onClick={() => setValue("selectedPersona", persona.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-sub cursor-pointer transition-all ${
                      currentPersona === persona.id ? "border-accent-main bg-accent-main/5" : "hover:bg-foreground/5"
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white relative"
                      style={{ backgroundColor: persona.color }}
                    >
                      <span className="text-lg">{persona.initial}</span>
                      {currentPersona === persona.id && (
                        <div className="absolute -bottom-1 -right-1 bg-accent-main rounded-full p-1 border-2 border-background">
                          <Check size={10} />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold">{persona.name}</p>
                      <p className="text-[10px] text-foreground/60">{persona.domain}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-4">
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="btn-var1 w-full disabled:opacity-50"
            >
              Complete Profile
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onSubmitData(watch(), true)}
              className="text-xs text-foreground/40 hover:text-foreground transition-colors py-2 disabled:opacity-50"
            >
              Skip for now
            </button>
          </div>
        </form>
      )}
    </div>
  );
}