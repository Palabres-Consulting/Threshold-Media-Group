"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/toasters";
import { PersonaSelector, InterestsSelector } from "./profileSelector"; // Adjust import path

const getSchema = (field: string) =>
  z.object({
    oldValue:
      field.toLowerCase() === "old password"
        ? z.string().min(6, "Password must be at least 6 characters")
        : z.string().min(2, `${field} is too short`),
    newValue:
      field.toLowerCase() === "new password"
        ? z.string().min(6, "Password must be at least 6 characters")
        : z.string().min(2, `${field} is too short`),
  });

// 1. Updated API caller to handle the new routes
const updateProfileField = async (
  title: string,
  newValue: string | string[],
  oldValue: string | string[] | undefined,
) => {
  if (title === "Password") {
    const response = await axios.post("/api/profile/update_password", {
      newPassword: newValue,
      oldPassword: oldValue,
    });
    return response.data;
  } else if (title === "Interests") {
    const response = await axios.patch("/api/profile/update_interest", {
      interests: newValue,
    });
    return response.data;
  } else if (title === "Persona") {
    const response = await axios.patch("/api/profile/update_persona", {
      avatar_url: newValue,
    });
    return response.data;
  } else {
    const response = await axios.patch("/api/profile/update_title", {
      title: newValue,
    });
    return response.data;
  }
};

export const ProfileItem: React.FC<{
  editButton: boolean;
  title: string;
  value?: string | string[]; // Allow array for interests
}> = ({ title, value, editButton }) => {
  const [editActive, setEditActive] = useState(false);
  const queryClient = useQueryClient();
  const { setSuccess, setError } = useToast();

  const form = useForm<{ oldValue: string; newValue: string }>({
    resolver: zodResolver(getSchema(title)),
    // Only pass string values to the standard form
    defaultValues: {
      oldValue: typeof value === "string" ? value : "",
      newValue: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: {
      newValue: string | string[];
      oldValue?: string | string[];
    }) => updateProfileField(title, data.newValue, data.oldValue),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const prevUser = queryClient.getQueryData<any>(["user"]);

      // 2. Optimistic updates for all field types
      queryClient.setQueryData(["user"], (old: any) => {
        if (!old) return old;
        if (title === "Title") return { ...old, title: data.newValue };
        if (title === "Interests") return { ...old, interests: data.newValue };
        if (title === "Persona") return { ...old, avatar_type: data.newValue };
        return old;
      });

      return { prevUser };
    },
    onError: (_err, _data, ctx) => {
      if (ctx?.prevUser) {
        queryClient.setQueryData(["user"], ctx.prevUser);
      }
      setError(`Failed to update ${title.toLowerCase()}`);
    },
    onSuccess: () => {
      setSuccess(`${title} updated successfully`);
      setEditActive(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const onSubmit = (data: { oldValue: string; newValue: string }) => {
    mutation.mutate({ newValue: data.newValue, oldValue: data.oldValue });
  };

  // Helper to display the current value cleanly
  const renderDisplayValue = (title: string) => {
    if (title === "Password") {
      return <p>********</p>;
    }

    if (title.toLocaleLowerCase() === "email") {
      return <p className="">{value}</p>;
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
      return (
        <p className="blur- animate-pulse  rounded-full bg-accent-main/50 px-2 text-foreground/80 font-semibold text-sm">
          Set your {title}
        </p>
      );
    }
    if (Array.isArray(value)) {
      return <p>{value.join(", ")}</p>;
    }
    return <p>{value}</p>;
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center">
        <div className={`flex flex-col ${editButton ? "gap-5" : "gap-2"}`}>
          <h6>{title}</h6>

          {title === "Password" &&
          typeof value === "string" &&
          value.startsWith("oauth:") ? (
            <p className="text-sm text-gray-500">
              Signed up with {value.split("oauth:")[1] || "an OAuth provider"}.
              Password is managed by the provider and can't be changed here.
            </p>
          ) : (
            <div>{renderDisplayValue(title)}</div>
          )}
        </div>

        {editButton && (
          <div className="">
            <button
              onClick={() => setEditActive(!editActive)}
              className="btn-var1 cursor-pointer"
              type="button"
            >
              {!editActive ? "Edit" : "Cancel"}
            </button>
          </div>
        )}
      </div>

      {/* 3. Conditional Rendering based on Title */}
      {editActive && (
        <div className="py-4 transition-all duration-300">
          {title === "Interests" ? (
            <InterestsSelector
              currentValues={Array.isArray(value) ? value : []}
              onSave={(newInterests) =>
                mutation.mutate({ newValue: newInterests, oldValue: value })
              }
              onClose={() => setEditActive(false)}
              isPending={mutation.status === "pending"}
            />
          ) : title === "Persona" ? (
            <PersonaSelector
              currentValue={typeof value === "string" ? value : ""}
              onSave={(newPersona) =>
                mutation.mutate({ newValue: newPersona, oldValue: value })
              }
              isPending={mutation.status === "pending"}
            />
          ) : (
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >
              {title === "Password" && (
                <input
                  type="password"
                  className="input"
                  placeholder={`Input your old ${title}`}
                  {...form.register("oldValue")}
                />
              )}
              {form.formState.errors.oldValue && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.oldValue?.message}
                </p>
              )}

              {/* Render a text input for other fields - avatar, title */}
              <input
                type={title === "Password" ? "password" : "text"}
                className="input"
                placeholder={`Input your new ${title}`}
                {...form.register("newValue")}
              />
              {form.formState.errors.newValue && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.newValue?.message}
                </p>
              )}

              <div className="lg:w-[20%]">
                <button
                  type="submit"
                  className="mt-3 btn-var1 cursor-pointer"
                  disabled={mutation.status === "pending"}
                >
                  {mutation.status === "pending" ? "Saving..." : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
