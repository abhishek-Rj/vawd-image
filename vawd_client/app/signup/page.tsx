import type { Metadata } from "next";
import SignupForm from "@/app/components/SignupForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign up — VAWD Image",
  description:
    "Create your VAWD Image account to start searching images with AI-powered visual understanding.",
};

export default function SignupPage() {
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
            Create your account
          </h1>
          <p className="text-sm text-muted">
            Get started with AI-powered image search
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-xl border border-border bg-surface/50 p-6 backdrop-blur-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
