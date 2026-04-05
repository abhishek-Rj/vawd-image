import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import HeroAsciiArt from "./components/HeroAsciiArt";

export const metadata: Metadata = {
    title: "VAWD_IMAGE — AI-Powered Visual Search",
    description:
        "Search images by what they look like, not just what they're tagged with. VAWD Image uses CLIP embeddings and vector search to understand visual content.",
};

export default function Home() {
    return (
        <div className="min-h-screen bg-bg">
            <Navbar />

            {/* ════════════════════════════════════════════════════════════
          HERO
          ════════════════════════════════════════════════════════════ */}
            <section className="relative pt-14">
                <div className="mx-auto max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">
                    {/* Left — Copy */}
                    <div className="flex flex-col justify-center px-8 py-16 lg:py-24 lg:px-12 lg:grid-border-r">
                        {/* Badge */}
                        <div className="badge-accent mb-8 w-fit animate-fade-in">
                            <span className="inline-block h-1.5 w-1.5 bg-accent" />
                            POWERED BY VAWD
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-fg leading-[1.05] uppercase animate-fade-in animate-delay-1">
                            SEARCH IMAGES
                            <br />
                            BY WHAT THEY
                            <br />
                            <span className="text-fg-muted">LOOK LIKE</span>
                        </h1>

                        {/* Sub */}
                        <p className="mt-8 max-w-md text-sm leading-relaxed text-fg-muted font-supply animate-fade-in animate-delay-2">
                            Forget tags and filenames. Upload your images and
                            let our AI understand what&apos;s in them. Search
                            with natural language and find visually similar
                            results in milliseconds.
                        </p>

                        {/* CTAs */}
                        <div className="mt-10 flex flex-wrap gap-3 animate-fade-in animate-delay-3">
                            <Link
                                href="/signup"
                                id="hero-cta-signup"
                                className="btn-brutal-fill"
                            >
                                GET_STARTED →
                            </Link>
                            <Link
                                href="#features"
                                id="hero-cta-learn"
                                className="btn-brutal"
                            >
                                LEARN_MORE
                            </Link>
                        </div>
                    </div>

                    {/* Right — ASCII Art */}
                    <div className="flex items-center justify-center px-8 py-16 lg:py-24 lg:px-12">
                        <HeroAsciiArt />
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
          STATS BAR
          ════════════════════════════════════════════════════════════ */}
            <section className="grid-border-t grid-border-b">
                <div className="mx-auto max-w-[1200px] grid grid-cols-2 sm:grid-cols-4">
                    {[
                        { value: "512", label: "EMBEDDING DIMS" },
                        { value: "<50ms", label: "SEARCH LATENCY" },
                        { value: "CLIP", label: "VISION MODEL" },
                        { value: "∞", label: "SCALABILITY" },
                    ].map((stat, i) => (
                        <div
                            key={stat.label}
                            className={`px-6 py-8 text-center ${i < 3 ? "grid-border-r" : ""}`}
                        >
                            <p className="text-2xl sm:text-3xl font-bold text-fg tracking-tight">
                                {stat.value}
                            </p>
                            <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-fg-dim font-supply">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
          FEATURES
          ════════════════════════════════════════════════════════════ */}
            <section id="features" className="grid-border-b">
                <div className="mx-auto max-w-[1200px]">
                    {/* Section Header */}
                    <div className="px-8 py-12 lg:px-12 grid-border-b">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold font-supply">
                            [CAPABILITIES]
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg uppercase">
                            WHY VAWD_IMAGE
                        </h2>
                        <p className="mt-3 text-sm text-fg-muted font-supply max-w-lg">
                            Traditional search matches keywords. We match visual
                            meaning.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {[
                            {
                                id: "01",
                                title: "VISUAL_UNDERSTANDING",
                                desc: "CLIP doesn't rely on tags — it 'sees' the image and maps its visual content to a rich semantic space.",
                            },
                            {
                                id: "02",
                                title: "BLAZING_FAST",
                                desc: "Vector database returns similarity matches in under 50ms, even at massive scale.",
                            },
                            {
                                id: "03",
                                title: "RAG_PIPELINE",
                                desc: "Retrieval-Augmented Generation pipeline combines embedding-based retrieval with intelligent ranking.",
                            },
                            {
                                id: "04",
                                title: "512D_EMBEDDINGS",
                                desc: "Each image is distilled into a dense 512-dimensional vector capturing its complete visual essence.",
                            },
                            {
                                id: "05",
                                title: "NATURAL_LANGUAGE",
                                desc: 'Search with plain language — type "sunset over ocean" and find visually matching images instantly.',
                            },
                            {
                                id: "06",
                                title: "SECURE_PRIVATE",
                                desc: "Your images stay private. Auth-protected with encrypted embeddings at rest.",
                            },
                        ].map((feature, i) => (
                            <div
                                key={feature.id}
                                className="group px-8 py-8 lg:px-10 transition-colors hover:bg-surface"
                                style={{
                                    borderBottom:
                                        i < 3
                                            ? "1px solid var(--color-border)"
                                            : undefined,
                                    borderRight:
                                        i % 3 !== 2
                                            ? "1px solid var(--color-border)"
                                            : undefined,
                                }}
                            >
                                <span className="text-[10px] text-accent font-bold tracking-widest font-supply">
                                    [{feature.id}]
                                </span>
                                <h3 className="mt-3 text-sm font-bold text-fg uppercase tracking-wide">
                                    {feature.title}
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-fg-muted font-supply">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════════════════════════════ */}
            <section className="grid-border-b">
                <div className="mx-auto max-w-[1200px]">
                    {/* Section Header */}
                    <div className="px-8 py-12 lg:px-12 grid-border-b">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-accent mb-3 font-bold font-supply">
                            [WORKFLOW]
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg uppercase">
                            HOW IT WORKS
                        </h2>
                        <p className="mt-3 text-sm text-fg-muted font-supply">
                            Three steps to visual search.
                        </p>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3">
                        {[
                            {
                                step: "01",
                                title: "UPLOAD",
                                desc: "Upload your images through the web interface. CLIP processes each one into a 512-d embedding vector automatically.",
                            },
                            {
                                step: "02",
                                title: "INDEX",
                                desc: "Embeddings are stored in our vector database for instant, scalable similarity search across your entire collection.",
                            },
                            {
                                step: "03",
                                title: "SEARCH",
                                desc: "Type a natural language query or upload a reference image. Get visually similar results in milliseconds.",
                            },
                        ].map((item, i) => (
                            <div
                                key={item.step}
                                className="px-8 py-10 lg:px-10"
                                style={{
                                    borderRight:
                                        i < 2
                                            ? "1px solid var(--color-border)"
                                            : undefined,
                                }}
                            >
                                <span className="text-3xl font-bold text-fg-dim leading-none">
                                    {item.step}
                                </span>
                                <h3 className="mt-4 text-sm font-bold text-fg uppercase tracking-wide">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-xs leading-relaxed text-fg-muted font-supply">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
          TECH STACK — LOGO STRIP
          ════════════════════════════════════════════════════════════ */}
            <section className="grid-border-b">
                <div className="mx-auto max-w-[1200px]">
                    <div className="px-8 py-6 lg:px-12 grid-border-b">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-fg-dim font-bold font-supply">
                            [STACK]
                        </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4">
                        {["OPENAI CLIP", "PINECONE", "KAFKA", "AWS S3"].map(
                            (tech, i) => (
                                <div
                                    key={tech}
                                    className="px-6 py-6 text-center"
                                    style={{
                                        borderRight:
                                            i < 3
                                                ? "1px solid var(--color-border)"
                                                : undefined,
                                    }}
                                >
                                    <span className="text-xs font-bold text-fg-muted tracking-[0.15em] uppercase font-supply">
                                        {tech}
                                    </span>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
          CTA
          ════════════════════════════════════════════════════════════ */}
            <section className="grid-border-b">
                <div className="mx-auto max-w-[1200px] px-8 py-20 lg:px-12 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-fg uppercase">
                        READY TO SEE
                        <br />
                        BEYOND TAGS?
                    </h2>
                    <p className="mt-4 text-sm text-fg-muted max-w-md mx-auto font-supply">
                        Join VAWD_IMAGE and experience truly intelligent visual
                        search.
                    </p>
                    <div className="mt-8 flex justify-center">
                        <Link
                            href="/signup"
                            id="cta-signup"
                            className="btn-brutal-fill"
                        >
                            START_FOR_FREE →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════
          FOOTER
          ════════════════════════════════════════════════════════════ */}
            <footer>
                <div className="mx-auto max-w-[1200px] flex flex-col items-center justify-between gap-4 px-8 py-6 sm:flex-row lg:px-12">
                    <div className="flex items-center gap-2 text-xs font-bold text-fg-muted uppercase tracking-widest">
                        <span className="text-accent">▌</span>
                        VAWD<span className="font-normal">_IMAGE</span>
                    </div>
                    <p className="text-[10px] text-fg-dim uppercase tracking-widest font-supply">
                        © {new Date().getFullYear()} VAWD_IMAGE. ALL RIGHTS
                        RESERVED.
                    </p>
                </div>
            </footer>
        </div>
    );
}
