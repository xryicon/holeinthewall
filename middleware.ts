import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "./lib/owner-auth";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedRoute = path.startsWith("/admin") || (path === "/api/menu" && request.method !== "GET");
  if (!protectedRoute) return NextResponse.next();
  if (!(await isOwner(request.headers.get("authorization")))) {
    return new NextResponse("Owner sign-in required.", {status: 401, headers: {
      "WWW-Authenticate": 'Basic realm="Hole in the Wall owner", charset="UTF-8"',
      "Cache-Control": "no-store"
    }});
  }
  if (request.method !== "GET" && request.headers.get("origin") !== request.nextUrl.origin) {
    return new NextResponse("Invalid request origin.", {status: 403});
  }
  return NextResponse.next();
}
