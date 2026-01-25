"use client";

import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ProfilePageHeading({
  title,
  subtitle,
  onLogout,
  isLoggingOut,
}: {
  title: string;
  subtitle: string;
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h2>
        <p className="text-muted-foreground max-w-2xl font-medium">{subtitle}</p>
      </div>

      <Button
        type="button"
        variant="destructive"
        className="gap-2 font-bold shadow-lg shadow-destructive/15 w-full sm:w-auto"
        onClick={onLogout}
        disabled={isLoggingOut}
      >
        <LogOut className="h-4 w-4" />
        <span>{isLoggingOut ? "Déconnexion..." : "Se déconnecter"}</span>
      </Button>
    </div>
  );
}
