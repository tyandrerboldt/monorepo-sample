import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateTenantAccess } from "@/lib/tenant";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle tenant routes
  if (pathname.startsWith("/app/")) {
    const slug = pathname.split("/")[2];
    const hasAccess = await validateTenantAccess(request, slug);

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/:slug*",
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};