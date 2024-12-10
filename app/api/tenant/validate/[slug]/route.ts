import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  console.log("USER");
  console.log(session?.user);


  if (!session?.user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );;
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.slug },
    include: {
      members: true,
      domains: true,
    },
  });

  if (!tenant) {
    return NextResponse.json(
      { error: "Tenant not found" },
      { status: 404 }
    );
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_tenantId: {
        userId: session.user.id,
        tenantId: tenant.id,
      },
    },
  });

  return NextResponse.json(membership?.isActive)
}