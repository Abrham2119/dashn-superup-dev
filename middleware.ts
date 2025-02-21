import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const session = await auth();
  const pathname = req.nextUrl.pathname;

  if (session && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (session && pathname === "/api/auth/signin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    const role = session?.user?.roleId;
    const rolePaths: { [key: string]: string } = {
      CHECKER: "/dashboard/checker",
    };

    if (role) {
      const expectedPath = rolePaths[role];

      if (expectedPath) {
        if (!pathname.startsWith(expectedPath)) {
          return NextResponse.redirect(new URL(expectedPath, req.url));
        }
      } else {
        return NextResponse.redirect(new URL("/api/auth/signin", req.url));
      }
    } else {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
  }

  if (pathname === "/login" || pathname === "/otp-verify") {
    if (!session) {
      return NextResponse.next();
    } else if (session && session?.user?.roleId === "CHECKER") {
      return NextResponse.redirect(new URL("/dashboard/checker", req.url));
    } else {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/auth/signin", "/login", "/otp-verify"],
};