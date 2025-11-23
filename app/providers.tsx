"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  // Wrap the app in NextAuth's SessionProvider so useSession() works
  return <SessionProvider>{children}</SessionProvider>;
}
