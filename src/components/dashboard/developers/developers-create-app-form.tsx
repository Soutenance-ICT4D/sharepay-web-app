"use client";

import { useEffect, useMemo, useState } from "react";
import { Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EnvironmentValue = "sandbox" | "production";

export type CreateDeveloperAppInput = {
  name: string;
  description: string;
  environment: EnvironmentValue;
  redirectUrl?: string;
};

export function DevelopersCreateAppForm({
  onCancel,
  onSubmit,
  onDraftChange,
}: {
  onCancel: () => void;
  onSubmit: (input: CreateDeveloperAppInput) => Promise<void> | void;
  onDraftChange?: (draft: Partial<CreateDeveloperAppInput>) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState<EnvironmentValue>("sandbox");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const trimmedName = useMemo(() => name.trim(), [name]);

  useEffect(() => {
    onDraftChange?.({
      name: trimmedName,
      description: description.trim() || undefined,
      environment,
      redirectUrl: redirectUrl.trim() || undefined,
    });
  }, [description, environment, onDraftChange, redirectUrl, trimmedName]);

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <form
        className="p-8 flex flex-col gap-8"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          setDescriptionError(null);

          if (!trimmedName) {
            setError("Le nom de l'application est requis.");
            return;
          }

          if (!description.trim()) {
            setDescriptionError("La description est requise.");
            return;
          }

          setIsSubmitting(true);
          try {
            await onSubmit({
              name: trimmedName,
              description: description.trim(),
              environment,
              redirectUrl: redirectUrl.trim() || undefined,
            });
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <div className="flex flex-col gap-2">
          <Label className="text-foreground text-sm font-semibold" htmlFor="app_name">
            Nom de l&apos;application
          </Label>
          <Input
            id="app_name"
            placeholder="Ex: Mon E-commerce Shop"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="off"
          />
          {error ? <p className="text-[11px] text-destructive font-medium">{error}</p> : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-foreground text-sm font-semibold" htmlFor="app_desc">
            Description
          </Label>
          <textarea
            id="app_desc"
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            placeholder="Brève description du projet"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          {descriptionError ? <p className="text-[11px] text-destructive font-medium">{descriptionError}</p> : null}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-foreground text-sm font-semibold">Environnement initial</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={[
                "relative flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors",
                environment === "sandbox" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              ].join(" ")}
            >
              <input
                className="mt-1 text-primary focus:ring-primary h-4 w-4"
                name="env"
                type="radio"
                value="sandbox"
                checked={environment === "sandbox"}
                onChange={() => setEnvironment("sandbox")}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Sandbox</span>
                <span className="text-xs text-muted-foreground">
                  Mode test pour valider votre intégration sans transactions réelles.
                </span>
              </div>
            </label>

            <label
              className={[
                "relative flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors",
                environment === "production" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
              ].join(" ")}
            >
              <input
                className="mt-1 text-primary focus:ring-primary h-4 w-4"
                name="env"
                type="radio"
                value="production"
                checked={environment === "production"}
                onChange={() => setEnvironment("production")}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground">Production</span>
                <span className="text-xs text-muted-foreground">
                  Mode live pour accepter des paiements réels de vos clients.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label className="text-foreground text-sm font-semibold" htmlFor="redirect_url">
              URL de redirection
            </Label>
            <span className="text-xs text-muted-foreground font-medium">Optionnel</span>
          </div>
          <Input
            id="redirect_url"
            placeholder="https://votre-site.com/callback"
            type="url"
            value={redirectUrl}
            onChange={(event) => setRedirectUrl(event.target.value)}
          />
          <p className="text-[11px] text-muted-foreground">
            L&apos;URL vers laquelle vos clients seront redirigés après le paiement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border mt-4">
          <Button
            type="button"
            variant="ghost"
            className="w-full sm:w-auto font-bold"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Annuler
          </Button>

          <Button
            type="submit"
            className="w-full sm:w-auto px-8 font-bold shadow-lg shadow-primary/20 gap-2"
            disabled={isSubmitting}
          >
            <span>Créer l&apos;application</span>
            <Rocket className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
