"use client";
import { useTranslations } from "@/lib/locale/context/translationContext";
import React from "react";

const ForgotPasswordForm = () => {
  const dict  = useTranslations("main");

  return (
    <form className="rounded-2xl p-6 flex flex-col gap-5 lg:w-[35vw] border-sub">
      <div className="text-center">
        <h2 className="text-[2rem] font-bold mb-5">
          {dict.auth.forgotPasswordPage.title}
        </h2>

        <p className="mb-5">{dict.auth.forgotPasswordPage.description}</p>
      </div>

      <div>
        <input
          className="input"
          placeholder={dict.auth.forgotPasswordPage.placeholder}
          type="text"
        />
      </div>

      <button className="btn-var1">
        {dict.auth.forgotPasswordPage.submit}
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
