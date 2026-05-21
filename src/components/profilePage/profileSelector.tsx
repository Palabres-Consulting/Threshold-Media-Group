import { useState } from "react";

// --- PERSONA SELECTOR ---
export const personas = [
  { name: "Mory", role: "Governance", color: "#1a2744" },
  { name: "Kadiatou", role: "Mining", color: "#7c3a1e" },
  // ... add the rest from spec
];

export const PersonaSelector = ({ 
  currentValue, 
  onSave, 
  isPending 
}: { 
  currentValue: string; 
  onSave: (val: string) => void;
  isPending: boolean;
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
      {personas.map((p) => (
        <div
          key={p.name}
          onClick={() => !isPending && onSave(p.name)}
          className={`cursor-pointer flex flex-col items-center p-2 rounded-md transition-all ${
            currentValue === p.name ? "ring-2 ring-blue-500 bg-white dark:bg-gray-700" : "hover:bg-gray-200 dark:hover:bg-gray-600"
          } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <div style={{ background: p.color }} className="w-10 h-10 rounded-full mb-2" />
          <p className="font-medium text-sm">{p.name}</p>
          <p className="text-xs text-gray-500">{p.role}</p>
        </div>
      ))}
    </div>
  );
};

// --- INTERESTS MODAL / SELECTOR ---
export const InterestsSelector = ({ 
  currentValues, 
  onSave, 
  onClose,
  isPending 
}: { 
  currentValues: string[]; 
  onSave: (val: string[]) => void; 
  onClose: () => void;
  isPending: boolean;
}) => {
  const allInterests = ["Extraction", "Macro strategy", "AI & Innovation", "Finance", "Geopolitics", "Trade & Customs"];
  const [selected, setSelected] = useState<string[]>(currentValues);

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
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
              selected.includes(i) ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
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