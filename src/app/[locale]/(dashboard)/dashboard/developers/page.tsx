
"use client";

import { useMemo, useState } from "react";

import { DevelopersAppsList, type AppEnvironment, type DeveloperApp } from "@/components/dashboard/developers/developers-apps-list";
import { DevelopersPageHeading } from "@/components/dashboard/developers/developers-page-heading";
import { DevelopersResources } from "@/components/dashboard/developers/developers-resources";
import { DevelopersSidebar } from "@/components/dashboard/developers/developers-sidebar";

export default function DevelopersPage() {
  const [filter, setFilter] = useState<"all" | AppEnvironment>("all");

  const apps = useMemo<DeveloperApp[]>(
    () => [
      {
        id: "app_shopify",
        name: "Boutique Shopify Principale",
        environment: "live",
        createdAtLabel: "Créé le 12 Oct 2023",
        apiVersion: "API v2.4",
        description: "Connecteur e-commerce flux automatique",
        icon: "commerce",
      },
      {
        id: "app_ios",
        name: "App Mobile iOS Client",
        environment: "sandbox",
        createdAtLabel: "Créé le 05 Jan 2024",
        apiVersion: "API v2.4",
        description: "Suivi transactions et notifications push",
        icon: "mobile",
      },
      {
        id: "app_bi",
        name: "Dashboard Reporting BI",
        environment: "live",
        createdAtLabel: "Créé le 15 Fév 2024",
        apiVersion: "API v2.4",
        description: "Analyse agrégée et exports comptables",
        icon: "analytics",
      },
    ],
    []
  );

  const filteredApps = useMemo(() => {
    if (filter === "all") return apps;
    return apps.filter((app) => app.environment === filter);
  }, [apps, filter]);

  const activeCount = useMemo(() => {
    return apps.filter((app) => app.environment === "live").length;
  }, [apps]);

  return (
    <div className="space-y-8">
      <DevelopersPageHeading
        title="Espace Développeur"
        subtitle="Pilotez vos intégrations de paiement et accédez à nos ressources techniques pour une mise en œuvre rapide et sécurisée."
        onCreate={() => window.alert("Nouvelle application (à implémenter)")}
      />

      <DevelopersResources />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <DevelopersAppsList
            apps={apps}
            filter={filter}
            onFilterChange={setFilter}
            onOpenApp={(app) => window.alert(`Ouvrir ${app.name} (à implémenter)`) }
            onOpenSettings={(app) => window.alert(`Paramètres ${app.name} (à implémenter)`) }
            onOpenActions={(app) => window.alert(`Actions ${app.name} (à implémenter)`) }
            onCreateProject={() => window.alert("Ajouter un nouveau projet (à implémenter)")}
          />
        </div>

        <DevelopersSidebar />
      </div>
    </div>
  );
}
