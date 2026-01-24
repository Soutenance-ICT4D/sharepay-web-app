"use client";

import { useMemo, useState } from "react";

import { TransactionsPageHeading } from "@/components/dashboard/transactions/transactions-page-heading";
import {
  TransactionsFilters,
  type TransactionsFiltersValue,
} from "@/components/dashboard/transactions/transactions-filters";
import {
  TransactionsTable,
  type TransactionsRow,
} from "@/components/dashboard/transactions/transactions-table";

const PAGE_SIZE = 10;

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

function buildMockTransactions(): TransactionsRow[] {
  const baseCustomers = [
    { name: "Alice Martin", email: "alice@domain.com", initials: "AM", badge: "bg-muted text-muted-foreground" },
    { name: "Julien Robert", email: "j.robert@cloud.net", initials: "JR", badge: "bg-primary/20 text-primary" },
    { name: "Sophie Durant", email: "sophie@lifestyle.fr", initials: "SD", badge: "bg-muted text-muted-foreground" },
    { name: "Lucas Bernard", email: "lucas.b@tech-startup.io", initials: "LB", badge: "bg-muted text-muted-foreground" },
    { name: "Emma Mercier", email: "emma.mercier@webmail.com", initials: "EM", badge: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500" },
    { name: "Patrick Ndzi", email: "patrick.ndzi@mail.cm", initials: "PN", badge: "bg-primary/15 text-primary" },
    { name: "Robert King", email: "robert.k@domain.com", initials: "RK", badge: "bg-muted text-muted-foreground" },
  ];

  const currencies = ["EUR", "XAF", "USD"] as const;
  const statuses = ["success", "pending", "failed"] as const;
  const methods = [
    { label: "Visa •••• 4242", icon: "card" as const },
    { label: "Mastercard •••• 9912", icon: "card" as const },
    { label: "Virement SEPA", icon: "bank" as const },
    { label: "Mobile Money", icon: "wallet" as const },
    { label: "Solde Client", icon: "wallet" as const },
    { label: "Apple Pay", icon: "wallet" as const },
  ];

  const rows: TransactionsRow[] = [];
  for (let i = 1; i <= 100; i += 1) {
    const customer = baseCustomers[i % baseCustomers.length];
    const currency = currencies[i % currencies.length];
    const status = statuses[(i + 1) % statuses.length];
    const method = methods[i % methods.length];
    const appTarget = i % 2 === 0 ? "web" : "mobile";

    const amountSeed = 10 + (i * 37) % 5000;
    const amountLabel =
      currency === "EUR"
        ? `${amountSeed.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
        : currency === "USD"
          ? `${(amountSeed / 3).toFixed(2)} $`
          : `${Math.round(amountSeed * 35).toLocaleString("fr-FR")} XAF`;

    const day = 1 + (i % 24);
    const hour = (i * 3) % 24;
    const minute = (i * 7) % 60;
    const date = new Date(2026, 0, day, hour, minute, 0, 0);
    const dateLabel = `${pad2(day)} Jan 2026, ${pad2(hour)}:${pad2(minute)}`;

    rows.push({
      id: `#TRX-${8920 + i}-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 7) % 26))}`,
      amountLabel,
      currency,
      appTarget,
      paymentMethod: method.icon,
      date,
      status,
      customerName: customer.name,
      customerEmail: customer.email,
      customerInitials: customer.initials,
      customerBadgeClassName: customer.badge,
      methodLabel: method.label,
      methodIcon: method.icon,
      dateLabel,
    });
  }
  return rows;
}

function startOfDay(value: Date) {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(value: Date) {
  const d = new Date(value);
  d.setHours(23, 59, 59, 999);
  return d;
}

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionsFiltersValue>({
    query: "",
    status: "all",
    method: "all",
    app: "all",
    datePreset: "last7",
  });
  const [page, setPage] = useState(1);

  const [rows, setRows] = useState<TransactionsRow[]>(() => buildMockTransactions());

  const filteredRows = useMemo(() => {
    const q = filters.query.trim().toLowerCase();

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const last7Start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6));
    const last30Start = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29));

    const range = (() => {
      if (filters.datePreset === "today") return { from: todayStart, to: todayEnd };
      if (filters.datePreset === "last7") return { from: last7Start, to: todayEnd };
      if (filters.datePreset === "last30") return { from: last30Start, to: todayEnd };
      if (filters.datePreset === "custom") {
        const from = filters.dateFrom ? startOfDay(new Date(filters.dateFrom)) : undefined;
        const to = filters.dateTo ? endOfDay(new Date(filters.dateTo)) : undefined;
        return { from, to };
      }
      return { from: undefined, to: undefined };
    })();

    return rows.filter((row) => {
      const matchesQuery =
        !q ||
        row.id.toLowerCase().includes(q) ||
        row.customerName.toLowerCase().includes(q) ||
        row.customerEmail.toLowerCase().includes(q) ||
        row.methodLabel.toLowerCase().includes(q);

      const matchesStatus =
        filters.status === "all" ? true : row.status === filters.status;

      const matchesMethod =
        filters.method === "all" ? true : row.paymentMethod === filters.method;

      const matchesApp = filters.app === "all" ? true : row.appTarget === filters.app;

      const matchesDate = (() => {
        if (!range.from && !range.to) return true;
        const t = row.date.getTime();
        if (range.from && t < range.from.getTime()) return false;
        if (range.to && t > range.to.getTime()) return false;
        return true;
      })();

      return matchesQuery && matchesStatus && matchesMethod && matchesApp && matchesDate;
    });
  }, [filters.app, filters.dateFrom, filters.datePreset, filters.dateTo, filters.method, filters.query, filters.status, rows]);

  const pages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), pages);

  const visibleRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, safePage]);

  const from = filteredRows.length ? (safePage - 1) * PAGE_SIZE + 1 : 0;
  const to = filteredRows.length ? Math.min(filteredRows.length, safePage * PAGE_SIZE) : 0;

  return (
    <div className="space-y-6">
      <TransactionsPageHeading
        title="Transactions"
        subtitle="Gérez et suivez tous vos flux financiers en temps réel avec des indicateurs de performance détaillés."
        onRefresh={() => {
          setRows(buildMockTransactions());
          setPage(1);
        }}
        onExport={() => {
          const csv = [
            ["id", "amount", "currency", "status", "customer", "email", "method", "date"].join(","),
            ...filteredRows.map((r) =>
              [
                r.id,
                r.amountLabel,
                r.currency,
                r.status,
                r.customerName,
                r.customerEmail,
                r.methodLabel,
                r.dateLabel,
              ]
                .map((v) => `"${String(v).replaceAll('"', '""')}"`)
                .join(",")
            ),
          ].join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "transactions.csv";
          a.click();
          URL.revokeObjectURL(url);
        }}
      />

      <TransactionsFilters
        value={filters}
        onChange={(next) => {
          setFilters(next);
          setPage(1);
        }}
      />

      <TransactionsTable
        rows={visibleRows}
        pagination={{
          from,
          to,
          total: filteredRows.length,
          page: safePage,
          pages,
          onPrev: () => setPage((p) => Math.max(1, p - 1)),
          onNext: () => setPage((p) => Math.min(pages, p + 1)),
          onSetPage: (p) => setPage(p),
        }}
      />
    </div>
  );
}
