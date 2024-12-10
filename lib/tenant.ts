import { prisma } from "./prisma";

export async function getTenantFromSlug(slug: string) {
  return await prisma.tenant.findUnique({
    where: { slug },
    include: {
      members: true,
      domains: true,
    },
  });
}
