import { getTenantFromSlug } from "@/lib/tenant";
import { notFound } from "next/navigation";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const tenant = await getTenantFromSlug(params.slug);

  if (!tenant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">{tenant.name}</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}