import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (accessToken) {
    return NextResponse.next();
  }

  if (refreshToken) {
    const url = process.env.NEXT_PUBLIC_AUTH_SERVER_URL + "auth/refresh";
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (res.ok) {
      return NextResponse.next();
    }
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/explore/:path*"],
};
