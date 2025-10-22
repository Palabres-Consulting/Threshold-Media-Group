"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./toasters";

const getSchema = (field: string) =>
  z.object({
    oldValue:
      field.toLowerCase() === "Old Password"
        ? z.string().min(6, "Password must be at least 6 characters")
        : z.string().min(2, `${field} is too short`),
    newValue:
      field.toLowerCase() === "New Password"
        ? z.string().min(6, "Password must be at least 6 characters")
        : z.string().min(2, `${field} is too short`),
  });

const updateProfileField = async (
  title: string,
  newValue: string,
  oldValue: string
) => {
  if (title === "Password") {
    const response = await axios.post("/api/profile/update_password", {
      newPassword: newValue,
      oldPassword: oldValue,
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
  title: "Password" | "Title" | "By Mail";
  value: string;
}> = ({ title, value, editButton }) => {
  const [editActive, setEditActive] = useState(false);
  const queryClient = useQueryClient();

  const { setSuccess, toast, removeToast, setError } = useToast();

  const form = useForm<{ oldValue: string; newValue: string }>({
    resolver: zodResolver(getSchema(title)),
    defaultValues: { oldValue: value, newValue: "" },
  });

  // Clean mutation hook
  const mutation = useMutation({
    mutationFn: (data: { newValue: string; oldValue: string }) =>
      updateProfileField(title, data.newValue, data.oldValue),
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const prevUser = queryClient.getQueryData<any>(["user"]);

      // optimistic update (only for title)
      if (title === "Title") {
        queryClient.setQueryData(["user"], (old: any) => ({
          ...old,
          title: data.newValue,
        }));
      }

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
            <p>{value}</p>
          )}
        </div>
        {editButton && (
          <div className="">
            {" "}
            <button
              onClick={() => setEditActive(!editActive)}
              className="btn-var1 cursor-pointer"
              type="button"
            >
              {" "}
              {!editActive ? "Change" : "Cancel"}{" "}
            </button>{" "}
          </div>
        )}
      </div>

      {editActive && (
        <div className="py-4 transition-all duration-300">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {title === "Password" && (
              <input
                type={title === "Password" ? "password" : "text"}
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
            <label className="" htmlFor=""></label>
            <input
              type={title === "Password" ? "password" : "text"}
              id="newPassowrd"
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
        </div>
      )}
    </div>
  );
};
