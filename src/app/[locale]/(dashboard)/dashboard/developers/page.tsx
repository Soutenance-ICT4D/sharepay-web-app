
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

import { DevelopersAppsList, type AppEnvironment, type DeveloperApp } from "@/components/dashboard/developers/developers-apps-list";
import { DevelopersPageHeading } from "@/components/dashboard/developers/developers-page-heading";
import { DevelopersResources } from "@/components/dashboard/developers/developers-resources";
import { DevelopersSidebar } from "@/components/dashboard/developers/developers-sidebar";
import { developerAppsService } from "@/services/developerAppsService";

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

export default function DevelopersPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState<"all" | AppEnvironment>("all");

  const [apps, setApps] = useState<DeveloperApp[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    developerAppsService
      .list()
      .then((res) => {
        if (cancelled) return;
        const next = (res.data ?? []).map<DeveloperApp>((app) => ({
          id: app.id,
          name: app.name,
          environment: app.environment === "PRODUCTION" ? "live" : "sandbox",
          createdAtLabel: createdAtLabel(app.createdAt),
          apiVersion: app.apiVersion ?? "API v2.4",
          description: app.description ?? "—",
          icon: "commerce",
        }));
        setApps(next);
      })
      .catch((err) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "Erreur lors du chargement des applications";
        toast.error(message);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <DevelopersPageHeading
        title="Espace Développeur"
        subtitle="Pilotez vos intégrations de paiement et accédez à nos ressources techniques pour une mise en œuvre rapide et sécurisée."
        onCreate={() => router.push(`${pathname}/apps/new`)}
      />

      <DevelopersResources />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <DevelopersAppsList
            apps={apps}
            filter={filter}
            onFilterChange={setFilter}
            onOpenApp={(app) => router.push(`${pathname}/apps/${app.id}`)}
            onOpenSettings={(app) => window.alert(`Paramètres ${app.name} (à implémenter)`) }
            onOpenActions={(app) => window.alert(`Actions ${app.name} (à implémenter)`) }
            onCreateProject={() => router.push(`${pathname}/apps/new`)}
          />
          {isLoading ? (
            <div className="mt-4 text-sm text-muted-foreground">Chargement...</div>
          ) : null}
        </div>

        <DevelopersSidebar />
      </div>
    </div>
  );
}
