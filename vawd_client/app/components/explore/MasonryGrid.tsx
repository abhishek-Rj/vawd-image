"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageType {
  id: string;
  url: string;
  userId: string;
  name: string;
  progress: string;
}

export default function MasonryGrid({ images, heights }: { images: ImageType[]; heights: number[] }) {
  const [cols, setCols] = useState(4); // Default to desktop columns for SSR
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1024) setCols(4);
      else if (window.innerWidth >= 640) setCols(3);
      else setCols(2);
    };
    handleResize(); // set immediately on client load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use a deterministic layout on the server to prevent hydration mismatch errors.
  // We use the default `cols = 4` during SSR. Once mounted on client, it fixes itself.
  const activeCols = mounted ? cols : 4; 

  // Initialize columns array based on the active number of columns
  const columnsData: { images: ImageType[]; heights: number[] }[] = Array.from({ length: activeCols }, () => ({
    images: [],
    heights: [],
  }));

  // Distribute items sequentially (horizontally) left-to-right across columns
  if (images.length > 0) {
    images.forEach((img, i) => {
      columnsData[i % activeCols].images.push(img);
    });
  } else {
    heights.forEach((h, i) => {
      columnsData[i % activeCols].heights.push(h);
    });
  }

  return (
    <div className="flex w-full gap-4 sm:gap-6 items-start transition-all">
      {columnsData.map((col, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-4 sm:gap-6 w-full min-w-0">
          {images.length > 0
            ? col.images.map((img, i) => (
                <div
                  key={img.id || i}
                  className="bg-surface grid-border group relative overflow-hidden transition-all hover:border-fg w-full block"
                >
                  <div className="relative w-full">
                    <Image
                      src={img.url}
                      alt="Uploaded media"
                      width={500}
                      height={500}
                      className="w-full h-auto object-cover brightness-110 contrast-125 hover:brightness-100 hover:contrast-100 transition-all duration-300"
                    />
                  </div>
                  {/* Minimal box decorations */}
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </div>
                  {/* Pseudo image ID */}
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-[8px] sm:text-[10px] font-supply text-fg uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest bg-bg/80 px-1.5 py-0.5 pointer-events-none">
                    [{img.name}]
                  </div>
                  <div className="absolute inset-0 bg-fg opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none" />
                </div>
              ))
            : col.heights.map((height, i) => (
                <div
                  key={i}
                  className="bg-surface grid-border group relative overflow-hidden transition-all hover:border-fg w-full opacity-50 block"
                  style={{ height: `${height}px` }}
                >
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex gap-1.5">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" />
                  </div>
                  <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 text-[8px] sm:text-[10px] font-supply text-fg uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 tracking-widest pointer-events-none">
                    [EMPTY_{String(colIndex * col.heights.length + i).padStart(4, "0")}]
                  </div>
                </div>
              ))}
        </div>
      ))}
    </div>
  );
}
