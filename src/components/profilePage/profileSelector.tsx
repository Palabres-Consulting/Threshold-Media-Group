import { useState } from "react";

import { PERSONAS } from "../forms/onboardingForm";
import { Check } from "lucide-react";

export const PersonaSelector = ({
  currentValue,
  onSave,
  isPending,
}: {
  currentValue: string; // This will now represent the persona id (e.g., 'mory', 'aicha')
  onSave: (val: string) => void;
  isPending: boolean;
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 border border-sub rounded-xl bg-background">
      {PERSONAS.map((persona) => {
        const isSelected = currentValue === persona.id;

        return (
          <div
            key={persona.id}
            onClick={(e) => {
              e.preventDefault(); // 👈 Stops the page from refreshing
              if (!isPending) onSave(persona.id);
            }}
            className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-sub transition-all ${
              isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            } ${
              isSelected
                ? "border-accent-main bg-accent-main/5 ring-1 ring-accent-main"
                : "hover:bg-foreground/5"
            }`}
          >
            {/* Updated SVG Avatar Container */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden bg-foreground/5">
              <img
                src={persona.avatarPath}
                alt={`${persona.name} avatar`}
                className="w-full h-full object-cover"
              />
              {isSelected && (
                <div className="absolute bottom-0 right-0 bg-accent-main rounded-full p-1 border-2 border-background z-10">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </div>

            <div className="text-center">
              <p className="text-xs font-semibold">{persona.name}</p>
              <p className="text-[10px] text-foreground/60">{persona.domain}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- INTERESTS MODAL / SELECTOR ---
export const InterestsSelector = ({
  currentValues,
  onSave,
  onClose,
  isPending,
}: {
  currentValues: string[];
  onSave: (val: string[]) => void;
  onClose: () => void;
  isPending: boolean;
}) => {
  const allInterests = [
    "Extraction",
    "Macro strategy",
    "AI & Innovation",
    "Finance",
    "Geopolitics",
    "Trade & Customs",
  ];
  const [selected, setSelected] = useState<string[]>(currentValues);

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest],
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-wrap gap-2">
        {allInterests.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggleInterest(i)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${
              selected.includes(i)
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex gap-2 lg:w-[40%]">
        <button
          onClick={() => onSave(selected)}
          disabled={isPending}
          className="btn-var1 w-full"
        >
          {isPending ? "Saving..." : "Save Interests"}
        </button>
        <button
          onClick={onClose}
          disabled={isPending}
          className="btn-var1 w-full bg-gray-400 hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
