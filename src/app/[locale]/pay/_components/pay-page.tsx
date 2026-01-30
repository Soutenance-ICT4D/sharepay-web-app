"use client";

import { useMemo, useState } from "react";
import { Check, Image as ImageIcon, Smartphone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { paymentLinksService } from "@/services/paymentLinksService";
import { PayAppBar } from "./pay-app-bar";

export type PaymentPageData = {
  id: string;
  title: string;
  description?: string;
  amountType: "fixed" | "free";
  amountValue?: number;
  currency: string;
  logoUrl?: string;
  themeColor?: string;
  redirectUrl?: string;
  collectCustomerInfo?: boolean;
};

export function PayPage({
  data,
  mode,
}: {
  data: PaymentPageData;
  mode: "default" | "id";
}) {
  const router = useRouter();
  const accent = data.themeColor || "#098865";
  const accentRing = `${accent}4D`;
  const accentBg = `${accent}0D`;

  const [partner, setPartner] = useState<"orange" | "mtn">("orange");
  const [hoveredPartner, setHoveredPartner] = useState<"orange" | "mtn" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amountInput, setAmountInput] = useState("");

  const [momoPhone, setMomoPhone] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);

  const canPay = useMemo(() => {
    if (isProcessing) return false;

    if (data.collectCustomerInfo) {
      if (!name.trim()) return false;
      if (!email.trim()) return false;
    }

    if (data.amountType === "free") {
      const parsed = Number(amountInput);
      if (!Number.isFinite(parsed) || parsed <= 0) return false;
    }

    if (!momoPhone.trim()) return false;
    return true;
  }, [amountInput, data.amountType, data.collectCustomerInfo, email, momoPhone, name, isProcessing]);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Determine amount
      let finalAmount = data.amountValue || 0;
      if (data.amountType === "free") {
        finalAmount = Number(amountInput);
      }

      const payload = {
        amount: finalAmount,
        currency: data.currency,
        provider: partner === "orange" ? "ORANGE_MONEY" : "MTN_MOMO",
        phoneNumber: momoPhone,
        customerName: name,
        customerEmail: email,
      };

      const res = await paymentLinksService.payPublic(data.id, payload);

      if (res.data?.success) {
        toast.success("Paiement initié avec succès !");

        if (res.data.redirectUrl) {
          window.location.href = res.data.redirectUrl;
        } else if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
        } else {
          // Show success state locally if no redirect
          toast.success("Merci pour votre paiement.");
          // Optional: clear form or show success UI
        }
      } else {
        toast.error("Le paiement a échoué ou est en attente.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Une erreur est survenue lors du paiement.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ "--pay-accent": accent } as React.CSSProperties}>
      <PayAppBar />

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="h-full overflow-y-auto pt-12 pb-8 px-6 flex flex-col items-center">
              {data.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.logoUrl}
                  alt="Logo"
                  className="w-16 h-16 rounded-full object-cover mb-4 border shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-muted flex items-center justify-center mb-4 border border-dashed border-slate-200 dark:border-border">
                  <ImageIcon className="text-slate-300 dark:text-muted-foreground" />
                </div>
              )}

              <h4 className="text-lg font-bold text-center leading-tight mb-2">
                {data.title || "Titre de votre produit"}
              </h4>
              <p className="text-xs text-center text-slate-500 dark:text-muted-foreground mb-6 line-clamp-3">
                {data.description || "La description de votre offre apparaîtra ici pour vos clients."}
              </p>

              <div className="w-full bg-slate-50 dark:bg-muted/30 rounded-2xl p-4 mb-6 border border-slate-100 dark:border-border">
                <span className="text-[10px] text-slate-400 dark:text-muted-foreground font-bold uppercase">Montant à payer</span>
                <div className="text-2xl font-black" style={{ color: accent }}>
                  {data.amountType === "free" ? "--" : data.amountValue?.toLocaleString()} {data.currency}
                </div>
              </div>

              <div className="w-full space-y-3 mt-auto">
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 dark:text-muted-foreground font-semibold">Méthode de paiement</div>

                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { key: "orange", label: "Orange Money", src: "/images/partners/orange.png" },
                      { key: "mtn", label: "MTN MoMo", src: "/images/partners/mtn.png" },
                    ] as const).map((p) => {
                      const isActive = partner === p.key;
                      const isHovered = hoveredPartner === p.key;
                      return (
                        <button
                          key={p.key}
                          type="button"
                          onClick={() => setPartner(p.key)}
                          onMouseEnter={() => setHoveredPartner(p.key)}
                          onMouseLeave={() => setHoveredPartner((v) => (v === p.key ? null : v))}
                          className={[
                            "relative h-16 rounded-2xl border bg-white dark:bg-background/40 flex items-center justify-center transition-all",
                            isActive
                              ? "ring-4"
                              : "border-slate-200 dark:border-border",
                          ].join(" ")}
                          style={
                            isActive
                              ? {
                                borderColor: accent,
                                backgroundColor: accentBg,
                                boxShadow: `0 0 0 4px ${accentRing}`,
                              }
                              : isHovered
                                ? {
                                  borderColor: accent,
                                  backgroundColor: accentBg,
                                }
                                : undefined
                          }
                          aria-pressed={isActive}
                          aria-label={p.label}
                          title={p.label}
                        >
                          {isActive ? (
                            <span
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full text-primary-foreground flex items-center justify-center shadow-lg"
                              style={{ backgroundColor: accent, boxShadow: `0 10px 15px -3px ${accentRing}` }}
                            >
                              <Check className="h-4 w-4" />
                            </span>
                          ) : null}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.src} alt={p.label} className="h-9 w-auto max-w-[110px] object-contain" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {data.amountType === "free" ? (
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500 dark:text-muted-foreground" htmlFor="pay-amount">
                      Montant ({data.currency})
                    </Label>
                    <Input
                      id="pay-amount"
                      inputMode="numeric"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      placeholder="Ex: 10000"
                      className="h-10 rounded-lg focus-visible:ring-[var(--pay-accent)] focus-visible:border-[var(--pay-accent)]"
                    />
                  </div>
                ) : null}

                {data.collectCustomerInfo ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500 dark:text-muted-foreground" htmlFor="pay-name">
                        Nom
                      </Label>
                      <Input
                        id="pay-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 rounded-lg focus-visible:ring-[var(--pay-accent)] focus-visible:border-[var(--pay-accent)]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500 dark:text-muted-foreground" htmlFor="pay-email">
                        Email
                      </Label>
                      <Input
                        id="pay-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-10 rounded-lg focus-visible:ring-[var(--pay-accent)] focus-visible:border-[var(--pay-accent)]"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-500 dark:text-muted-foreground" htmlFor="momo-phone">
                      Téléphone ({partner === "orange" ? "Orange" : "MTN"})
                    </Label>
                    <Input
                      id="momo-phone"
                      inputMode="tel"
                      placeholder="Ex: 6XXXXXXXX"
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      className="h-10 rounded-lg focus-visible:ring-[var(--pay-accent)] focus-visible:border-[var(--pay-accent)]"
                    />
                  </div>
                </div>

                <Button
                  className="w-full h-12 rounded-xl font-bold shadow-lg transition-all"
                  style={{ backgroundColor: accent, color: "#fff" }}
                  disabled={!canPay}
                  onClick={handlePayment}
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Payer maintenant"
                  )}
                </Button>
              </div>

              <p className="mt-6 text-[10px] text-slate-400 dark:text-muted-foreground flex items-center gap-1">
                <Smartphone className="w-3 h-3" /> Sécurisé par SharePay
              </p>

              {mode === "default" ? (
                <p className="mt-2 text-[10px] text-slate-400 dark:text-muted-foreground">Mode test: /pay/default</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
