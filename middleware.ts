import { ENABLED_MODULES } from "@/config/modules";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const segments = pathname.split("/");
  const moduleName = segments[2]; // dashboard/{module}

  if (!moduleName) return NextResponse.next();

  const enabled =
    ENABLED_MODULES[moduleName as keyof typeof ENABLED_MODULES];

  if (enabled === false) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};