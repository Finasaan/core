import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check if this is the preview environment
  // We can detect this by checking multiple indicators
  const isPreview =
    process.env.ENVIRONMENT === "preview" ||
    request.headers.get("cf-worker") === "core-preview" ||
    request.nextUrl.hostname.includes("preview") ||
    request.nextUrl.pathname.startsWith("/preview");

  // If in preview environment and URL starts with /preview, rewrite to remove it
  if (isPreview && request.nextUrl.pathname.startsWith("/preview")) {
    const newPathname =
      request.nextUrl.pathname.replace(/^\/preview/, "") || "/";
    const url = request.nextUrl.clone();
    url.pathname = newPathname;

    // Optional: Add a custom header to track the rewrite
    const response = NextResponse.rewrite(url);
    response.headers.set("x-preview-rewrite", "true");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
