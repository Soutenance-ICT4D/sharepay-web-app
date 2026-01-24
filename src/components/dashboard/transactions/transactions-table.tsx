"use client";

import { ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, CreditCard, Landmark, MoreHorizontal, Wallet } from "lucide-react";

import { TransactionsPaginationFooter } from "@/components/dashboard/transactions/transactions-pagination-footer";

export type TransactionStatus = "success" | "pending" | "failed";

export type TransactionsRow = {
  id: string;
  amountLabel: string;
  currency: string;
  appTarget: "web" | "mobile";
  paymentMethod: "card" | "bank" | "wallet";
  date: Date;
  status: TransactionStatus;
  customerName: string;
  customerEmail: string;
  customerInitials: string;
  customerBadgeClassName?: string;
  methodLabel: string;
  methodIcon?: "card" | "bank" | "wallet";
  dateLabel: string;
};

function StatusBadge({ status }: { status: TransactionStatus }) {
  const config =
    status === "success"
      ? {
          label: "Succès",
          wrap: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20",
          dot: "bg-emerald-500",
        }
      : status === "pending"
        ? {
            label: "En attente",
            wrap: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20",
            dot: "bg-amber-500",
            dotExtra: "animate-pulse",
          }
        : {
            label: "Échoué",
            wrap: "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
            dot: "bg-rose-500",
          };

  return (
    <span
      className={
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border " + config.wrap
      }
    >
      <span className={"w-1.5 h-1.5 rounded-full " + config.dot + (config.dotExtra ? " " + config.dotExtra : "")} />
      {config.label}
    </span>
  );
}

function MethodIcon({ kind }: { kind?: TransactionsRow["methodIcon"] }) {
  const icon: ReactNode =
    kind === "bank" ? (
      <Landmark className="h-5 w-5 text-muted-foreground" />
    ) : kind === "wallet" ? (
      <Wallet className="h-5 w-5 text-muted-foreground" />
    ) : (
      <CreditCard className="h-5 w-5 text-muted-foreground" />
    );

  return icon;
}

export function TransactionsTable({
  rows,
  pagination,
  onRowClick,
}: {
  rows: TransactionsRow[];
  pagination?: {
    from: number;
    to: number;
    total: number;
    page: number;
    pages: number;
    onPrev?: () => void;
    onNext?: () => void;
    onSetPage?: (page: number) => void;
  };
  onRowClick?: (row: TransactionsRow) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hasRows = rows.length > 0;

  const visibleRows = useMemo(() => rows, [rows]);

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[560px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted border-b sticky top-0 z-10">
                <th className="px-4 md:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Transaction ID</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Montant</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Statut</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Client</th>
                <th className="hidden lg:table-cell px-4 md:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Méthode</th>
                <th className="hidden md:table-cell px-4 md:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="px-4 md:px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleRows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/40 transition-colors group cursor-pointer"
                  onClick={() => onRowClick?.(row)}
                >
                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-primary">{row.id}</span>
                      <button
                        type="button"
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground transition-opacity"
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await navigator.clipboard.writeText(row.id);
                            setCopiedId(row.id);
                            window.setTimeout(() => setCopiedId((prev) => (prev === row.id ? null : prev)), 900);
                          } catch {
                            setCopiedId(null);
                          }
                        }}
                        aria-label="Copier l'ID"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {copiedId === row.id ? (
                        <span className="text-[10px] font-bold text-muted-foreground">Copié</span>
                      ) : null}
                    </div>
                  </td>

                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-extrabold text-foreground">{row.amountLabel}</div>
                  </td>

                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={row.status} />
                  </td>

                  <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className={
                          "size-8 rounded-full flex items-center justify-center text-xs font-bold " +
                          (row.customerBadgeClassName ?? "bg-muted text-muted-foreground")
                        }
                      >
                        {row.customerInitials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">{row.customerName}</span>
                        <span className="hidden sm:block text-xs text-muted-foreground">{row.customerEmail}</span>
                      </div>
                    </div>
                  </td>

                  <td className="hidden lg:table-cell px-4 md:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MethodIcon kind={row.methodIcon} />
                      <span className="text-sm text-foreground">{row.methodLabel}</span>
                    </div>
                  </td>

                  <td className="hidden md:table-cell px-4 md:px-6 py-4 whitespace-nowrap text-sm text-muted-foreground font-medium">
                    {row.dateLabel}
                  </td>

                  <td className="px-4 md:px-6 py-4 text-right whitespace-nowrap">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      aria-label="Actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {!hasRows ? (
                <tr>
                  <td className="px-6 py-10 text-sm text-muted-foreground" colSpan={7}>
                    Aucune transaction trouvée.
                  </td>
                </tr>
              ) : null}
            </tbody>
            </table>
          </div>
        </div>

        {pagination ? (
          <TransactionsPaginationFooter
            from={pagination.from}
            to={pagination.to}
            total={pagination.total}
            page={pagination.page}
            pages={pagination.pages}
            onPrev={pagination.onPrev}
            onNext={pagination.onNext}
            onSetPage={pagination.onSetPage}
          />
        ) : null}
    </div>
  );
}
