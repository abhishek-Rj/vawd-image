"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiSettings, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { useSession } from "@/context/session";
import { useRouter } from "next/navigation";

export default function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

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
          src={
            user?.profilePic ||
            "https://api.dicebear.com/7.x/notionists/svg?seed=user&backgroundColor=ff4d00"
          }
          alt="Profile"
          width={40}
          height={40}
          className="w-full h-full object-cover grayscale brightness-150 contrast-125"
        />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-48 bg-bg grid-border shadow-lg flex flex-col z-50 animate-fade-in">
          {/* Header */}
          <Link href="?profile=true" className="px-4 py-3 grid-border-b bg-surface hover:bg-fg hover:text-bg transition-colors block group cursor-pointer text-fg">
            <p className="text-xs font-bold uppercase tracking-widest break-all group-hover:text-bg">
              {user?.username || "GUEST_USER"}
            </p>
            <p className="text-[10px] text-fg-dim font-supply uppercase tracking-wider mt-0.5 group-hover:text-bg/70">
              FREE TIER
            </p>
          </Link>

          {/* Menu Items */}
          <div className="py-2">
            <div className="my-2 grid-border-t border-border" />
            <button
              onClick={handleLogout}
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
