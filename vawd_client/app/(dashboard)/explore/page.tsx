import SearchBar from "@/app/components/explore/SearchBar";

export default function ExplorePage() {
  // Generate deterministic-ish sizes for masonry (to avoid hydration mismatch if this were dynamic, but we can just hardcode an array of heights for simplicity)
  const heights = [
    250, 420, 310, 380, 200, 300, 410, 260, 390, 290, 450, 320, 240, 370, 280, 430, 210, 340, 270, 400, 330, 460, 220, 360
  ];

  return (
    <div className="w-full min-h-full relative pb-40">
      
      {/* Header section (optional, to maintain brutalist aesthetic padding) */}
      <div className="px-8 py-10 grid-border-b bg-bg/50 backdrop-blur sticky top-0 z-30 pointer-events-none">
        <h1 className="text-2xl font-bold tracking-tight text-fg uppercase">
          EXPLORE<span className="text-accent">_MEDIA</span>
        </h1>
        <p className="mt-2 text-xs text-fg-dim font-supply uppercase tracking-[0.15em]">
          DISCOVER VISUAL CONTENT ACROSS THE NETWORK
        </p>
      </div>

      {/* Masonry Grid */}
      <div className="p-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {heights.map((height, i) => (
            <div
              key={i}
              className="break-inside-avoid bg-surface grid-border group relative overflow-hidden transition-all hover:border-fg w-full"
              style={{ height: `${height}px` }}
            >
              {/* Minimal box decorations */}
              <div className="absolute top-4 left-4 flex gap-1.5">
                <div className="w-2 h-2 bg-accent opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
              </div>
              
              {/* Pseudo image ID */}
              <div className="absolute bottom-4 right-4 text-[10px] font-supply text-border-light uppercase group-hover:text-fg-muted transition-colors duration-300 tracking-widest">
                [IMG_{String(i).padStart(4, "0")}]
              </div>
              
              {/* Inner overlay (subtle highlight on hover) */}
              <div className="absolute inset-0 bg-fg opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      <SearchBar />
    </div>
  );
}
