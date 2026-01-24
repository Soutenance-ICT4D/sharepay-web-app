"use client";

import { useEffect, useMemo, useState } from "react";

import { PayPage, type PaymentPageData } from "../_components/pay-page";

type StoredPaymentLinkRow = {
  id: string;
  title: string;
  description?: string;
  amountType?: "fixed" | "free";
  amountValue?: number;
  currency?: string;
  logoUrl?: string;
  themeColor?: string;
  redirectUrl?: string;
  collectCustomerInfo?: boolean;
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

export default function PayByIdPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<PaymentPageData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const id = params.id;

  useEffect(() => {
    const links = readStoredLinks();
    const match = links.find((row) => row.id === id);

    if (!match) {
      setNotFound(true);
      setData(null);
      return;
    }

    setNotFound(false);
    setData({
      id: match.id,
      title: match.title,
      description: match.description,
      amountType: match.amountType === "free" ? "free" : "fixed",
      amountValue: match.amountValue,
      currency: match.currency || "XAF",
      logoUrl: match.logoUrl,
      themeColor: match.themeColor || "#098865",
      redirectUrl: match.redirectUrl,
      collectCustomerInfo: match.collectCustomerInfo ?? true,
    });
  }, [id]);

  const fallback = useMemo<PaymentPageData>(() => {
    return {
      id,
      title: "Lien introuvable",
      description: "Ce lien de paiement n'existe pas (encore) dans ce navigateur.",
      amountType: "fixed",
      amountValue: 0,
      currency: "XAF",
      themeColor: "#098865",
      collectCustomerInfo: false,
    };
  }, [id]);

  if (notFound) {
    return <PayPage data={fallback} mode="id" />;
  }

  if (!data) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-xl border bg-card p-6 text-card-foreground">
          <div className="text-lg font-bold text-foreground">Chargement…</div>
          <div className="mt-2 text-sm text-muted-foreground">Récupération du lien de paiement.</div>
        </div>
      </div>
    );
  }

  return <PayPage data={data} mode="id" />;
}
