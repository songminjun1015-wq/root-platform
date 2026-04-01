import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import AppShell from "./_components/AppShell";
import type { JwtPayload } from "@/lib/jwt";

export const metadata: Metadata = {
  title: "ROOT | 기업 자산 운영 플랫폼",
  description: "유휴 자산을 관리하고 거래로 연결하는 B2B 플랫폼",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let session: JwtPayload | null = null;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("root_token")?.value;
    if (token) session = verifyToken(token);
  } catch {}

  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 antialiased">
        <AppShell session={session}>{children}</AppShell>
      </body>
    </html>
  );
}
