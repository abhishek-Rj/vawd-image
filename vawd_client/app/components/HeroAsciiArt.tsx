"use client";

import { AsciiArt } from "@/components/ui/ascii-art";

export default function HeroAsciiArt() {
    return (
        <div className="w-full max-w-lg mx-auto aspect-square sm:aspect-auto">
            <AsciiArt
                src="/images/mona-lisa.png"
                resolution={150}
                charset="blocks"
                color="#ff4d00"
                animated={false}
                className="w-full h-full min-h-[300px] sm:min-h-[500px]"
                backgroundColor="#0a0a0a"
            />
        </div>
    );
}
