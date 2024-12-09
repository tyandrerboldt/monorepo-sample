import { getTenantFromSlug } from "@/lib/tenant";
import { notFound } from "next/navigation";

export default async function TenantHome({
  params,
}: {
  params: { slug: string };
}) {
  const tenant = await getTenantFromSlug(params.slug);

  if (!tenant) {
    notFound();
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Welcome to {tenant.name}</h2>
      <p className="text-muted-foreground">
        This is your tenant workspace. Start building your application here.
      </p>
    </div>
  );
}