import Link from "next/link";
import { getServerSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getServerSession();

  return (
    <nav
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 grid-border-b bg-bg"
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          id="navbar-logo"
          className="flex items-center gap-1 font-bold tracking-widest text-fg text-xs sm:text-sm uppercase transition-opacity hover:opacity-70"
        >
          <span className="text-accent">▌</span>
          VAWD<span className="text-fg-muted font-normal">_IMAGE</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center h-full">
          {session ? (
            <LogoutButton className="grid-border-l px-3 sm:px-5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-fg hover:bg-surface transition-colors h-full" />
          ) : (
            <>
              <Link
                href="/login"
                id="navbar-login"
                className="grid-border-l px-3 sm:px-5 py-4 text-[10px] sm:text-xs font-medium uppercase tracking-widest text-fg-muted transition-colors hover:text-fg hover:bg-surface h-full flex items-center"
              >
                [LOG_IN]
              </Link>
              <Link
                href="/signup"
                id="navbar-signup"
                className="grid-border-l px-3 sm:px-5 py-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-fg bg-surface transition-colors hover:bg-fg hover:text-bg h-full flex items-center"
              >
                [SIGN_UP]
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
