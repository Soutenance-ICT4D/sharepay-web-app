"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type LoadingStatus = "idle" | "loading" | "loaded" | "error";

type NavItem = {
  iconSrc: string;
  label: string;
  href: string;
};

export function DashboardSidebar({
  pathname,
  navItems,
  user,
  initials,
  isValidAvatar,
  avatarLoaded,
  onAvatarLoadingStatusChange,
}: {
  pathname: string;
  navItems: NavItem[];
  user: { name: string; status: string; avatarUrl?: string | null };
  initials: string;
  isValidAvatar: boolean;
  avatarLoaded: boolean;
  onAvatarLoadingStatusChange: (status: LoadingStatus) => void;
}) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background fixed h-full z-30">
      <div className="h-16 flex items-center px-6 border-b">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-lg text-primary"
        >
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
      </div>

      <nav className="flex-1 p-4 space-y-1">
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
  );
}
