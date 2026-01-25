"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { DevelopersCreateAppForm, type CreateDeveloperAppInput } from "@/components/dashboard/developers/developers-create-app-form";
import { ApiError } from "@/lib/api-client";
import { developerAppsService } from "@/services/developerAppsService";

export default function DeveloperCreateAppPage() {
  const router = useRouter();
  const pathname = usePathname();
  const backToDevelopers = pathname.replace(/\/apps\/new$/, "");
  const [draft, setDraft] = useState<Partial<CreateDeveloperAppInput>>({
    environment: "sandbox",
  });

  const title = useMemo(() => draft.name?.trim() || "Nouvelle Application", [draft.name]);
  const badgeLabel = draft.environment === "production" ? "Live" : "Sandbox";
  const badgeClassName =
    draft.environment === "production"
      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      : "bg-amber-500/10 text-amber-600 border-amber-500/20";

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <span className="text-2xl font-extrabold">A</span>
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h2>
              <span
                className={[
                  "px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wide",
                  badgeClassName,
                ].join(" ")}
              >
                {badgeLabel}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Configurez votre application pour obtenir vos clés API de test ou de production en quelques secondes.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => router.push(backToDevelopers)}
        >
          Retour
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <DevelopersCreateAppForm
          onCancel={() => router.push(backToDevelopers)}
          onDraftChange={setDraft}
          onSubmit={async (input: CreateDeveloperAppInput) => {
            try {
              if (!input.description.trim()) {
                toast.error("La description est requise.");
                return;
              }

              const res = await developerAppsService.create({
                name: input.name,
                description: input.description,
                environment: input.environment,
                webhookUrl: null,
              });

              toast.success("Application créée", {
                description: `${res.data.name} • ${res.data.environment === "SANDBOX" ? "Sandbox" : "Production"}`,
              });

              router.push(`${backToDevelopers}/apps/${encodeURIComponent(res.data.id)}`);
            } catch (err) {
              if (err instanceof ApiError) {
                toast.error(err.message || "Erreur lors de la création", {
                  description: `HTTP ${err.status}`,
                });
                return;
              }
              const message = err instanceof Error ? err.message : "Erreur lors de la création";
              toast.error(message);
            }
          }}
        />
      </div>
    </div>
  );
}
