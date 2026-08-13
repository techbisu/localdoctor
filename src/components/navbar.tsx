import Link from "next/link";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export async function Navbar() {
  const session = await auth();

  const getDashboardLink = () => {
    switch (session?.user?.role) {
      case "ADMIN":
        return "/admin";
      case "DOCTOR":
        return "/doctor";
      case "PHARMACY":
        return "/pharmacy";
      case "LAB":
        return "/lab";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-teal-700">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <span>HealthFind</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/search?type=doctor" className="text-sm font-medium hover:text-teal-700 transition-colors">
            Doctors
          </Link>
          <Link href="/search?type=pharmacy" className="text-sm font-medium hover:text-teal-700 transition-colors">
            Pharmacies
          </Link>
          <Link href="/search?type=lab" className="text-sm font-medium hover:text-teal-700 transition-colors">
            Labs
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={getDashboardLink()} className="flex items-center cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <form action="/api/auth/signout" method="POST" className="w-full">
                    <button type="submit" className="flex items-center w-full cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="bg-teal-700 hover:bg-teal-800" asChild>
                <Link href="/register">Join as Provider</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/search?type=doctor" className="text-lg font-medium hover:text-teal-700">
                  Doctors
                </Link>
                <Link href="/search?type=pharmacy" className="text-lg font-medium hover:text-teal-700">
                  Pharmacies
                </Link>
                <Link href="/search?type=lab" className="text-lg font-medium hover:text-teal-700">
                  Labs
                </Link>
                {!session && (
                  <>
                    <Link href="/login" className="text-lg font-medium hover:text-teal-700">
                      Sign In
                    </Link>
                    <Link href="/register" className="text-lg font-medium text-teal-700">
                      Join as Provider
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
