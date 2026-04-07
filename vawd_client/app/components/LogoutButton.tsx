"use client";

import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/session";

interface Props {
  className?: string;
}

export default function LogoutButton({ className = "btn-brutal" }: Props) {
  const router = useRouter();
  const { setUser } = useSession();

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
      console.error("Logout error", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`${className} flex items-center justify-center gap-2 h-full`}
    >
      <FiLogOut /> LOG_OUT
    </button>
  );
}
