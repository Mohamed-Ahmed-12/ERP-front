"use client";

import { useAuth } from "@/context/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export function LoginForm() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await login(data);
      toast.success("Signed in successfully");
      reset();
    } catch {
      toast.error("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-sm space-y-5"
    >
      {/* Header */}
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
        <p className="text-gray-500 text-sm mt-1">
          Enter your credentials to access your account
        </p>
      </div>

      {/* Username */}
      <div className="space-y-1.5">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <input
          id="username"
          type="text"
          autoComplete="username"
          placeholder="johndoe"
          className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            ${errors.username ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"}`}
          {...register("username", { required: "Username is required" })}
        />
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-gray-400"}`}
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400
          text-white text-sm font-semibold rounded-lg transition-colors
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </button>
    </form>
  );
}
