"use client";

import { PayPage, type PaymentPageData } from "../_components/pay-page";

const DEFAULT_DATA: PaymentPageData = {
  id: "default",
  title: "Paiement de test SharePay",
  description: "Page de paiement indépendante (mode test).",
  amountType: "fixed",
  amountValue: 10000,
  currency: "XAF",
  themeColor: "#098865",
  collectCustomerInfo: true,
};

export default function PayDefaultPage() {
  return <PayPage data={DEFAULT_DATA} mode="default" />;
}
