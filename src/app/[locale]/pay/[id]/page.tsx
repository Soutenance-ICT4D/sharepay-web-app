"use client";

import { use, useEffect, useMemo, useState } from "react";

import { ApiError, apiRequest } from "@/lib/api-client";
import { PayPage, type PaymentPageData } from "../_components/pay-page";

type PublicPaymentLinkDto = {
  id?: string;
  title?: string;
  description?: string;
  amountType?: "FIXED" | "FLEXIBLE";
  amountValue?: number | null;
  currency?: string | null;
  logoUrl?: string | null;
  themeColor?: string | null;
  redirectUrl?: string | null;
  collectCustomerInfo?: boolean | null;
};

export default function PayByIdPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<PaymentPageData | null>(null);
  const [notFound, setNotFound] = useState(false);

  const { id } = use(params as unknown as Promise<{ id: string }>);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await apiRequest<PublicPaymentLinkDto>(
          `/payment-links/public/${encodeURIComponent(id)}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          }
        );

        const dto = res.data;
        const normalizedAmountType =
          dto.amountType === "FLEXIBLE" ? "free" : "fixed";

        const mapped: PaymentPageData = {
          id,
          title: dto.title || "Paiement",
          description: dto.description || undefined,
          amountType: normalizedAmountType,
          amountValue: dto.amountValue ?? undefined,
          currency: dto.currency || "XAF",
          logoUrl: dto.logoUrl || undefined,
          themeColor: dto.themeColor || "#098865",
          redirectUrl: dto.redirectUrl || undefined,
          collectCustomerInfo: dto.collectCustomerInfo ?? true,
        };

        if (cancelled) return;
        setNotFound(false);
        setData(mapped);
      } catch (err) {
        if (cancelled) return;

        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
          setData(null);
          return;
        }

        setNotFound(true);
        setData(null);
      }
    })();

    return () => {
      cancelled = true;
    };
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
