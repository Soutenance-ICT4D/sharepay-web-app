"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronDown, Search, SlidersHorizontal } from "lucide-react";

export type TransactionsDatePreset = "today" | "last7" | "last30" | "custom";
export type TransactionsPaymentMethod = "all" | "card" | "bank" | "wallet";
export type TransactionsAppTarget = "all" | "web" | "mobile";

export type TransactionsFiltersValue = {
  query: string;
  status: "all" | "success" | "pending" | "failed";
  method: TransactionsPaymentMethod;
  app: TransactionsAppTarget;
  datePreset: TransactionsDatePreset;
  dateFrom?: string;
  dateTo?: string;
};

export function TransactionsFilters({
  value,
  onChange,
}: {
  value: TransactionsFiltersValue;
  onChange: (next: TransactionsFiltersValue) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [openMenu, setOpenMenu] = useState<"status" | "method" | "date" | "app" | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (!rootRef.current) return;
      if (!rootRef.current.contains(target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const dateLabel = useMemo(() => {
    if (value.datePreset === "today") return "Aujourd'hui";
    if (value.datePreset === "last7") return "7 derniers jours";
    if (value.datePreset === "last30") return "30 derniers jours";
    return "Personnaliser";
  }, [value.datePreset]);

  const statusLabel = useMemo(() => {
    if (value.status === "all") return "Tous";
    if (value.status === "success") return "Succès";
    if (value.status === "pending") return "En attente";
    return "Échoué";
  }, [value.status]);

  const methodLabel = useMemo(() => {
    if (value.method === "all") return "Toutes";
    if (value.method === "card") return "Carte";
    if (value.method === "bank") return "Virement";
    return "Wallet";
  }, [value.method]);

  const appLabel = useMemo(() => {
    if (value.app === "all") return "Toutes";
    if (value.app === "web") return "Web";
    return "Mobile";
  }, [value.app]);

  return (
    <div ref={rootRef} className="bg-card p-2 rounded-xl border shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            value={value.query}
            onChange={(e) => onChange({ ...value, query: e.target.value })}
            className="h-10 pl-11 bg-muted/40 border-transparent focus-visible:ring-0 focus-visible:border-primary rounded-lg"
            placeholder="Rechercher par ID, client ou référence..."
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center gap-2 p-1">
          <div className="relative">
            <button
              type="button"
              className="h-10 inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-haspopup="menu"
              aria-expanded={openMenu === "status"}
              onClick={() => {
                setOpenMenu((v) => (v === "status" ? null : "status"));
              }}
            >
              <span className="text-muted-foreground">Status:</span>
              <span className="whitespace-nowrap">{statusLabel}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {openMenu === "status" ? (
              <div className="absolute right-0 mt-2 w-[200px] rounded-md border bg-card text-card-foreground shadow-lg z-50 overflow-hidden" role="menu">
                {([
                  ["all", "Tous"],
                  ["success", "Succès"],
                  ["pending", "En attente"],
                  ["failed", "Échoué"],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-muted"
                    role="menuitem"
                    onClick={() => {
                      onChange({ ...value, status: key });
                      setOpenMenu(null);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              className="h-10 inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-haspopup="menu"
              aria-expanded={openMenu === "method"}
              onClick={() => {
                setOpenMenu((v) => (v === "method" ? null : "method"));
              }}
            >
              <span className="text-muted-foreground">Méthode:</span>
              <span className="whitespace-nowrap">{methodLabel}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {openMenu === "method" ? (
              <div className="absolute right-0 mt-2 w-[220px] rounded-md border bg-card text-card-foreground shadow-lg z-50 overflow-hidden" role="menu">
                {([
                  ["all", "Toutes"],
                  ["card", "Carte"],
                  ["bank", "Virement"],
                  ["wallet", "Wallet"],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-muted"
                    role="menuitem"
                    onClick={() => {
                      onChange({ ...value, method: key });
                      setOpenMenu(null);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              className="h-10 inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-haspopup="menu"
              aria-expanded={openMenu === "date"}
              onClick={() => {
                setOpenMenu((v) => (v === "date" ? null : "date"));
              }}
            >
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="whitespace-nowrap">{dateLabel}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {openMenu === "date" ? (
              <div className="absolute right-0 mt-2 w-[240px] rounded-md border bg-card text-card-foreground shadow-lg z-50 overflow-hidden" role="menu">
                {([
                  ["today", "Aujourd'hui"],
                  ["last7", "7 derniers jours"],
                  ["last30", "30 derniers jours"],
                  ["custom", "Personnaliser"],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-muted"
                    role="menuitem"
                    onClick={() => {
                      onChange({
                        ...value,
                        datePreset: key,
                        dateFrom: key === "custom" ? value.dateFrom : undefined,
                        dateTo: key === "custom" ? value.dateTo : undefined,
                      });
                      setOpenMenu(null);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {value.datePreset === "custom" ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                type="date"
                value={value.dateFrom ?? ""}
                onChange={(e) => {
                  onChange({ ...value, dateFrom: e.target.value || undefined });
                }}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground shadow-sm"
              />
              <input
                type="date"
                value={value.dateTo ?? ""}
                onChange={(e) => {
                  onChange({ ...value, dateTo: e.target.value || undefined });
                }}
                className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground shadow-sm"
              />
            </div>
          ) : null}

          <div className="relative">
            <button
              type="button"
              className="h-10 inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-haspopup="menu"
              aria-expanded={openMenu === "app"}
              onClick={() => {
                setOpenMenu((v) => (v === "app" ? null : "app"));
              }}
            >
              <span className="text-muted-foreground">App:</span>
              <span className="whitespace-nowrap">{appLabel}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>

            {openMenu === "app" ? (
              <div className="absolute right-0 mt-2 w-[200px] rounded-md border bg-card text-card-foreground shadow-lg z-50 overflow-hidden" role="menu">
                {([
                  ["all", "Toutes"],
                  ["web", "Web"],
                  ["mobile", "Mobile"],
                ] as const).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-muted"
                    role="menuitem"
                    onClick={() => {
                      onChange({ ...value, app: key });
                      setOpenMenu(null);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="size-10 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15"
            onClick={() => {
              onChange({
                query: "",
                status: "all",
                method: "all",
                app: "all",
                datePreset: "last7",
              });
            }}
            aria-label="Réinitialiser les filtres"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
