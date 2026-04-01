import { cookies } from "next/headers";
import { verifyToken, JwtPayload } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function getSession(): Promise<JwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("root_token")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, companyName: true, role: true },
  });
}
