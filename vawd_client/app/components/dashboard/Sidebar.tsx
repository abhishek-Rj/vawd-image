"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiCompass, FiHeart, FiImage, FiUpload } from "react-icons/fi";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/explore", label: "EXPLORE", icon: FiCompass },
    { href: "/liked", label: "LIKED_IMAGE", icon: FiHeart },
    { href: "/media", label: "MY_MEDIA", icon: FiImage },
    { href: "/upload", label: "UPLOAD_IMAGES", icon: FiUpload },
  ];

  return (
    <aside className="w-64 grid-border-r hidden md:flex flex-col h-full bg-bg relative z-20">
      {/* Logo */}
      <div className="h-14 flex items-center px-6 grid-border-b">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm font-bold tracking-widest text-fg uppercase transition-opacity hover:opacity-70"
        >
          <span className="text-accent">▌</span>
          VAWD<span className="text-fg-muted font-normal">_IMAGE</span>
        </Link>
      </div>

      {/* Nav links */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-6 py-3 text-xs tracking-widest font-bold uppercase transition-colors font-mono ${
                  isActive
                    ? "text-fg bg-surface"
                    : "text-fg-muted hover:text-fg hover:bg-surface"
                }`}
                style={{
                  borderLeft: isActive
                    ? "2px solid var(--color-accent)"
                    : "2px solid transparent",
                }}
              >
                <Icon size={16} className={isActive ? "text-accent" : "text-fg-muted"} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Badge */}
      <div className="p-6 grid-border-t">
        <div className="flex items-center gap-4 text-[10px] text-fg-dim uppercase tracking-widest font-supply justify-center">
          <span>SECURE</span>
          <span className="text-border">│</span>
          <span>PROXY</span>
        </div>
      </div>
    </aside>
  );
}
