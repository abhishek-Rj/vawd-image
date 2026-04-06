"use client";

import { useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { useSession } from "@/context/session";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const session = useSession();
  const [error, setError] = useState("");
  const router = useRouter();

  const strengthLevel = (() => {
    if (password.length === 0) return 0;
    if (password.length < 6) return 1;
    if (password.length < 10) return 2;
    return 3;
  })();

  const strengthLabel = ["", "WEAK", "FAIR", "STRONG"][strengthLevel];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const url = process.env.NEXT_PUBLIC_AUTH_SERVER_URL;
    const firstname = name.split(" ")[0];
    const lastname = name.split(" ").slice(1).join(" ");

    try {
      const creatUser = await fetch(`${url}/auth/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstname,
          lastname,
          username,
          email,
          password,
        }),
      });

      const data = await creatUser.json();

      if (!creatUser.ok) {
        setError(data.error || "Failed to create user");
        return;
      }

      const userData = {
        userId: data.user.userId,
        email: data.user.email,
        username: data.user.username,
        profilePic:
          data.user.profilePic ||
          `https://api.dicebear.com/7.x/notionists/svg?seed=${data.user.username}&backgroundColor=ff4d00`,
      };

      session.setUser(userData);
      router.replace("/explore");
      router.refresh();
    } catch (error) {
      console.log(error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {error && (
        <div className="text-red-500 text-xs font-bold uppercase grid-border bg-red-500/10 p-3 text-center tracking-widest">
          [ERROR] {error}
        </div>
      )}
      {/* Name */}
      <div>
        <label
          htmlFor="signup-name"
          className="label-brutal flex items-center gap-2"
        >
          <span className="inline-block h-2 w-2 bg-accent rounded-sm" />{" "}
          FULL_NAME
        </label>
        <input
          id="signup-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="your name"
          required
          className="input-brutal"
        />
      </div>

      {/* Username */}
      <div>
        <label
          htmlFor="signup-username"
          className="label-brutal flex items-center gap-2"
        >
          <span className="inline-block h-2 w-2 bg-accent rounded-sm" />{" "}
          USERNAME
        </label>
        <input
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          required
          className="input-brutal"
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="signup-email"
          className="label-brutal flex items-center gap-2"
        >
          <span className="inline-block h-2 w-2 bg-accent rounded-sm" />{" "}
          EMAIL_ADDRESS
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="input-brutal"
        />
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            htmlFor="signup-password"
            className="label-brutal mb-0 flex items-center gap-2"
          >
            <span className="inline-block h-2 w-2 bg-accent rounded-sm" />{" "}
            PASSWORD
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-[10px] uppercase tracking-widest text-fg-dim hover:text-fg transition-colors font-mono"
          >
            [{showPassword ? "HIDE" : "SHOW"}]
          </button>
        </div>
        <input
          id="signup-password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="min. 6 characters"
          required
          minLength={6}
          className="input-brutal"
        />

        {/* Password strength — block meter */}
        {password.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`strength-block ${
                    level <= strengthLevel
                      ? level === 1
                        ? "active-weak"
                        : level === 2
                          ? "active-fair"
                          : "active-strong"
                      : ""
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-widest text-fg-dim font-mono">
              {strengthLabel}
            </p>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        id="signup-submit"
        type="submit"
        disabled={isLoading}
        className="btn-brutal-fill w-full disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-3 w-3 border-2 border-bg border-t-transparent animate-spin" />
            CREATING_ACCOUNT...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            CREATE_ACCOUNT <FaArrowRight />
          </span>
        )}
      </button>

      {/* Divider */}
      <div className="divider-brutal">
        <span className="text-[10px] uppercase tracking-widest text-fg-dim font-mono">
          OR
        </span>
      </div>

      {/* OAuth */}
      <form
        method="POST"
        action={`${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/auth/google`}
        className="w-full"
      >
        <button
          type="submit"
          className="btn-brutal w-full flex items-center justify-center gap-2"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          CONTINUE WITH GOOGLE
        </button>
      </form>

      {/* Terms */}
      <p className="text-center text-[10px] text-fg-dim tracking-wide leading-relaxed font-mono uppercase">
        BY CREATING AN ACCOUNT, YOU AGREE TO OUR{" "}
        <span className="text-fg-muted hover:text-fg cursor-pointer underline underline-offset-4 transition-colors">
          TERMS
        </span>{" "}
        AND{" "}
        <span className="text-fg-muted hover:text-fg cursor-pointer underline underline-offset-4 transition-colors">
          PRIVACY_POLICY
        </span>
      </p>

      {/* Footer */}
      <p className="text-center text-xs text-fg-muted tracking-wide">
        HAVE AN ACCOUNT?{" "}
        <Link
          href="/login"
          className="text-fg font-bold hover:text-accent transition-colors underline underline-offset-4"
        >
          [LOG_IN]
        </Link>
      </p>
    </form>
  );
}
