import Link from "next/link";
import ThemeToggle from "@/app/components/ThemeToggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          href="/"
          id="navbar-logo"
          className="flex items-center gap-2 font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          <svg
            className="h-5 w-5 text-accent"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          <span>vawd</span>
          <span className="text-muted font-normal">image</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            id="navbar-login"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            id="navbar-signup"
            className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-all hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
