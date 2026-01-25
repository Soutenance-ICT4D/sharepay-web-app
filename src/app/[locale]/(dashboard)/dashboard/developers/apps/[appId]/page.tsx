"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { Copy, Eye, EyeOff, KeyRound, Link as LinkIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { developerAppsService, type DeveloperApp } from "@/services/developerAppsService";

type AppEnvironment = "live" | "sandbox";

type AppDetails = {
  id: string;
  name: string;
  environment: AppEnvironment;
  createdAtLabel: string;
  apiVersion: string;
  description: string;
  icon: "commerce" | "mobile" | "analytics";
  publicKey: string;
  secretKeyMasked: string;
  webhooks: Array<{ url: string; events: string[]; status: "active" | "inactive" }>;
};

function createdAtLabel(value?: string) {
  if (!value) return "—";
  try {
    return `Créé le ${new Date(value).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}`;
  } catch {
    return "—";
  }
}

function toDetails(appId: string, app: DeveloperApp): AppDetails {
  return {
    id: app.id ?? appId,
    name: app.name ?? appId,
    environment: app.environment === "PRODUCTION" ? "live" : "sandbox",
    createdAtLabel: createdAtLabel(app.createdAt),
    apiVersion: app.apiVersion ?? "API v2.4",
    description: app.description ?? "—",
    icon: "commerce",
    publicKey: app.publicKey ?? "—",
    secretKeyMasked: app.secretKeyMasked ?? "••••••••••••••••••••••••",
    webhooks: [],
  };
}

function appIconMeta(icon: AppDetails["icon"]) {
  if (icon === "commerce") return { wrap: "bg-primary/10 text-primary", label: "Commerce" };
  if (icon === "mobile") return { wrap: "bg-purple-500/10 text-purple-600", label: "Mobile" };
  return { wrap: "bg-emerald-500/10 text-emerald-600", label: "Analytics" };
}

function envBadge(environment: AppEnvironment) {
  if (environment === "live") {
    return { label: "Live", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
  }
  return { label: "Sandbox", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
}

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Copié");
  } catch {
    toast.error("Impossible de copier");
  }
}

export default function DeveloperAppDetailsPage() {
  const params = useParams<{ appId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [app, setApp] = useState<AppDetails | null>(null);
  const [rawStatus, setRawStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const appId = params.appId;

    setIsLoading(true);
    developerAppsService
      .get(appId)
      .then((res) => {
        if (cancelled) return;
        setApp(toDetails(appId, res.data));
        setRawStatus(res.data.status ?? null);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Erreur lors du chargement de l'application";
        toast.error(message);

        const queryName = searchParams.get("name") ?? undefined;
        const queryEnv = searchParams.get("env") as "sandbox" | "production" | null;
        const environmentOverride: AppEnvironment | undefined =
          queryEnv === "production" ? "live" : queryEnv === "sandbox" ? "sandbox" : undefined;

        setApp({
          id: appId,
          name: queryName ?? appId,
          environment: environmentOverride ?? "sandbox",
          createdAtLabel: "—",
          apiVersion: "API v2.4",
          description: "—",
          icon: "commerce",
          publicKey: "—",
          secretKeyMasked: "••••••••••••••••••••••••",
          webhooks: [],
        });
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [params.appId, searchParams]);

  const badge = app ? envBadge(app.environment) : envBadge("sandbox");
  const icon = app ? appIconMeta(app.icon) : appIconMeta("commerce");

  const [revealSecret, setRevealSecret] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");

  const developersPath = pathname.replace(/\/apps\/[^/]+$/, "");
  const canDelete = deleteInput.trim() === (app?.name ?? "");

  const webhooks = app?.webhooks ?? [];

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className={["size-16 rounded-2xl flex items-center justify-center", icon.wrap].join(" ")}> 
            <span className="text-2xl font-extrabold">{icon.label[0]}</span>
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{app?.name ?? "Chargement..."}</h2>
              <span
                className={[
                  "px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wide",
                  badge.className,
                ].join(" ")}
              >
                {badge.label}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-1">ID de l'application: {app?.id ?? params.appId}</p>
          </div>
        </div>

        <Button type="button" variant="ghost" className="font-bold" onClick={() => router.push(developersPath)}>
          Retour
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {isLoading ? <div className="text-sm text-muted-foreground">Chargement...</div> : null}
        <section className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">Clés d'API de l'Application</h3>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Clé Publique (PK)
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                  <code className="flex-1 text-sm font-mono text-foreground/80 overflow-hidden text-ellipsis">
                    {app?.publicKey}
                  </code>
                  <button
                    type="button"
                    className="p-1 hover:text-primary transition-colors"
                    title="Copier"
                    onClick={() => copyToClipboard(app?.publicKey ?? "")}
                    disabled={!app?.publicKey}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Clé Secrète (SK)
                </label>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border border-border">
                  <code className="flex-1 text-sm font-mono text-foreground/80 tracking-widest overflow-hidden">
                    {revealSecret ? "sk_live_****************" : app?.secretKeyMasked}
                  </code>
                  <button
                    type="button"
                    className="p-1 hover:text-primary transition-colors"
                    title={revealSecret ? "Masquer" : "Révéler"}
                    onClick={() => setRevealSecret((v) => !v)}
                  >
                    {revealSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    className="p-1 hover:text-primary transition-colors"
                    title="Copier"
                    onClick={() => {
                      if (!revealSecret) {
                        toast.info("Révélez la clé pour la copier");
                        return;
                      }
                      void copyToClipboard("sk_live_****************");
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LinkIcon className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg text-foreground">SDK & Intégration</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "SDK Node.js", desc: "Intégration backend simplifiée.", cta: "Télécharger" },
                { title: "Snippets React", desc: "Composants UI prêts à l'emploi.", cta: "Voir les snippets" },
                { title: "iOS / Android", desc: "SDK natifs pour mobile.", cta: "Documentation" },
              ].map((card) => (
                <div
                  key={card.title}
                  className="p-4 rounded-xl bg-muted/30 border border-border flex flex-col items-center text-center gap-3 hover:border-primary/50 transition-colors cursor-pointer group"
                  role="button"
                  tabIndex={0}
                  onClick={() => toast.info("À connecter", { description: card.title })}
                >
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span className="text-sm font-bold">SP</span>
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{card.title}</h4>
                  <p className="text-[11px] text-muted-foreground">{card.desc}</p>
                  <button type="button" className="mt-2 text-xs font-bold text-primary uppercase tracking-tight">
                    {card.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-primary font-bold">WH</span>
              <h3 className="font-bold text-lg text-foreground">Webhooks de l'application</h3>
            </div>
            <Button type="button" variant="ghost" className="text-xs font-bold" onClick={() => toast.info("À implémenter")}
            >
              Configurer Webhook
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border">
                  <th className="px-6 py-3">URL</th>
                  <th className="px-6 py-3">Events</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {webhooks.length ? (
                  webhooks.map((wh) => (
                    <tr key={wh.url} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-foreground">{wh.url}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {wh.events.map((e) => (
                            <span
                              key={e}
                              className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-foreground/80"
                            >
                              {e}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase">
                          {wh.status === "active" ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => toast.info("À implémenter")}
                        >
                          •••
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-6 text-sm text-muted-foreground" colSpan={4}>
                      Aucun webhook configuré.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-destructive/5 rounded-xl border-2 border-dashed border-destructive/30 overflow-hidden">
          <div className="p-5 border-b border-destructive/20 bg-destructive/5">
            <div className="flex items-center gap-3">
              <Trash2 className="h-5 w-5 text-destructive" />
              <h3 className="font-bold text-lg text-destructive">Zone de danger</h3>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <p className="font-bold text-foreground">Actions critiques</p>
                <p className="text-sm text-muted-foreground">
                  La suspension interrompt le flux. La suppression est irréversible.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto font-bold border-destructive/30 text-destructive hover:bg-destructive/10"
                  onClick={async () => {
                    if (!app) return;
                    try {
                      const isSuspended = rawStatus === "SUSPENDED";
                      const res = isSuspended
                        ? await developerAppsService.activate(app.id)
                        : await developerAppsService.suspend(app.id);
                      setApp(toDetails(app.id, res.data));
                      setRawStatus(res.data.status ?? (isSuspended ? "ACTIVE" : "SUSPENDED"));
                      toast.success(isSuspended ? "Application réactivée" : "Application suspendue", {
                        description: app.name,
                      });
                    } catch (err) {
                      const message = err instanceof Error ? err.message : "Erreur lors de la mise à jour";
                      toast.error(message);
                    }
                  }}
                  disabled={!app}
                >
                  {rawStatus === "SUSPENDED" ? "Réactiver l'application" : "Suspendre l'application"}
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  className="w-full sm:w-auto font-bold gap-2"
                  onClick={() => {
                    setDeleteInput("");
                    setIsDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer l'application
                </Button>
              </div>
            </div>
          </div>
        </section>

        {isDeleteOpen ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsDeleteOpen(false)}
              aria-label="Fermer"
            />

            <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-lg">
              <div className="p-5 border-b border-border">
                <h4 className="text-lg font-bold text-foreground">Confirmer la suppression</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Tapez <span className="font-bold text-foreground">{app?.name ?? ""}</span> pour confirmer.
                </p>
              </div>

              <div className="p-5 space-y-3">
                <Input
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  placeholder={app?.name ?? ""}
                  autoFocus
                />
                <p className="text-[11px] text-muted-foreground">Cette action est irréversible.</p>
              </div>

              <div className="p-5 border-t border-border flex flex-col sm:flex-row gap-3 justify-end">
                <Button type="button" variant="ghost" className="font-bold" onClick={() => setIsDeleteOpen(false)}>
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="font-bold gap-2"
                  disabled={!canDelete}
                  onClick={async () => {
                    if (!app) return;
                    try {
                      await developerAppsService.remove(app.id);
                      toast.success("Application supprimée", { description: app.name });
                      setIsDeleteOpen(false);
                      router.push(developersPath);
                    } catch (err) {
                      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
                      toast.error(message);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer définitivement
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
