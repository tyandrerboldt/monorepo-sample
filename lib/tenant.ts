import { prisma } from "./prisma";
import { getSession } from "next-auth/react";
import { NextRequest } from "next/server";

export async function getTenantFromSlug(slug: string) {
  return await prisma.tenant.findUnique({
    where: { slug },
    include: {
      members: true,
      domains: true,
    },
  });
}

export async function validateTenantAccess(req: NextRequest, slug: string) {
  const session = await getSession({ req });
  
  if (!session?.user) {
    return false;
  }

  const tenant = await getTenantFromSlug(slug);
  if (!tenant) {
    return false;
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_tenantId: {
        userId: session.user.id,
        tenantId: tenant.id,
      },
    },
  });

  return membership?.isActive ?? false;
}