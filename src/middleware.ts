import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const type = url.searchParams.get("type"); // public/private from entry link

  // We'll create a response we can add cookies to
  const response = NextResponse.next();

  // ✅ 1) Handle guest type cookie for the whole site
  if (type === "private" || type === "public") {
    // Set cookie so RSVP page can read it server-side later
    response.cookies.set("guestType", type, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    // Optional: clean the URL (remove ?type=...) to avoid sharing it around
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("type");

    return NextResponse.redirect(cleanUrl, { headers: response.headers });
  }

  // ✅ 2) Keep your existing /admin protection
  // Only do Supabase auth work for /admin routes (important for performance)
  if (url.pathname.startsWith("/admin")) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // block all /admin routes unless logged in
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("next", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    // ✅ run on all pages (so entry link can set cookie)
    // but exclude Next internal assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};