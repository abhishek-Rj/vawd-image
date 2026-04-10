"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FiCompass, FiImage, FiUpload, FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/explore", label: "EXPLORE", icon: FiCompass },
    { href: "?media=true", label: "MY_MEDIA", icon: FiImage },
    { href: "?upload=true", label: "UPLOAD_IMAGES", icon: FiUpload },
  ];

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-14 flex items-center px-6 grid-border-b shrink-0">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm font-bold tracking-widest text-fg uppercase transition-opacity hover:opacity-70"
          onClick={() => setIsOpen(false)}
        >
          <span className="text-accent">▌</span>
          VAWD<span className="text-fg-muted font-normal">_IMAGE</span>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1">
          {links.map((link) => {
            const hasQueryParams = searchParams.toString().length > 0;
            const isActive = pathname.startsWith(link.href) && (link.href !== "/explore" || !hasQueryParams);
            // In Nextjs app router with searchParams we might need to handle query strings properly.
            // For simplicity, we keep the previous pattern.
            const isReallyActive = pathname.startsWith(link.href.split('?')[0]); 
            // the original code just used pathname.startsWith(link.href). If link has query like ?media=true, pathname is /explore. 
            // So to fix that, we can just use simple styling based on link.href
            
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-6 py-3 text-xs tracking-widest font-bold uppercase transition-colors font-mono ${
                  isReallyActive && link.href === "/explore" // Rough estimation for active state, can refine later
                    ? "text-fg bg-surface"
                    : "text-fg-muted hover:text-fg hover:bg-surface"
                }`}
              >
                <Icon size={16} className={isActive ? "text-accent" : "text-fg-muted"} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Badge */}
      <div className="p-6 grid-border-t shrink-0">
        <div className="flex items-center gap-4 text-[10px] text-fg-dim uppercase tracking-widest font-supply justify-center">
          <span>SECURE</span>
          <span className="text-border">│</span>
          <span>PROXY</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-2.5 left-4 z-40 p-2 bg-bg/80 backdrop-blur grid-border text-fg-muted hover:text-fg hover:bg-surface transition-colors"
      >
        <FiMenu size={20} />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="md:hidden fixed inset-0 z-50 bg-bg/80 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 bg-bg grid-border-r z-50 flex flex-col"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-2 text-fg-muted hover:text-fg z-50"
              >
                <FiX size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-64 grid-border-r hidden md:flex flex-col h-full bg-bg relative z-20 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
