"use client";

import { AsciiArt } from "@/components/ui/ascii-art";

export default function HeroAsciiArt() {
  return (
    <div className="w-full max-w-lg mx-auto">
      <AsciiArt
        src="/images/mona-lisa.png"
        resolution={80}
        charset="blocks"
        color="#ff4d00"
        animated
        animationStyle="fade"
        animationDuration={1.5}
        className="w-full h-[500px]"
        backgroundColor="#0a0a0a"
      />
    </div>
  );
}
