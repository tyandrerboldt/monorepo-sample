"use client"

import { Breadcrumbs } from "@/components/breadcrumbs";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  // const tenant = await getTenantFromSlug(params.slug);

  // if (!tenant) {
  //   notFound();
  // }

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />
      <div
        className={cn(
          "transition-all duration-300",
          !isMobile ? "ml-64" : "ml-0"
        )}
      >
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isMobile={isMobile}
        />
        <main className="p-8">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
