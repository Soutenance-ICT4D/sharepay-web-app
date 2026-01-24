"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

type LoadingStatus = "idle" | "loading" | "loaded" | "error";

function toTitleCase(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getBreadcrumbLabel(part: string, prevPart?: string) {
  if (prevPart === "payment-link" && part === "new") return "New link";
  return toTitleCase(part);
}

function buildBreadcrumbs(pathname: string) {
  const parts = pathname.split("?")[0].split("#")[0].split("/").filter(Boolean);
  const startIndex = parts[0] === "dashboard" ? 0 : parts.indexOf("dashboard");
  const dashboardParts = startIndex >= 0 ? parts.slice(startIndex) : parts;

  const crumbs: { href: string; label: string }[] = [];
  for (let i = 0; i < dashboardParts.length; i += 1) {
    const href = "/" + dashboardParts.slice(0, i + 1).join("/");
    const label =
      i === 0 ? "Dashboard" : getBreadcrumbLabel(dashboardParts[i], dashboardParts[i - 1]);
    crumbs.push({ href, label });
  }
  return crumbs;
}

export function DashboardAppBar({
  pathname,
  user,
  initials,
  isValidAvatar,
  avatarLoaded,
  onAvatarLoadingStatusChange,
  onGoToSettings,
  onGoToProfile,
  onNavigate,
  onMenuClick,
}: {
  pathname: string;
  user: { name: string; plan: string; avatarUrl?: string | null };
  initials: string;
  isValidAvatar: boolean;
  avatarLoaded: boolean;
  onAvatarLoadingStatusChange: (status: LoadingStatus) => void;
  onGoToSettings: () => void;
  onGoToProfile: () => void;
  onNavigate: (href: string) => void;
  onMenuClick: () => void;
}) {
  const breadcrumbs = buildBreadcrumbs(pathname);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20">
      <header className="h-16 border-b bg-background/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="md:hidden flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={onMenuClick}>
              <Menu className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSearchOpen((v) => !v)}
              aria-label="Ouvrir la recherche"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <nav className="min-w-0 hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <div key={crumb.href} className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isLast) onNavigate(crumb.href);
                    }}
                    className={[
                      "truncate",
                      isLast
                        ? "text-foreground font-medium"
                        : "hover:text-foreground transition-colors",
                    ].join(" ")}
                  >
                    {crumb.label}
                  </button>
                  {!isLast ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground/60" />
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="hidden md:flex flex-1 justify-center px-4">
            <div className="relative w-full max-w-[520px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher..." className="pl-9 bg-background/60" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-0 border rounded-full pl-1 pr-3 py-1 bg-background shadow-sm hover:border-primary/50 transition-colors">
            <ThemeToggle />
            <div className="h-4 w-px bg-border mx-1" />
            <LanguageSwitcher />
          </div>

          <Button variant="ghost" size="icon" onClick={onGoToSettings}>
            <span className="h-9 w-9 rounded-lg flex items-center justify-center bg-muted/40 hover:bg-muted/60 dark:bg-muted/30 dark:hover:bg-muted/40 dark:ring-1 dark:ring-border/40 transition-colors">
              <Image
                src="/icons/setting.png"
                alt="Settings"
                width={20}
                height={20}
                className="h-5 w-5 opacity-80 dark:invert dark:opacity-90"
              />
            </span>
          </Button>

          <Button variant="ghost" size="icon" className="relative">
            <span className="h-9 w-9 rounded-lg flex items-center justify-center bg-muted/40 hover:bg-muted/60 dark:bg-muted/30 dark:hover:bg-muted/40 dark:ring-1 dark:ring-border/40 transition-colors">
              <Image
                src="/icons/notification.png"
                alt="Notifications"
                width={20}
                height={20}
                className="h-5 w-5 opacity-80 dark:invert dark:opacity-90"
              />
            </span>
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
          </Button>

          <button
            onClick={onGoToProfile}
            className="flex items-center hover:opacity-90 transition"
            type="button"
          >
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
          </button>
        </div>
      </header>

      {mobileSearchOpen ? (
        <div className="md:hidden border-b bg-background/80 backdrop-blur-md px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input autoFocus placeholder="Rechercher..." className="pl-9" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
