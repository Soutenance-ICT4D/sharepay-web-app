"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { X } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type LoadingStatus = "idle" | "loading" | "loaded" | "error";

type NavItem = {
  iconSrc: string;
  label: string;
  href: string;
};

export function DashboardMobileSidebar({
  open,
  onOpenChange,
  pathname,
  navItems,
  user,
  initials,
  isValidAvatar,
  avatarLoaded,
  onAvatarLoadingStatusChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
  navItems: NavItem[];
  user: { name: string; status: string; avatarUrl?: string | null };
  initials: string;
  isValidAvatar: boolean;
  avatarLoaded: boolean;
  onAvatarLoadingStatusChange: (status: LoadingStatus) => void;
}) {
  const currentPathname = usePathname();

  useEffect(() => {
    if (open) onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
      />

      <aside className="absolute left-0 top-0 h-full w-[85%] max-w-[320px] bg-background border-r shadow-xl flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary">
            <div className="relative h-6 w-6">
              <Image
                src="/images/logo_sharepay_bg_remove_svg.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            SharePay
          </Link>

          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-0 border rounded-full pl-1 pr-3 py-1 bg-background shadow-sm hover:border-primary/50 transition-colors w-fit">
            <ThemeToggle />
            <div className="h-4 w-px bg-border mx-1" />
            <LanguageSwitcher />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span
                  className={[
                    "h-9 w-9 rounded-lg flex items-center justify-center",
                    isActive
                      ? "bg-primary/10"
                      : "bg-muted/40 group-hover:bg-muted/60 dark:bg-muted/30 dark:group-hover:bg-muted/40 dark:ring-1 dark:ring-border/40",
                    "transition-colors",
                  ].join(" ")}
                >
                  <Image
                    src={item.iconSrc}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={[
                      "h-5 w-5",
                      isActive ? "opacity-95" : "opacity-80",
                      "transition-opacity",
                      "dark:invert dark:opacity-90",
                    ].join(" ")}
                  />
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-9 w-9 border border-primary/20 overflow-hidden">
              {isValidAvatar ? (
                <AvatarImage
                  src={user.avatarUrl!}
                  alt={user.name}
                  className={[
                    "h-full w-full object-cover",
                    avatarLoaded ? "opacity-100" : "opacity-0",
                    "transition-opacity duration-200",
                  ].join(" ")}
                  onLoadingStatusChange={onAvatarLoadingStatusChange}
                />
              ) : null}

              <AvatarFallback
                className={[
                  "bg-primary/10 text-primary font-bold",
                  isValidAvatar && avatarLoaded ? "opacity-0" : "opacity-100",
                  "transition-opacity duration-200",
                ].join(" ")}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="text-sm font-medium leading-none truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.status}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
