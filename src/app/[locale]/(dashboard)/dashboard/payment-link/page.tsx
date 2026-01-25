"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { CalendarDays, History, Link2Off } from "lucide-react";

import { PaymentLinkPageHeading } from "@/components/dashboard/payment-link/payment-link-page-heading";
import {
  PaymentLinkStatsGrid,
  type PaymentLinkStat,
} from "@/components/dashboard/payment-link/payment-link-stats-grid";
import {
  PaymentLinkTable,
  type PaymentLinkRow,
} from "@/components/dashboard/payment-link/payment-link-table";
import { PaymentLinkTipCard } from "@/components/dashboard/payment-link/payment-link-tip-card";
import { ApiError } from "@/lib/api-client";
import { paymentLinksService } from "@/services/paymentLinksService";

type StoredPaymentLinkRow = {
  id: string;
  title: string;
  applicationTarget?: string;
  description?: string;
  amountType?: "fixed" | "free";
  amountValue?: number;
  currency?: string;
  logoUrl?: string;
  themeColor?: string;
  redirectUrl?: string;
  expiresAt?: string;
  maxUses?: number;
  collectCustomerInfo?: boolean;
  createdAtLabel: string;
  amountLabel: string;
  payments: number;
  status: PaymentLinkRow["status"];
  urlLabel: string;
};

const STORAGE_KEY = "sharepay.paymentLinks";

function readStoredLinks(): StoredPaymentLinkRow[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredPaymentLinkRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredLinks(rows: StoredPaymentLinkRow[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

function formatCreatedAtLabel(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function PaymentLinkPage() {
  const router = useRouter();

  const [rows, setRows] = useState<PaymentLinkRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    paymentLinksService
      .list()
      .then((res) => {
        if (cancelled) return;

        const next = (res.data ?? []).map<PaymentLinkRow>((link) => {
          const createdAt = link.createdAt ? new Date(link.createdAt) : null;
          const createdAtLabel = createdAt
            ? `Créé le ${formatCreatedAtLabel(createdAt)}`
            : "Créé récemment";

          const amountLabel =
            link.amountType === "free" ? "Variable" : link.amountValue != null ? `${link.amountValue} ${link.currency ?? ""}`.trim() : "—";

          return {
            id: link.id,
            title: link.title,
            createdAtLabel,
            amountLabel,
            payments: link.payments ?? 0,
            status: link.status ?? "ACTIVE",
            urlLabel: link.link || (link.id ? `pay.me/${link.id}` : "—"),
            icon: <Link2Off className="h-4 w-4" />,
          };
        });

        setRows(next);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Erreur lors du chargement des liens";
        const desc = err instanceof ApiError ? `HTTP ${err.status}` : undefined;
        toast.error(message, { description: desc });

        setRows([]);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const stats: PaymentLinkStat[] = useMemo(() => {
    const activeCount = rows.filter((r) => r.status === "ACTIVE").length;
    const totalPayments = rows.reduce((sum, r) => sum + r.payments, 0);
    const revenue = rows.reduce((sum, r) => {
      const match = r.amountLabel.match(/([0-9]+(?:\.[0-9]+)?)/);
      if (!match) return sum;
      const parsed = Number(match[1]);
      if (!Number.isFinite(parsed)) return sum;
      return sum + parsed;
    }, 0);

    const revenueLabel = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(revenue);

    return [
      {
        label: "Liens Actifs",
        value: String(activeCount),
        badgeLabel: "+5.2%",
        badgeClassName: "text-emerald-600 bg-emerald-500/10",
        icon: <Link2Off className="h-5 w-5" />,
        iconWrapClassName: "bg-blue-500/10 text-blue-600",
      },
      {
        label: "Chiffre d'affaires (Liens)",
        value: revenueLabel,
        badgeLabel: "+12.8%",
        badgeClassName: "text-emerald-600 bg-emerald-500/10",
        icon: <CalendarDays className="h-5 w-5" />,
        iconWrapClassName: "bg-emerald-500/10 text-emerald-600",
      },
      {
        label: "Total Paiements",
        value: new Intl.NumberFormat("fr-FR").format(totalPayments),
        badgeLabel: "-2.4%",
        badgeClassName: "text-red-600 bg-red-500/10",
        icon: <History className="h-5 w-5" />,
        iconWrapClassName: "bg-orange-500/10 text-orange-600",
      },
    ];
  }, [rows]);

  const footerLabel = useMemo(() => {
    return `Affichage de ${rows.length} sur ${rows.length} liens`;
  }, [rows.length]);

  const handleExpire = async (id: string) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Faire expirer ce lien ?");
      if (!ok) return;
    }

    try {
      await paymentLinksService.update(id, { status: "EXPIRED" });
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: "EXPIRED" } : r)));
      const stored = readStoredLinks();
      writeStoredLinks(stored.map((r) => (r.id === id ? { ...r, status: "EXPIRED" } : r)));
      toast.success("Lien expiré");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de l'expiration";
      const desc = err instanceof ApiError ? `HTTP ${err.status}` : undefined;
      toast.error(message, { description: desc });
    }
  };

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined") {
      const ok = window.confirm("Supprimer définitivement ce lien ?");
      if (!ok) return;
    }

    try {
      await paymentLinksService.remove(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      const stored = readStoredLinks();
      writeStoredLinks(stored.filter((r) => r.id !== id));
      toast.success("Lien supprimé");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      const desc = err instanceof ApiError ? `HTTP ${err.status}` : undefined;
      toast.error(message, { description: desc });
    }
  };

  return (
    <div className="space-y-10">
      <PaymentLinkPageHeading
        title="Liens de Paiement"
        subtitle="Gérez vos liens et suivez vos flux financiers en temps réel."
        onCreate={() => router.push("/dashboard/payment-link/new")}
      />

      <PaymentLinkStatsGrid stats={stats} />

      <PaymentLinkTable
        title={isLoading ? "Chargement…" : "Tous les liens"}
        rows={rows}
        footerLabel={footerLabel}
        onFilter={() => window.alert("Filtrer (à implémenter)")}
        onExport={() => window.alert("Exporter (à implémenter)")}
        onExpire={handleExpire}
        onDelete={handleDelete}
      />

      <PaymentLinkTipCard
        title="Astuce : Personnalisez vos liens"
        description="Vous pouvez désormais ajouter votre logo et vos propres couleurs aux pages de paiement pour renforcer votre image de marque."
        linkLabel="Accéder aux réglages de marque"
        linkHref="#"
      />
    </div>
  );
}
