import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDoctorRoute = nextUrl.pathname.startsWith("/doctor/dashboard");
  const isPharmacyRoute = nextUrl.pathname.startsWith("/pharmacy/dashboard");
  const isLabRoute = nextUrl.pathname.startsWith("/lab/dashboard");
  const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname);

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isAdminRoute && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isDoctorRoute && role !== "DOCTOR") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isPharmacyRoute && role !== "PHARMACY") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isLabRoute && role !== "LAB") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
