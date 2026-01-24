"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { CalendarDays, ChevronDown, HandCoins } from "lucide-react";

export type DateRangePreset = "today" | "last7" | "last30" | "custom";

export function OverviewPageHeading({
  title,
  subtitle,
  onPayout,
  onDateRangeChange,
}: {
  title: string;
  subtitle: string;
  onPayout?: () => void;
  onDateRangeChange?: (value: DateRangePreset, range?: { from?: string; to?: string }) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  const todayLabel = useMemo(() => {
    const now = new Date();
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(now);
  }, []);

  const [preset, setPreset] = useState<DateRangePreset>("last30");
  const [customFrom, setCustomFrom] = useState<string>("");
  const [customTo, setCustomTo] = useState<string>("");
  const [dateMenuOpen, setDateMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (event: PointerEvent) => {
      const root = rootRef.current;
      if (!root) return;

      const path = (event.composedPath?.() ?? []) as EventTarget[];
      const isInside = path.length ? path.includes(root) : root.contains(event.target as Node | null);

      if (!isInside) {
        setDateMenuOpen(false);
      }
    };

    window.addEventListener("pointerdown", handler, true);
    return () => {
      window.removeEventListener("pointerdown", handler, true);
    };
  }, []);

  const presetLabel = useMemo(() => {
    if (preset === "today") return `Aujourd'hui (${todayLabel})`;
    if (preset === "last7") return "7 derniers jours";
    if (preset === "last30") return "30 derniers jours";
    return "Personnaliser";
  }, [preset, todayLabel]);

  const setPresetAndNotify = (next: DateRangePreset) => {
    setPreset(next);
    setDateMenuOpen(false);
    if (next !== "custom") {
      setCustomFrom("");
      setCustomTo("");
      onDateRangeChange?.(next);
    } else {
      onDateRangeChange?.("custom", { from: customFrom, to: customTo });
    }
  };

  return (
    <div ref={rootRef} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground font-medium mt-1">{subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative">
          <button
            type="button"
            className="h-10 inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground shadow-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-haspopup="menu"
            aria-expanded={dateMenuOpen}
            onClick={() => setDateMenuOpen((value) => !value)}
          >
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="whitespace-nowrap">{presetLabel}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {dateMenuOpen ? (
            <div
              className="absolute right-0 mt-2 w-[240px] rounded-md border bg-card text-card-foreground shadow-lg z-50 overflow-hidden"
              role="menu"
            >
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-muted"
                role="menuitem"
                onClick={() => setPresetAndNotify("today")}
              >
                Aujourd'hui ({todayLabel})
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-muted"
                role="menuitem"
                onClick={() => setPresetAndNotify("last7")}
              >
                7 derniers jours
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-muted"
                role="menuitem"
                onClick={() => setPresetAndNotify("last30")}
              >
                30 derniers jours
              </button>
              <button
                type="button"
                className="w-full text-left px-3 py-2 text-sm font-semibold hover:bg-muted"
                role="menuitem"
                onClick={() => setPresetAndNotify("custom")}
              >
                Personnaliser
              </button>
            </div>
          ) : null}
        </div>

        {preset === "custom" ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => {
                setCustomFrom(e.target.value);
                onDateRangeChange?.("custom", { from: e.target.value, to: customTo });
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground shadow-sm"
            />
            <input
              type="date"
              value={customTo}
              onChange={(e) => {
                setCustomTo(e.target.value);
                onDateRangeChange?.("custom", { from: customFrom, to: e.target.value });
              }}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm font-bold text-foreground shadow-sm"
            />
          </div>
        ) : null}

        <Button className="gap-2 font-bold shadow-lg shadow-primary/20" asChild>
          <Link href="/dashboard/payment-link">
            <Image
              src="/icons/income.png"
              alt="Payment Link"
              width={16}
              height={16}
              className="h-4 w-4 opacity-90 brightness-0 invert"
            />
            <span>Lien de paiement</span>
          </Link>
        </Button>

        <Button variant="outline" className="gap-2 px-6 font-bold" onClick={onPayout}>
          <HandCoins className="h-4 w-4" />
          <span>Payout</span>
        </Button>
      </div>
    </div>
  );
}
