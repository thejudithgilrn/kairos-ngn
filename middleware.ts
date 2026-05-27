import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";

const FREE_LIMIT = 3;

async function checkFreeLimit(userId: string, req: NextRequest): Promise<boolean> {
  const { supabase } = createMiddlewareClient(req);
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_paid")
    .eq("id", userId)
    .single();
  if (profile?.is_paid) return true;

  const { count } = await supabase
    .from("question_attempts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  return (count ?? 0) < FREE_LIMIT;
}

export async function middleware(req: NextRequest) {
  const { supabase, response } = createMiddlewareClient(req);
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const authRoutes = ["/login", "/register", "/"];
  const appRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/session") ||
    req.nextUrl.pathname.startsWith("/results") ||
    req.nextUrl.pathname.startsWith("/upgrade");

  if (!user && appRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (user && authRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (user && req.nextUrl.pathname.startsWith("/session")) {
    const allowed = await checkFreeLimit(user.id, req);
    if (!allowed) return NextResponse.redirect(new URL("/upgrade", req.url));
  }

  return response;
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*", "/session/:path*", "/results/:path*", "/upgrade"],
};
