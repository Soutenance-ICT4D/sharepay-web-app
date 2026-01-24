"use client";

import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { OverviewPageHeading } from "@/components/dashboard/overview/overview-page-heading";
import type { DateRangePreset } from "@/components/dashboard/overview/overview-page-heading";

import {
  OverviewStatsGrid,
  type OverviewStat,
} from "@/components/dashboard/overview/overview-stats-grid";
import {
  OverviewTransactionChartCard,
  type OverviewTransactionPoint,
} from "@/components/dashboard/overview/overview-transaction-chart-card";

import {
  OverviewRecentActivity,
  type OverviewActivityItem,
} from "@/components/dashboard/overview/overview-recent-activity";
import { OverviewInsightCard } from "@/components/dashboard/overview/overview-insight-card";
import {
  Activity,
  Banknote,
  Bolt,
  ShoppingCart,
  TriangleAlert,
  RefreshCw,
  Hourglass,
} from "lucide-react";

function formatShortDate(value: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(value);
}

function formatHour(value: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function formatShortDateTime(value: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);
}

function daysBetween(from: Date, to: Date) {
  const ms = to.getTime() - from.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function buildSeries({
  preset,
  from,
  to,
}: {
  preset: DateRangePreset;
  from?: string;
  to?: string;
}): OverviewTransactionPoint[] {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let start = end;
  if (preset === "last7") {
    start = new Date(end);
    start.setDate(start.getDate() - 6);
  } else if (preset === "last30") {
    start = new Date(end);
    start.setDate(start.getDate() - 29);
  } else {
    const parsedFrom = from ? new Date(from) : undefined;
    const parsedTo = to ? new Date(to) : undefined;
    const safeFrom = parsedFrom && !Number.isNaN(parsedFrom.getTime()) ? parsedFrom : end;
    const safeTo = parsedTo && !Number.isNaN(parsedTo.getTime()) ? parsedTo : end;
    start = safeFrom;

    start.setHours(0, 0, 0, 0);
    const clampedEnd = safeTo;
    clampedEnd.setHours(0, 0, 0, 0);
    if (clampedEnd.getTime() < start.getTime()) {
      start = clampedEnd;
    }
    (end as Date).setTime(clampedEnd.getTime());
  }

  const points: OverviewTransactionPoint[] = [];

  if (preset === "today") {
    const hourEnd = new Date(now);
    hourEnd.setMinutes(0, 0, 0);
    const startOfDay = new Date(end);
    startOfDay.setHours(0, 0, 0, 0);

    const hours = Math.max(1, Math.min(24, hourEnd.getHours() + 1));
    for (let i = 0; i < hours; i += 1) {
      const d = new Date(startOfDay);
      d.setHours(i, 0, 0, 0);

      const seed = (d.getHours() * 7 + d.getDate()) % 17;
      const base = 260;
      const swing = 0.7 + seed / 22;
      const volume = Math.round(base * swing + (i % 6) * 55);
      const count = Math.max(1, Math.round(volume / 35 + (seed % 3)));

      points.push({
        date: d,
        label: formatHour(d),
        volume,
        count,
      });
    }
  } else {
    const totalDays = daysBetween(start, end) + 1;
    const shouldUseSubDaily = preset === "last7";

    const isCustom = preset === "custom";
    const customDays = isCustom ? totalDays : totalDays;
    const customGranularity: "daily" | "quad" | "hourly" = !isCustom
      ? shouldUseSubDaily
        ? "quad"
        : "daily"
      : customDays <= 2
        ? "hourly"
        : customDays <= 14
          ? "quad"
          : "daily";

    if (customGranularity === "hourly") {
      const startOfRange = new Date(start);
      startOfRange.setHours(0, 0, 0, 0);
      const endOfRange = new Date(end);
      endOfRange.setHours(23, 0, 0, 0);

      const totalHours = Math.max(1, Math.round((endOfRange.getTime() - startOfRange.getTime()) / (1000 * 60 * 60)) + 1);
      for (let i = 0; i < totalHours; i += 1) {
        const d = new Date(startOfRange);
        d.setHours(startOfRange.getHours() + i, 0, 0, 0);

        const seed = (d.getHours() * 7 + d.getDate()) % 17;
        const base = 240;
        const swing = 0.7 + seed / 22;
        const volume = Math.round(base * swing + (i % 6) * 45);
        const count = Math.max(1, Math.round(volume / 35 + (seed % 3)));

        points.push({
          date: d,
          label: formatShortDateTime(d),
          volume,
          count,
        });
      }
    } else if (customGranularity === "quad") {
      const hourMarks = [3, 9, 15, 21];
      for (let dayIndex = 0; dayIndex < totalDays; dayIndex += 1) {
        for (let h = 0; h < hourMarks.length; h += 1) {
          const d = new Date(start);
          d.setDate(start.getDate() + dayIndex);
          d.setHours(hourMarks[h], 0, 0, 0);

          const seed = (d.getHours() * 7 + d.getDate()) % 17;
          const base = preset === "last30" ? 950 : preset === "last7" ? 700 : 520;
          const swing = 0.65 + seed / 20;
          const volume = Math.round(base * swing + (h % 3) * 80 + (dayIndex % 5) * 35);
          const count = Math.max(1, Math.round(volume / 90 + (seed % 4)));

          points.push({
            date: d,
            label: dayIndex === totalDays - 1 && h === hourMarks.length - 1 ? formatShortDate(d) : formatShortDateTime(d),
            volume,
            count,
          });
        }
      }
    } else {
      for (let i = 0; i < totalDays; i += 1) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);

        const seed = (d.getDate() + (d.getMonth() + 1) * 13) % 17;
        const base = preset === "last30" ? 4200 : preset === "last7" ? 2600 : 1800;
        const swing = 0.65 + seed / 20;
        const volume = Math.round(base * swing + (i % 5) * 180);
        const count = Math.max(1, Math.round(volume / 160 + (seed % 4)));

        points.push({
          date: d,
          label: formatShortDate(d),
          volume,
          count,
        });
      }
    }
  }

  return points;
}

export default function DashboardPage() {
  const router = useRouter();

  const [rangePreset, setRangePreset] = useState<DateRangePreset>("last30");
  const [rangeCustom, setRangeCustom] = useState<{ from?: string; to?: string }>({});

  const chartData = useMemo(() => {
    return buildSeries({ preset: rangePreset, from: rangeCustom.from, to: rangeCustom.to });
  }, [rangePreset, rangeCustom.from, rangeCustom.to]);

  const stats: OverviewStat[] = [
    {
      label: "Solde disponible",
      value: "€42,500.00",
      badge: {
        label: "+2.4%",
        className: "text-emerald-600 bg-emerald-500/10",
      },
      icon: <Banknote className="h-5 w-5" />,
      iconWrapClassName: "bg-emerald-500/10 text-emerald-600",
      progress: {
        value: 65,
        className: "bg-emerald-500",
      },
    },
    {
      label: "Règlements en cours",
      value: "€12,340.50",
      badge: {
        label: "En attente",
        className: "text-amber-600 bg-amber-500/10",
      },
      icon: <Hourglass className="h-5 w-5" />,
      iconWrapClassName: "bg-amber-500/10 text-amber-600",
      progress: {
        value: 40,
        className: "bg-amber-500",
      },
    },
    {
      label: "Volume aujourd'hui",
      value: "€3,890.00",
      badge: {
        label: "+12.0%",
        className: "text-primary bg-primary/10",
      },
      icon: <Activity className="h-5 w-5" />,
      iconWrapClassName: "bg-primary/10 text-primary",
      progress: {
        value: 85,
        className: "bg-primary",
      },
    },
  ];

  const activity: OverviewActivityItem[] = [
    {
      id: "order-8921",
      title: "Commande #8921",
      meta: "Il y a 2 min • Visa **** 4242",
      amount: "+€125.00",
      status: "Succès",
      amountClassName: "text-emerald-600",
      statusClassName: "text-emerald-600/70",
      icon: <ShoppingCart className="h-5 w-5" />,
      iconWrapClassName: "bg-emerald-500/10 text-emerald-600",
    },
    {
      id: "refund-8915",
      title: "Remboursement #8915",
      meta: "Il y a 14 min • Portefeuille",
      amount: "-€42.00",
      status: "Traité",
      amountClassName: "text-foreground",
      statusClassName: "text-muted-foreground",
      icon: <RefreshCw className="h-5 w-5" />,
      iconWrapClassName: "bg-muted text-muted-foreground",
    },
    {
      id: "failed-8910",
      title: "Échec Paiement #8910",
      meta: "Il y a 1h • Mastercard **** 1111",
      amount: "€0.00",
      status: "Refusé",
      amountClassName: "text-red-600",
      statusClassName: "text-red-600/70",
      icon: <TriangleAlert className="h-5 w-5" />,
      iconWrapClassName: "bg-red-500/10 text-red-600",
    },
    {
      id: "order-8905",
      title: "Commande #8905",
      meta: "Il y a 3h • Apple Pay",
      amount: "+€2,500.00",
      status: "En attente",
      amountClassName: "text-amber-600",
      statusClassName: "text-amber-600/70",
      icon: <ShoppingCart className="h-5 w-5" />,
      iconWrapClassName: "bg-amber-500/10 text-amber-600",
    },
  ];

  return (
    <div className="space-y-8">
      <OverviewPageHeading
        title="Vue d'ensemble"
        subtitle="Bienvenue, voici l'état de votre activité aujourd'hui."
        onPayout={() => router.push("/dashboard/payout")}
        onDateRangeChange={(preset, range) => {
          setRangePreset(preset);
          setRangeCustom(range ?? {});
        }}
      />

      <OverviewStatsGrid stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <OverviewTransactionChartCard
          title="Flux de transactions"
          subtitle="Évolution sur la période sélectionnée"
          data={chartData}
        />
        <OverviewRecentActivity
          title="Activité récente"
          viewAllLabel="Tout voir"
          items={activity}
          onViewAll={() => router.push("/dashboard/transactions")}
          onLoadMore={() => router.push("/dashboard/transactions")}
        />
      </div>

      <OverviewInsightCard
        title="Conseil d'optimisation"
        description="Votre taux de conversion a augmenté de 5% ce mois-ci. Activez les paiements en un clic pour réduire l'abandon de panier de 15% supplémentaires."
        icon={<Bolt className="h-8 w-8" />}
        actionLabel="En savoir plus"
      />
    </div>
  );
}