"use client";

import { FiArrowUp, FiPlus } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import { useSession } from "@/context/session";
import { useRouter } from "next/navigation";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useSession();
  const router = useRouter();

  // Sync state with URL parameter if it changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      router.push("/explore");
      return;
    }
    router.push(`?q=${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent adding a new line
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-40 pointer-events-none">
      <div className="pointer-events-auto bg-bg/90 backdrop-blur grid-border p-2 shadow-2xl flex items-end flex-row gap-2 transition-colors w-full">
        <button
          type="button"
          onClick={() => router.push("?upload=true")}
          className="mb-1 w-10 h-10 flex shrink-0 items-center justify-center bg-surface text-fg-muted transition-all hover:bg-fg hover:text-bg"
        >
          <FiPlus size={18} strokeWidth={3} />
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex items-center px-4 pt-1"
        >
          <textarea
            ref={textareaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="DESCRIBE AN IMAGE TO SEARCH..."
            rows={1}
            className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-fg font-supply uppercase placeholder:text-fg-dim tracking-wide resize-none py-2"
          />
        </form>
        <button
          type="button"
          onClick={(e) => handleSubmit(e)}
          disabled={!query.trim()}
          className="mb-1 w-10 h-10 flex shrink-0 items-center justify-center bg-accent text-bg transition-all disabled:opacity-50 disabled:bg-surface disabled:text-fg-dim hover:bg-fg hover:text-bg"
        >
          <FiArrowUp size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
