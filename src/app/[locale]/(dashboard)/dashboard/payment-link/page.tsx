"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import {
  CalendarDays,
  History,
  Link2Off,
  Megaphone,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

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

export default function PaymentLinkPage() {
  const router = useRouter();

  const defaultRows = useMemo<PaymentLinkRow[]>(
    () => [
      {
        id: "premium-sub-oct",
        title: "Abonnement Premium Mensuel",
        createdAtLabel: "Créé le 12 Oct 2023",
        amountLabel: "49.99 €",
        payments: 156,
        status: "ACTIVE",
        urlLabel: "pay.me/premium-sub-oct",
        icon: <ShoppingBag className="h-4 w-4" />,
      },
      {
        id: "workshop-2023",
        title: "Ticket Workshop Design",
        createdAtLabel: "Créé le 05 Oct 2023",
        amountLabel: "120.00 €",
        payments: 42,
        status: "EXPIRED",
        urlLabel: "pay.me/workshop-2023",
        icon: <CalendarDays className="h-4 w-4" />,
      },
      {
        id: "flash-consul-1h",
        title: "Consultation Flash (1h)",
        createdAtLabel: "Créé le 28 Sep 2023",
        amountLabel: "150.00 €",
        payments: 12,
        status: "ACTIVE",
        urlLabel: "pay.me/flash-consul-1h",
        icon: <Sparkles className="h-4 w-4" />,
      },
      {
        id: "donate-sport-local",
        title: "Donation Association Sport",
        createdAtLabel: "Créé le 20 Sep 2023",
        amountLabel: "Variable",
        payments: 832,
        status: "ACTIVE",
        urlLabel: "pay.me/donate-sport-local",
        icon: <Megaphone className="h-4 w-4" />,
      },
    ],
    []
  );

  const [rows, setRows] = useState<PaymentLinkRow[]>(defaultRows);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setRows(defaultRows);
        return;
      }

      const parsed = JSON.parse(raw) as StoredPaymentLinkRow[];
      const stored = Array.isArray(parsed)
        ? parsed.map<PaymentLinkRow>((row) => ({
            ...row,
            icon: <Link2Off className="h-4 w-4" />,
          }))
        : [];

      setRows([...stored, ...defaultRows]);
    } catch {
      setRows(defaultRows);
    }
  }, [defaultRows]);

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

  return (
    <div className="space-y-10">
      <PaymentLinkPageHeading
        title="Liens de Paiement"
        subtitle="Gérez vos liens et suivez vos flux financiers en temps réel."
        onCreate={() => router.push("/dashboard/payment-link/new")}
      />

      <PaymentLinkStatsGrid stats={stats} />

      <PaymentLinkTable
        title="Tous les liens"
        rows={rows}
        footerLabel={footerLabel}
        onFilter={() => window.alert("Filtrer (à implémenter)")}
        onExport={() => window.alert("Exporter (à implémenter)")}
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
