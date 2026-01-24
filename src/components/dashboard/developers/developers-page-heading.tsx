"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DevelopersPageHeading({
  title,
  subtitle,
  onCreate,
}: {
  title: string;
  subtitle: string;
  onCreate?: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h2>
        <p className="text-muted-foreground max-w-2xl font-medium">{subtitle}</p>
      </div>

      <Button
        type="button"
        className="gap-2 font-bold shadow-lg shadow-primary/20 w-full sm:w-auto"
        onClick={onCreate}
      >
        <Plus className="h-4 w-4" />
        <span>Nouvelle Application</span>
      </Button>
    </div>
  );
}
