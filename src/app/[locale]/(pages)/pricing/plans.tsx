"use client";

import { TranslationSchema } from "@/lib/locale";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useUser } from "@/app/[locale]/hook/useUser";
import toast, { Toaster } from "react-hot-toast";

const Plans = ({ dict }: { dict: TranslationSchema["main"] }) => {
  const [activePlan, setActivePlan] = useState(1);

  // Custom User State Hook (Aliased isLoading to prevent layout variable conflicts)
  const { data: userData, isLoading: isUserLoading } = useUser();

  // Modal & API State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Triggered when a user clicks any "Subscribe" button
  const handleSubscribeInitiation = (planTitle: string) => {
    // Guard clause to prevent guest users from proceeding since accounts are required
    if (!userData && !isUserLoading) {
      toast.error("Please log in to subscribe to a plan.");
      console.warn(
        "Authentication required: Guest subscription attempts blocked.",
      );
      return;
    }
    setSelectedPlan(planTitle);
    setIsModalOpen(true);
  };

  // Triggered when they click "Confirm" inside the modal
  const handleConfirmSubscription = async () => {
    if (!userData) return;
    setIsSubscribing(true);

    try {
      // Dynamic profile values pulled straight from your useUser context hook
      const userPayload = {
        email: userData.email,
        persona: userData.persona || "Unassigned",
        intendedPlan: selectedPlan,
      };

      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process subscription");
      }

      console.log("Successfully subscribed:", data.tier);
    } catch (error) {
      console.error("Subscription synchronization failure:", error);
    } finally {
      setIsSubscribing(false);
      setIsModalOpen(false);
      setSelectedPlan("");
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative">
        {dict.pricing.plans.map(
          (
            { title, monthlyPrice, annualPrice, description, offers, popular },
            id: number,
          ) => {
            const active = id === activePlan;

            return (
              <div
                key={id}
                onMouseEnter={() => setActivePlan(id)}
                className={`${
                  active ? "bg-accent-main text-white" : "bg-foreground/5"
                } h-fit rounded-2xl p-8 transition-all duration-300`}
              >
                <div className="flex justify-between mb-5">
                  <h3 className="font-semibold text-[1.7rem]">{title}</h3>
                  <div className="w-fit rounded-md">
                    {id === 1 && (
                      <div className="bg-stone-950 text-white rounded-md p-1 px-3 text-sm font-medium">
                        {popular}
                      </div>
                    )}
                  </div>
                </div>
                <div className="py-5 text-foreground/50 border-sub-y">
                  <div className="flex items-center justify-center gap-3 text-[2rem]">
                    {id === 1 && <span>$</span>}
                    <span
                      className={`font-bold text-[3rem] mb-2 ${
                        active ? "text-black" : "text-foreground"
                      }`}
                    >
                      {monthlyPrice}
                    </span>
                    {id === 1 && (
                      <>
                        <span>/</span>
                        <span className={`${active ? "text-white/80" : ""}`}>
                          {dict.pricing.month}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-center">{description}</p>
                  <div className="mt-5">
                    <button
                      onClick={() => handleSubscribeInitiation(title)}
                      disabled={isUserLoading}
                      className={`w-full py-3 font-medium rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2 ${
                        active ? "bg-black" : "bg-accent-main"
                      }`}
                    >
                      {isUserLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        dict.pricing.subscribe
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 mt-5">
                  {offers.map((offer: string, index: number) => (
                    <div
                      key={index}
                      className="flex py-3 px-4 border-sub rounded-lg items-center gap-3 bg-background/5"
                    >
                      <FaCheckCircle
                        className={active ? "text-white" : "text-accent-main"}
                      />
                      <span className="text-sm">{offer}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          },
        )}
      </div>

      {/* Confirmation Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-sub rounded-2xl max-w-md w-full p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold mb-2">Confirm Subscription</h3>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              Are you sure you want to proceed with subscribing to the{" "}
              <span className="font-semibold text-foreground">
                {selectedPlan}
              </span>{" "}
              plan?
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSubscribing}
                className="flex-1 py-2.5 rounded-lg border border-sub hover:bg-foreground/5 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubscription}
                disabled={isSubscribing}
                className="flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg bg-accent-main text-white hover:bg-accent-main/90 transition-colors disabled:opacity-70 font-medium"
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Yes, Subscribe"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Plans;
