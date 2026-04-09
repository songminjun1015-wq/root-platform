"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import type { JwtPayload } from "@/lib/jwt";

const PUBLIC_PATHS = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

export default function AppShell({
  session,
  children,
}: {
  session: JwtPayload | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (isPublic) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar session={session} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
