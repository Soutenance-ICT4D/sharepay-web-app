"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { tokenStorage } from "@/lib/token-storage";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardMobileSidebar } from "@/components/dashboard/dashboard-mobile-sidebar";
import { DashboardAppBar } from "@/components/dashboard/dashboard-app-bar";
import { DashboardMain } from "@/components/dashboard/dashboard-main";

type User = {
  name: string;
  plan: string;
  status: string;
  avatarUrl?: string | null; // URL backend ou chemin local
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "U";
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
    status: "Active",
    avatarUrl: "/images/avatar.jpeg", // ex: "https://api.sharepay.com/files/avatars/123.jpg"
  };

  const initials = useMemo(() => getInitials(user.name), [user.name]);

  // Gestion du chargement / erreur avatar
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { iconSrc: "/icons/dashboard.png", label: "Vue d'ensemble", href: "/dashboard" },
    { iconSrc: "/icons/transaction.png", label: "Transactions", href: "/dashboard/transactions" },
    { iconSrc: "/icons/customer.png", label: "Customers", href: "/dashboard/customers" },
    { iconSrc: "/icons/income.png", label: "Payment Link", href: "/dashboard/payment-link" },
    { iconSrc: "/icons/code.png", label: "Developpeurs", href: "/dashboard/developers" },
  ];

  const isValidAvatar =
    !!user.avatarUrl && !avatarError && user.avatarUrl.trim().length > 0;

  return (
    <div className="min-h-screen bg-muted/10 flex">
      <DashboardSidebar
        pathname={pathname}
        navItems={navItems}
        user={user}
        initials={initials}
        isValidAvatar={isValidAvatar}
        avatarLoaded={avatarLoaded}
        onAvatarLoadingStatusChange={(status: "idle" | "loading" | "loaded" | "error") => {
          if (status === "loaded") setAvatarLoaded(true);
          if (status === "error") setAvatarError(true);
        }}
      />

      <DashboardMobileSidebar
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
        pathname={pathname}
        navItems={navItems}
        user={user}
        initials={initials}
        isValidAvatar={isValidAvatar}
        avatarLoaded={avatarLoaded}
        onAvatarLoadingStatusChange={(status: "idle" | "loading" | "loaded" | "error") => {
          if (status === "loaded") setAvatarLoaded(true);
          if (status === "error") setAvatarError(true);
        }}
      />

      <DashboardMain
        appBar={
          <DashboardAppBar
            pathname={pathname}
            user={user}
            initials={initials}
            isValidAvatar={isValidAvatar}
            avatarLoaded={avatarLoaded}
            onAvatarLoadingStatusChange={(status: "idle" | "loading" | "loaded" | "error") => {
              if (status === "loaded") setAvatarLoaded(true);
              if (status === "error") setAvatarError(true);
            }}
            onGoToSettings={() => router.push("/dashboard/settings")}
            onGoToProfile={() => router.push("/dashboard/profile")}
            onNavigate={(href) => router.push(href)}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
        }
      >
        {children}
      </DashboardMain>
    </div>
  );
}
