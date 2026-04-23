"use client";

import { LucideProps } from "lucide-react";
import React from "react";

const ErrorPage = () => {
  return (
    <section className="">
      <div className=""></div>
    </section>
  );
};

export default ErrorPage;

export type iconType = React.ForwardRefExoticComponent<
  Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;


export const ErrorComponent = ({
  children, // Use children instead of icon prop
  errorTitle,
  errorMessage,
}: {
  children?: React.ReactNode;
  errorTitle: string;
  errorMessage: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[var(--background)] text-[var(--foreground)] border border-[var(--foreground)]/10 rounded-2xl">
      <div className="mb-4 text-[var(--foreground)]/50">
        {children} 
      </div>
      <div className="text-center">
        <h3 className="text-xl font-bold tracking-tight">{errorTitle}</h3>
        <p className="mt-2 text-[var(--foreground)]/60 max-w-xs">{errorMessage}</p>
      </div>
    </div>
  );
};