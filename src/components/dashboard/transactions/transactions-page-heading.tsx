"use client";

import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

export function TransactionsPageHeading({
  title,
  subtitle,
  onRefresh,
  onExport,
}: {
  title: string;
  subtitle: string;
  onRefresh?: () => void;
  onExport?: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h3 className="text-3xl font-black tracking-tight text-foreground">{title}</h3>
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
        <Button
          type="button"
          variant="outline"
          className="gap-2 font-semibold w-full sm:w-auto"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4" />
          <span>Actualiser</span>
        </Button>
        <Button
          type="button"
          className="gap-2 font-bold shadow-xl shadow-foreground/10 w-full sm:w-auto"
          onClick={onExport}
        >
          <Download className="h-4 w-4" />
          <span>Export Data</span>
        </Button>
      </div>
    </div>
  );
}
