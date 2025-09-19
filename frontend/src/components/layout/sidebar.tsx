"use client";

import { BarChart2, BotMessageSquare, Library, PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { cn } from "../../lib/utils";
import { UserProfile } from "./user-profile";
import { AboutModal } from "./about-modal";
import { Logo } from "./logo";
import { useAuth } from "../../hooks/use-auth";

const navItems = [
  { href: "/dashboard", icon: BarChart2, label: "Dashboard" },
  { href: "/chat", icon: BotMessageSquare, label: "Chat" },
  {
    href: "/knowledge",
    icon: Library,
    label: "Knowledge",
    adminOnly: true,
  },
];

function NavContent() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Logo />
          <span className="font-headline">Corporate Data Lens</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start gap-2 px-4 text-sm font-medium">
          {navItems.map((item) =>
            item.adminOnly && user?.role !== "admin" ? null : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-secondary",
                  pathname === item.href &&
                    "bg-secondary text-primary font-semibold"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <AboutModal />
        <UserProfile />
      </div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <>
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <NavContent />
      </aside>
      <header className="flex h-14 items-center gap-4 border-b bg-card px-6 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 sm:max-w-xs">
            <NavContent />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 font-semibold md:hidden">
          <Logo />
          <span className="font-headline">Data Lens</span>
        </div>
      </header>
    </>
  );
}
