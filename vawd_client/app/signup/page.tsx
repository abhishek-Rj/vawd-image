import type { Metadata } from "next";
import SignupForm from "@/app/components/SignupForm";
import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign_up — Vawd_Image",
  description:
    "Create your VAWD_IMAGE account to start searching images with AI-powered visual understanding.",
};

export default async function SignupPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/explore");
  }
  return (
    <div className="flex min-h-screen bg-bg">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between px-12 py-12 grid-border-r relative">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-1 text-sm font-bold tracking-widest text-fg uppercase transition-opacity hover:opacity-70"
        >
          <span className="text-accent">▌</span>
          VAWD<span className="text-fg-muted font-normal">_IMAGE</span>
        </Link>

        {/* Big Type */}
        <div>
          <h1 className="text-6xl xl:text-7xl font-bold tracking-tight text-fg uppercase leading-[1.05]">
            CREATE
            <br />
            <span className="text-accent">_ACCOUNT</span>
          </h1>
          <div className="mt-6 grid-border-t pt-6">
            <p className="text-xs text-fg-dim uppercase tracking-[0.15em] max-w-xs leading-relaxed font-supply">
              CREATE YOUR ACCOUNT TO START EXPLORING AI-POWERED VISUAL SEARCH.
              UPLOAD. DISCOVER. FIND.
            </p>
          </div>
        </div>

        {/* Bottom detail */}
        <div className="flex items-center gap-4 text-[10px] text-fg-dim uppercase tracking-widest font-supply">
          <span>FREE TIER</span>
          <span className="text-border">│</span>
          <span>INSTANT ACCESS</span>
          <span className="text-border">│</span>
          <span>NO LIMITS</span>
        </div>
      </div>

      {/* Right — Form Panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sm font-bold tracking-widest text-fg uppercase"
            >
              <span className="text-accent">▌</span>
              VAWD<span className="text-fg-muted font-normal">_IMAGE</span>
            </Link>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-fg uppercase lg:hidden">
              CREATE<span className="text-accent">_ACCOUNT</span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.15em] text-fg-dim lg:text-xs font-supply">
              FILL IN YOUR DETAILS TO GET STARTED
            </p>
          </div>

          {/* Form */}
          <div className="grid-border p-6">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}
