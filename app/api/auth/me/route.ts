import { NextResponse, type NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ user: null });
  }

  // Reads the account so a deleted user no longer shows up as signed in.
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { displayName: true, role: true },
  });
  return NextResponse.json({ user });
}
