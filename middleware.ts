import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const commonRootUris = ['auth', 'not-found']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const slug = pathname.split("/")[1];

  if (slug && !commonRootUris.includes(slug)) {
    try {
      const response = await fetch(new URL(`/api/tenant/validate/${slug}`, baseUrl));
      if (!response.ok) throw new Error("Failed to fetch tenant validation");
      const hasAccess = await response.json();
      if (!hasAccess) throw new Error("User don't have access");
    } catch (error) {
      return NextResponse.redirect(new URL("/not-found", request.url));
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