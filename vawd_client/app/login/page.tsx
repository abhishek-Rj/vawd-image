import type { Metadata } from "next";
import LoginForm from "@/app/components/LoginForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Log in — VAWD Image",
  description:
    "Log in to VAWD Image to search, discover, and explore images using AI-powered visual search.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Subtle dot grid background */}
      <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold text-foreground"
          >
            <svg
              className="h-5 w-5 text-accent"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            vawd <span className="text-muted font-normal">image</span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-sm text-muted">
            Log in to your account to continue
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-border bg-surface/50 p-6 backdrop-blur-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
