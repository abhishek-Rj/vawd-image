"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Integrate with vawd auth service
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* Email */}
      <div className="space-y-2">
        <label
          htmlFor="login-email"
          className="block text-sm font-medium text-foreground"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none hover:border-muted"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-foreground"
          >
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <input
          id="login-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted transition-all duration-200 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none hover:border-muted"
        />
      </div>

      {/* Submit */}
      <button
        id="login-submit"
        type="submit"
        disabled={isLoading}
        className="relative w-full rounded-lg bg-foreground py-2.5 text-sm font-medium text-background transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
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
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Signing in…
          </span>
        ) : (
          "Continue"
        )}
      </button>

      {/* Divider */}
      <div className="relative flex items-center py-2">
        <div className="flex-1 border-t border-border" />
        <span className="px-4 text-xs text-muted">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* OAuth placeholder */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-border py-2.5 text-sm text-foreground transition-all duration-200 hover:bg-surface-hover hover:border-muted"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Footer */}
      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-foreground font-medium hover:underline underline-offset-4"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
