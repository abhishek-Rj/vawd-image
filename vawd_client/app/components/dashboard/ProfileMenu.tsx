"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 grid-border overflow-hidden focus:outline-none transition-opacity hover:opacity-80 bg-surface flex items-center justify-center p-0.5"
      >
        <Image
          src="https://api.dicebear.com/7.x/notionists/svg?seed=user&backgroundColor=ff4d00"
          alt="Profile"
          width={40}
          height={40}
          className="w-full h-full object-cover grayscale brightness-150 contrast-125"
        />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-48 bg-bg grid-border shadow-lg flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <div className="px-4 py-3 grid-border-b bg-surface">
            <p className="text-xs font-bold text-fg uppercase tracking-widest">
              GUEST_USER
            </p>
            <p className="text-[10px] text-fg-dim font-supply uppercase tracking-wider mt-0.5">
              FREE TIER
            </p>
          </div>
          
          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-2 hover:bg-surface text-xs font-mono uppercase tracking-widest text-fg-muted hover:text-fg transition-colors"
            >
              <FiSettings size={14} className="text-accent" />
              SETTINGS
            </Link>
            <Link
              href="/help"
              className="flex items-center gap-3 px-4 py-2 hover:bg-surface text-xs font-mono uppercase tracking-widest text-fg-muted hover:text-fg transition-colors"
            >
              <FiHelpCircle size={14} className="text-accent" />
              HELP
            </Link>
            <div className="my-2 grid-border-t border-border" />
            <button
              onClick={() => {
                // TODO: Implement logout
                window.location.href = "/login";
              }}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface text-xs font-mono uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors"
            >
              <FiLogOut size={14} />
              LOG_OUT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
