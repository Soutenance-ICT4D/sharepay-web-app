"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type CreatePaymentLinkPayload = {
  title: string;
  amountType: "fixed" | "variable";
  amount?: number;
  status: "ACTIVE" | "EXPIRED";
};

export function PaymentLinkCreateModal({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onCreate: (payload: CreatePaymentLinkPayload) => void;
}) {
  const [title, setTitle] = useState("");
  const [amountType, setAmountType] = useState<CreatePaymentLinkPayload["amountType"]>("fixed");
  const [amount, setAmount] = useState<string>("49.99");
  const [status, setStatus] = useState<CreatePaymentLinkPayload["status"]>("ACTIVE");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (title.trim().length < 3) return false;
    if (amountType === "variable") return true;
    const parsed = Number(amount);
    return Number.isFinite(parsed) && parsed > 0;
  }, [amount, amountType, title]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-background/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
        aria-label="Fermer"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-xl border bg-card text-card-foreground shadow-xl">
          <div className="p-5 border-b flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">Créer un nouveau lien</h3>
              <p className="text-sm text-muted-foreground">Définissez l'objet et le montant du lien.</p>
            </div>
            <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>

          <form
            className="p-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);

              const cleanTitle = title.trim();
              if (cleanTitle.length < 3) {
                setError("Le titre doit contenir au moins 3 caractères.");
                return;
              }

              if (amountType === "fixed") {
                const parsed = Number(amount);
                if (!Number.isFinite(parsed) || parsed <= 0) {
                  setError("Veuillez entrer un montant valide.");
                  return;
                }

                onCreate({ title: cleanTitle, amountType, amount: parsed, status });
              } else {
                onCreate({ title: cleanTitle, amountType, status });
              }

              setTitle("");
              setAmount("49.99");
              setAmountType("fixed");
              setStatus("ACTIVE");
              onOpenChange(false);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="pl-title">Objet du lien</Label>
              <Input
                id="pl-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Abonnement Premium Mensuel"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pl-amount-type">Type de montant</Label>
                <select
                  id="pl-amount-type"
                  value={amountType}
                  onChange={(e) => setAmountType(e.target.value as CreatePaymentLinkPayload["amountType"])}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="fixed">Fixe</option>
                  <option value="variable">Variable</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pl-status">Statut</Label>
                <select
                  id="pl-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as CreatePaymentLinkPayload["status"])}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="ACTIVE">Actif</option>
                  <option value="EXPIRED">Expiré</option>
                </select>
              </div>
            </div>

            {amountType === "fixed" ? (
              <div className="space-y-2">
                <Label htmlFor="pl-amount">Montant (EUR)</Label>
                <Input
                  id="pl-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="49.99"
                />
              </div>
            ) : null}

            {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={!canSubmit} className="font-bold">
                Créer le lien
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
