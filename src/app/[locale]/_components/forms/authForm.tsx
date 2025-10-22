"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { useLocalization } from "../../context/localizationContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

type FormState = "signIn" | "signUp";

const AuthContainer = () => {
  const [formState, setFormState] = useState<FormState>("signIn");
  const { dict } = useLocalization();

  // ✅ Schema with conditional validation
  const authSchema = z
    .object({
      email: z.string().email({ message: "Invalid email address" }),
      password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" }),
      confirmPassword: z.string().optional(),
    })
    .refine(
      (data) =>
        formState === "signIn" || data.password === data.confirmPassword,
      {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      }
    );

  type AuthSchema = z.infer<typeof authSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  });

  // ✅ Handle Submit
  const onSubmit = async (data: AuthSchema) => {
    try {
      if (formState === "signIn") {
        console.log("Logging in with:", data);
        await axios.post("/api/auth/login", data);
      } else {
        console.log("Signing up with:", data);
        await axios.post("/api/auth/signUp", data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const buttonState: { id: number; name: FormState; text: string }[] = [
    {
      id: 0,
      text: dict.auth.buttons.signIn,
      name: "signIn",
    },
    {
      id: 1,
      text: dict.auth.buttons.signUp,
      name: "signUp",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl lg:p-6 p-3 flex flex-col gap-6 lg:w-[25em] border-sub"
    >
      {/* Toggle Sign In / Sign Up */}
      <div className="rounded-[2em] flex w-full p-1 border-sub">
        {buttonState.map(({ id, name, text }) => (
          <button
            key={id}
            type="button"
            className={`rounded-[2em] cursor-pointer w-full py-3 transition-all duration-400 ${
              formState === name
                ? "bg-accent-main text-white"
                : "hover:bg-foreground/5"
            }`}
            onClick={() => setFormState(name)}
          >
            {text}
          </button>
        ))}
      </div>

      {/* Google Button */}
      <button
        className="flex cursor-pointer hover:bg-accent-main hover:text-white justify-center gap-4 py-4 rounded-lg w-full px-5 font-semibold items-center border-sub bg-foreground/5 text-center"
        type="button"
      >
        <FaGoogle /> {dict.auth.buttons.google}
      </button>

      {/* Divider */}
      <div className="flex gap-4 items-center">
        <div className="h-[2px] bg-foreground/5 w-full"></div>
        <p>{dict.auth.divider}</p>
        <div className="h-[2px] bg-foreground/5 w-full"></div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email">{dict.auth.fields.email.label}</label>
        <input
          {...register("email")}
          className="input"
          type="text"
          placeholder={dict.auth.fields.email.placeholder}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password">{dict.auth.fields.password.label}</label>
        <input
          {...register("password")}
          className="input"
          type="password"
          placeholder={dict.auth.fields.password.placeholder}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password (only for Sign Up) */}
      {formState === "signUp" && (
        <div>
          <label htmlFor="confirmPassword">
            {dict.auth.fields.confirmPassword.label}
          </label>
          <input
            {...register("confirmPassword")}
            className="input"
            type="password"
            placeholder={dict.auth.fields.confirmPassword.placeholder}
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
      )}

      {/* Forgot Password (only for Sign In) */}
      {formState === "signIn" && (
        <div>
          <Link href="/auth/forgotPassword" className="text-accent-main">
            {dict.auth.forgotPassword}
          </Link>
        </div>
      )}

      {/* Submit Button */}
      <button type="submit" className="btn-var1" disabled={isSubmitting}>
        {isSubmitting
          ? "Please wait..."
          : formState === "signIn"
          ? dict.auth.submit.signIn
          : dict.auth.submit.signUp}
      </button>
    </form>
  );
};

export default AuthContainer;
