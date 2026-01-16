"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  LayoutDashboard,
  CreditCard,
  ArrowRightLeft,
  Settings,
  LogOut,
  Bell,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { tokenStorage } from "@/lib/token-storage";
import { authService } from "@/services/authService";

type User = {
  name: string;
  plan: string;
  avatarUrl?: string | null; // URL backend ou chemin local
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "U";
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const t = useTranslations("Dashboard");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const tokens = tokenStorage.get();
    if (!tokens?.accessToken) {
      router.push("/");
    }
  }, [router]);

  // ⚠️ Remplace ceci par ton user venant du backend/store
  const user: User = {
    name: "John Doe",
    plan: "Free Plan",
    avatarUrl: "/images/avatar.jpeg", // ex: "https://api.sharepay.com/files/avatars/123.jpg"
  };

  const initials = useMemo(() => getInitials(user.name), [user.name]);

  // Gestion du chargement / erreur avatar
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleLogout = async () => {
    toast.info("Déconnexion en cours...");
    try {
      await authService.logout();
    } catch {
      tokenStorage.clear();
    } finally {
      router.push("/");
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: t("nav.overview"), href: "/dashboard" },
    {
      icon: ArrowRightLeft,
      label: t("nav.transactions"),
      href: "/dashboard/transactions",
    },
    { icon: CreditCard, label: t("nav.cards"), href: "/dashboard/cards" },
    { icon: Settings, label: t("nav.settings"), href: "/dashboard/settings" },
  ];

  const isValidAvatar =
    !!user.avatarUrl && !avatarError && user.avatarUrl.trim().length > 0;

  return (
    <div className="min-h-screen bg-muted/10 flex">
      {/* --- 1. SIDEBAR (Desktop) --- */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background fixed h-full z-30">
        {/* Logo */}
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors dark:hover:bg-red-900/10"
          >
            <LogOut className="h-5 w-5" />
            {t("nav.logout")}
          </button>
        </div>
      </aside>

      {/* --- 2. CONTENU PRINCIPAL --- */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b bg-background/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
          {/* Mobile Menu */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <div className="hidden md:block" />

          {/* Actions droite */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
            </Button>

            {/* User Profile */}
            <button
              onClick={() => router.push("/dashboard/settings")}
              className="flex items-center gap-3 border-l pl-4 ml-2 hover:opacity-90 transition"
              type="button"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.plan}</p>
              </div>

              <Avatar className="h-9 w-9 border border-primary/20 overflow-hidden">
                {/* Si image valide, on affiche AvatarImage */}
                {isValidAvatar ? (
                  <AvatarImage
                    src={user.avatarUrl!}
                    alt={user.name}
                    className={[
                      "h-full w-full object-cover",
                      // tant que pas chargé, on le cache pour éviter flash/étirement
                      avatarLoaded ? "opacity-100" : "opacity-0",
                      "transition-opacity duration-200",
                    ].join(" ")}
                    onLoadingStatusChange={(status) => {
                      if (status === "loaded") setAvatarLoaded(true);
                      if (status === "error") setAvatarError(true);
                    }}
                  />
                ) : null}

                {/* Fallback : toujours présent (et devient visible si image KO/non chargée) */}
                <AvatarFallback
                  className={[
                    "bg-primary/10 text-primary font-bold",
                    // si image chargée ok, on cache le fallback
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

        {/* Content */}
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
