"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";

const AuthContainer = () => {
  const [formState, setFormState] = useState<string>("signIn");

  const buttonState = [
    {
      id: 0,
      text: "Sign In",
      name: "signIn",
    },
    {
      id: 1,
      text: "Create Account",
      name: "signUp",
    },
  ];

  return (
    <form className="rounded-2xl lg:p-6 flex flex-col gap-6 lg:w-[25em] border-sub">
      <div className="rounded-[2em] flex w-full p-1 border-sub">
        {buttonState.map(({ id, name, text }) => {
          return (
            <button
              key={id}
              type="button"
              className={` rounded-[2em] cursor-pointer   w-full py-3 transition-all duration-400  ${
                formState === name
                  ? "bg-accent-main text-white"
                  : " hover:bg-foreground/5"
              }`}
              onClick={() => setFormState(name)}
            >
              {text}
            </button>
          );
        })}
      </div>

      <button
        className="flex cursor-pointer hover:bg-accent-main hover:text-white justify-center gap-4 py-4 rounded-lg w-full px-5 font-semibold items-center border-sub bg-foreground/5 text-center"
        type="button"
      >
        <FaGoogle /> Sign in with Google
      </button>
      <div className="flex gap-4 items-center">
        <div className="h-[2px] bg-foreground/5 w-full"></div>
        <p className="">Or</p>
        <div className="h-[2px] bg-foreground/5 w-full"></div>
      </div>

      <div className="">
        <label htmlFor="email">E-mail *</label>
        <input className="input" type="text" placeholder="Input E-mail" />
      </div>

      <div className="">
        <label htmlFor="email">Password *</label>
        <input className="input" type="text" placeholder="Input Password" />
      </div>
      <div className={`${formState === "signIn" ? "hidden" : ""}`}>
        <label htmlFor="email">Confirm Password *</label>
        <input className="input" type="text" placeholder="confirm Password" />
      </div>

      <div className={`${formState === "signUp" ? "hidden" : ""}`}>
        <Link href="/auth/forgotPassword" className="text-accent-main">
          Forgot Password
        </Link>
      </div>

      <button type="submit" className="btn-var1">
        Sign In
      </button>
    </form>
  );
};

export default AuthContainer;
