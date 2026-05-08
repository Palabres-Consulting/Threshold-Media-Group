"use client";

import React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StatsTracker = () => {
  // 11 MVP Indicators
  const statsData = [
    { id: "gold", title: "Gold (Mining)", stat: "2,150.40", status: "bull" },
    { id: "bauxite", title: "Bauxite (Mining)", stat: "142.50", status: "bear" },
    { id: "iron", title: "Iron (Mining)", stat: "+1.2%", status: "bull" },
    { id: "fdi", title: "FDI (ASINT)", stat: "$1.2B", status: "bull" },
    { id: "stability", title: "Stability Index", stat: "74/100", status: "bear" },
    { id: "usdgnf", title: "USD/GNF", stat: "8,620", status: "bear" },
    { id: "eurognf", title: "Euro/GNF", stat: "9,340", status: "bull" },
    { id: "fuel", title: "Fuel Price", stat: "12,000 FG", status: "bear" },
    { id: "internet", title: "Internet Pen.", stat: "34.2%", status: "bull" },
    { id: "momoney", title: "Mobile Money", stat: "+5.4%", status: "bull" },
    { id: "events", title: "Monthly Events", stat: "12", status: "bull" },
  ];

  // Doubling the array ensures the loop is seamless for the motion animation
  const duplicatedData = [...statsData, ...statsData];

  return (
    <div className="lg:p-6 relative flex bg-[var(--background)]/90 overflow-hidden group">
      {/* Fade Gradients - Using CSS variables */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[var(--background)] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[var(--background)] to-transparent z-10 pointer-events-none"></div>

      <motion.div 
        className="flex gap-2"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          duration: 120, // Adjust this for speed
          ease: "linear",
          repeat: Infinity,
        }}
        // The "hover to pause" feature using Framer Motion logic
        whileHover={{ animationPlayState: "paused" }}
      >
        {duplicatedData.map(({ id, stat, title, status }, index) => (
          <div
            key={`${id}-${index}`}
            className="flex min-w-[14em] justify-center items-center rounded-md bg-stone-900 py-2 px-6 gap-2 text-xs text-[var(--foreground)] border border-stone-800"
          >
            <h5 className="text-stone-400 text-xs text-nowrap">{title}</h5>
            <div
              className={`flex items-center gap-1 text-nowrap font-medium ${
                status === "bull" ? "text-green-500" : "text-red-500"
              }`}
            >
              <span>{status === "bull" ? <FaAngleUp /> : <FaAngleDown />}</span>
              {stat}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default StatsTracker;