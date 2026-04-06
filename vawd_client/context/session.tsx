"use client";

import { createContext, useContext, useState } from "react";

interface user {
  userId: string;
  email: string;
  username: string;
  profilePic: string;
}

interface session {
  user: user | null;
  setUser: (user: user | null) => void;
}

const SessionContext = createContext<session | null>(null);

export function SessionProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [user, setUser] = useState<user | null>(session?.user || null);
  return (
    <SessionContext.Provider value={{ user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useSession must be used within SessionProvider");
  }
  return session;
}
