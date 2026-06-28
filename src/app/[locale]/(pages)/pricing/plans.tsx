"use client";

import { TranslationSchema } from "@/lib/locale";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { useUser } from "@/app/[locale]/hook/useUser";
import toast, { Toaster } from "react-hot-toast";
import {
  activateFreemiumTier,
  cancelSubscription,
} from "@/lib/actions/subscribe";
import { useQueryClient } from "@tanstack/react-query";

const Plans = ({ dict }: { dict: TranslationSchema["main"] }) => {
  const [activePlan, setActivePlan] = useState(1);
  const { data: userData, isLoading: isUserLoading } = useUser();

  // Modal & API State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [modalAction, setModalAction] = useState<"subscribe" | "cancel">(
    "subscribe",
  );
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to check status
  const getSubStatus = (planTitle: string) => {
    return userData?.subscriptions?.some(
      (s) =>
        s.tier.toLowerCase() === planTitle.toLowerCase() &&
        s.status === "active",
    );
  };

  const handleInitiation = (
    action: "subscribe" | "cancel",
    planTitle: string,
  ) => {
    if (!userData && !isUserLoading) {
      toast.error("Please log in to proceed.");
      return;
    }
    setModalAction(action);
    setSelectedPlan(planTitle);
    setIsModalOpen(true);
  };

  const queryClient = useQueryClient(); // 2. Initialize the client
  // ... existing hooks

  const handleConfirmAction = async () => {
    setIsProcessing(true);
    try {
      if (modalAction === "subscribe") {
        const result = await activateFreemiumTier();
        if (!result.success) throw new Error(result.error);

        // Optimistically update cache for Subscription
        queryClient.setQueryData(["user"], (old: any) => ({
          ...old,
          subscriptions: [
            ...(old?.subscriptions || []),
            { tier: selectedPlan, status: "active" },
          ],
        }));

        toast.success("Subscribed successfully!");
      } else {
        const result = await cancelSubscription();
        if (!result.success) throw new Error(result.error);

        // 3. OPTIMISTIC UPDATE: Update the cache instantly
        queryClient.setQueryData(["user"], (old: any) => {
          if (!old) return old;
          return {
            ...old,
            subscriptions: old.subscriptions.map((s: any) =>
              s.tier.toLowerCase() === selectedPlan.toLowerCase()
                ? { ...s, status: "canceled" }
                : s,
            ),
          };
        });

        toast.success("Subscription cancelled.");
      }
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
      // Optional: Refetch to ensure state is actually correct if something went wrong
      queryClient.invalidateQueries({ queryKey: ["user"] });
    } finally {
      setIsProcessing(false);
      setIsModalOpen(false);
    }
  };
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative">
        {dict.pricing.plans.map(
          (
            { title, monthlyPrice, description, offers, popular },
            id: number,
          ) => {
            const active = id === activePlan;
            const isSubscribed = getSubStatus(title);

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
                      onClick={() =>
                        handleInitiation(
                          isSubscribed ? "cancel" : "subscribe",
                          title,
                        )
                      }
                      disabled={isUserLoading}
                      className={`w-full py-3 font-medium rounded-lg text-white transition-opacity hover:opacity-90 disabled:opacity-50 flex justify-center items-center gap-2 ${
                        isSubscribed
                          ? "bg-accent-main/50"
                          : active
                            ? "bg-black"
                            : "bg-accent-main"
                      }`}
                    >
                      {isUserLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isSubscribed ? (
                        "Cancel Subscription"
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
            <h3 className="text-2xl font-bold mb-2">
              {modalAction === "subscribe"
                ? "Confirm Subscription"
                : "Cancel Subscription"}
            </h3>
            <p className="text-foreground/70 mb-6 leading-relaxed">
              {modalAction === "subscribe"
                ? `Are you sure you want to subscribe to the ${selectedPlan} plan?`
                : `Are you sure you want to cancel your ${selectedPlan} subscription?`}
            </p>

            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isProcessing}
                className="flex-1 py-2.5 rounded-lg border border-sub hover:bg-foreground/5 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isProcessing}
                className={`flex-1 flex justify-center items-center gap-2 py-2.5 rounded-lg text-white transition-colors disabled:opacity-70 font-medium ${
                  modalAction === "cancel"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-accent-main hover:bg-accent-main/90"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : modalAction === "subscribe" ? (
                  "Yes, Subscribe"
                ) : (
                  "Yes, Cancel"
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
