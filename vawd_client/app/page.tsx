import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "VAWD Image — AI-Powered Visual Search",
  description:
    "Search images by what they look like, not just what they're tagged with. VAWD Image uses CLIP embeddings and vector search to understand visual content.",
};

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-muted hover:bg-surface-hover">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-muted text-accent">
        {icon}
      </div>
      <h3 className="mb-2 text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
        {/* Background effects */}
        <div className="fixed inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-4 py-1.5 text-xs text-muted backdrop-blur-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Powered by OpenAI CLIP &amp; Pinecone
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl animate-fade-in-up animate-delay-100">
            Search images by{" "}
            <span className="gradient-text">what they look like</span>
          </h1>

          {/* Sub */}
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted sm:text-lg animate-fade-in-up animate-delay-200">
            Forget tags and filenames. VAWD Image understands visual content
            using 512-dimensional CLIP embeddings and blazing-fast vector search
            to find exactly what you need.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in-up animate-delay-300">
            <Link
              href="/signup"
              id="hero-cta-signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90 glow"
            >
              Get started
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="#features"
              id="hero-cta-learn"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-sm text-foreground transition-all hover:bg-surface-hover hover:border-muted"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 border-y border-border bg-surface/30 py-16">
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-6 sm:grid-cols-4">
          <StatBlock value="512" label="Embedding dims" />
          <StatBlock value="<50ms" label="Search latency" />
          <StatBlock value="CLIP" label="Vision model" />
          <StatBlock value="∞" label="Scalability" />
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why VAWD Image?
            </h2>
            <p className="mt-4 text-muted">
              Traditional search matches keywords. We match visual meaning.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              }
              title="Visual Understanding"
              description="CLIP doesn't rely on tags — it 'sees' the image and maps its visual content to a rich semantic space."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              title="Blazing Fast"
              description="Pinecone vector database returns similarity matches in under 50ms, even at massive scale."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  />
                </svg>
              }
              title="RAG Pipeline"
              description="Retrieval-Augmented Generation pipeline combines embedding-based retrieval with intelligent ranking."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              }
              title="512-D Embeddings"
              description="Each image is distilled into a dense 512-dimensional vector capturing its complete visual essence."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              }
              title="Natural Language"
              description='Search with plain language — type "sunset over ocean" and find visually matching images instantly.'
            />
            <FeatureCard
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              title="Secure & Private"
              description="Your images stay private. Authentication-protected with encrypted embeddings at rest."
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 border-t border-border bg-surface/20 py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted">Three simple steps to visual search</p>

          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload",
                desc: "Drop your images. CLIP processes each one into a 512-d embedding vector.",
              },
              {
                step: "02",
                title: "Index",
                desc: "Embeddings are stored in Pinecone for instant, scalable similarity search.",
              },
              {
                step: "03",
                title: "Search",
                desc: "Type a query or upload a reference image. Get visually similar results in milliseconds.",
              },
            ].map((item) => (
              <div key={item.step} className="space-y-3">
                <span className="text-3xl font-bold text-accent/30 font-mono">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 border-t border-border py-24 px-6">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to see beyond tags?
          </h2>
          <p className="text-muted">
            Join VAWD Image and experience truly intelligent visual search.
          </p>
          <Link
            href="/signup"
            id="cta-signup"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90"
          >
            Start for free
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted">
            <svg
              className="h-4 w-4 text-accent"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            <span>vawd image</span>
          </div>
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} VAWD Image. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
