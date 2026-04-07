"use client";

import { TranslationSchema } from "@/app/lib/locale";
import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

const Plans = ({dict}: {dict: TranslationSchema["main"]}) => {
  const [activePlan, setActivePlan] = useState(1);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {dict.pricing.plans.map(
          (
            { title, price, description, offers, popular },
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
                      <div className="bg-stone-950 text-white rounded-md p-1">
                        {popular}
                      </div>
                    )}
                  </div>
                </div>
                <div className="py-5 text-foreground/50 border-sub-y">
                  <div className="flex items-center  gap-3 text-[2rem]">
                    <span>$</span>
                    <span
                      className={`font-bold text-[3rem] mb-2 ${
                        active ? "text-black" : "text-foreground"
                      }`}
                    >
                      {price}
                    </span>
                    <span>/</span>
                    <span className={`${active ? "text-white" : ""}`}>
                      {dict.pricing.month}
                    </span>
                  </div>
                  <p className="text-center">{description}</p>
                  <div className="mt-5">
                    <button
                      className={`w-full py-2 rounded-lg text-white ${
                        active ? "bg-black" : "bg-accent-main"
                      } `}
                    >
                      {dict.pricing.subscribe}
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 mt-5">
                  {offers.map((offer: string, index: number) => (
                    <div
                      key={index}
                      className="flex py-2 px-3 border-sub rounded-lg items-baseline gap-3"
                    >
                      <FaCheckCircle /> {offer}
                    </div>
                  ))}
                </div>
              </div>
            );
          },
        )}
      </div>
    </>
  );
};

export default Plans;
