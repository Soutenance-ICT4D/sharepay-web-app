"use client";

import { ReactNode, useMemo, useState } from "react";
import { Copy, Download, Filter, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PaymentLinkRowStatus = "ACTIVE" | "EXPIRED";

export type PaymentLinkRow = {
  id: string;
  title: string;
  createdAtLabel: string;
  amountLabel: string;
  payments: number;
  status: PaymentLinkRowStatus;
  urlLabel: string;
  icon: ReactNode;
};

function statusClassName(status: PaymentLinkRowStatus) {
  if (status === "ACTIVE") {
    return "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400";
  }
  return "bg-muted text-muted-foreground";
}

async function copyToClipboard(value: string) {
  if (typeof navigator === "undefined") return;
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function PaymentLinkTable({
  title,
  rows,
  footerLabel,
  onFilter,
  onExport,
}: {
  title: string;
  rows: PaymentLinkRow[];
  footerLabel: string;
  onFilter?: () => void;
  onExport?: () => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const viewRows = useMemo(() => rows, [rows]);

  return (
    <div className="bg-card text-card-foreground rounded-xl border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="font-bold text-foreground">{title}</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-bold w-full sm:w-auto"
            onClick={onFilter}
          >
            <Filter className="h-4 w-4" />
            <span>Filtrer</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-bold w-full sm:w-auto"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-muted-foreground text-xs uppercase tracking-wider">
              <th className="px-4 md:px-6 py-4 font-bold">Objet du lien</th>
              <th className="px-4 md:px-6 py-4 font-bold">Montant</th>
              <th className="hidden md:table-cell px-4 md:px-6 py-4 font-bold text-center">Paiements</th>
              <th className="px-4 md:px-6 py-4 font-bold">Statut</th>
              <th className="hidden lg:table-cell px-4 md:px-6 py-4 font-bold">URL</th>
              <th className="px-4 md:px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {viewRows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/40 transition-colors group">
                <td className="px-4 md:px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded bg-muted/60 flex items-center justify-center text-muted-foreground">
                      {row.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{row.title}</p>
                      <p className="text-xs text-muted-foreground">{row.createdAtLabel}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 md:px-6 py-4">
                  <p className="text-sm font-bold text-foreground">{row.amountLabel}</p>
                </td>

                <td className="hidden md:table-cell px-4 md:px-6 py-4 text-center">
                  <span className="text-sm font-medium text-foreground">{row.payments}</span>
                </td>

                <td className="px-4 md:px-6 py-4">
                  <span
                    className={[
                      "inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold",
                      statusClassName(row.status),
                    ].join(" ")}
                  >
                    {row.status === "ACTIVE" ? "ACTIF" : "EXPIRÉ"}
                  </span>
                </td>

                <td className="hidden lg:table-cell px-4 md:px-6 py-4">
                  <div className="flex items-center gap-2 group/link">
                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                      {row.urlLabel}
                    </span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      onClick={async () => {
                        await copyToClipboard(row.urlLabel);
                        setCopiedId(row.id);
                        window.setTimeout(() => setCopiedId((v) => (v === row.id ? null : v)), 900);
                      }}
                      aria-label="Copier l'URL"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {copiedId === row.id ? (
                      <span className="text-[10px] font-bold text-primary">Copié</span>
                    ) : null}
                  </div>
                </td>

                <td className="px-4 md:px-6 py-4 text-right">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-muted/20 border-t flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">{footerLabel}</p>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled>
            <span className="sr-only">Page précédente</span>
            <span className="text-muted-foreground">‹</span>
          </Button>
          <Button type="button" variant="outline" size="icon" className="h-8 w-8">
            <span className="sr-only">Page suivante</span>
            <span className="text-foreground">›</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
