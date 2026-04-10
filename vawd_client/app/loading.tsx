"use client";

import { SquareLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-bg relative">
      <div className="flex flex-col items-center gap-4">
        <SquareLoader color="#ff4d00" size={50} />
      </div>
    </div>
  );
}
