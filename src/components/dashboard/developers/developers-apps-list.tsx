"use client";

import { useMemo } from "react";
import { Boxes, Code2, Globe, MoreVertical, Plus, Settings } from "lucide-react";

export type AppEnvironment = "live" | "sandbox";

export type DeveloperApp = {
  id: string;
  name: string;
  environment: AppEnvironment;
  createdAtLabel: string;
  apiVersion: string;
  description: string;
  icon: "commerce" | "mobile" | "analytics";
};

function environmentBadge(environment: AppEnvironment) {
  if (environment === "live") {
    return {
      label: "Live",
      className: "bg-emerald-500/10 text-emerald-600",
      dotClassName: "bg-emerald-500",
    };
  }

  return {
    label: "Sandbox",
    className: "bg-amber-500/10 text-amber-600",
    dotClassName: "bg-amber-500",
  };
}

function appIconStyle(icon: DeveloperApp["icon"]) {
  if (icon === "commerce") {
    return { wrapClassName: "bg-primary/10 text-primary", Icon: Boxes };
  }
  if (icon === "mobile") {
    return { wrapClassName: "bg-purple-500/10 text-purple-600", Icon: Globe };
  }

  return { wrapClassName: "bg-emerald-500/10 text-emerald-600", Icon: Code2 };
}

export function DevelopersAppsList({
  apps,
  filter,
  onFilterChange,
  onOpenApp,
  onOpenSettings,
  onOpenActions,
  onCreateProject,
}: {
  apps: DeveloperApp[];
  filter: "all" | AppEnvironment;
  onFilterChange: (value: "all" | AppEnvironment) => void;
  onOpenApp?: (app: DeveloperApp) => void;
  onOpenSettings?: (app: DeveloperApp) => void;
  onOpenActions?: (app: DeveloperApp) => void;
  onCreateProject?: () => void;
}) {
  const filteredApps = useMemo(() => {
    if (filter === "all") return apps;
    return apps.filter((app) => app.environment === filter);
  }, [apps, filter]);

  const activeCount = useMemo(() => {
    return apps.filter((app) => app.environment === "live").length;
  }, [apps]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-bold text-foreground">Mes Applications</h3>
          <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground text-xs font-bold">
            {activeCount} actifs
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtrer :</span>
          <select
            className="bg-transparent border-none text-xs font-bold text-primary focus:ring-0 cursor-pointer"
            value={filter}
            onChange={(event) => onFilterChange(event.target.value as "all" | AppEnvironment)}
          >
            <option value="all">Toutes les apps</option>
            <option value="live">Live</option>
            <option value="sandbox">Sandbox</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredApps.map((app) => {
          const env = environmentBadge(app.environment);
          const icon = appIconStyle(app.icon);
          return (
            <div
              key={app.id}
              className="group bg-card rounded-xl border border-border p-4 sm:p-5 hover:border-primary/40 transition-all cursor-pointer shadow-sm"
              onClick={() => onOpenApp?.(app)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  onOpenApp?.(app);
                }
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                  <div
                    className={[
                      "h-12 w-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shrink-0",
                      icon.wrapClassName,
                    ].join(" ")}
                  >
                    <icon.Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-0.5">
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {app.name}
                      </h4>
                      <span
                        className={[
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          env.className,
                        ].join(" ")}
                      >
                        <span className={[
                          "h-1.5 w-1.5 rounded-full",
                          env.dotClassName,
                        ].join(" ")} />
                        <span>{env.label}</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground font-medium">
                      <span>{app.createdAtLabel}</span>
                      <span className="text-border">|</span>
                      <span>{app.apiVersion}</span>
                      <span className="text-border">|</span>
                      <span className="italic">{app.description}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenSettings?.(app);
                    }}
                    aria-label="Paramètres"
                  >
                    <Settings className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-muted-foreground hover:text-foreground"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenActions?.(app);
                    }}
                    aria-label="Actions"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <button
          type="button"
          className="w-full py-8 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2"
          onClick={onCreateProject}
        >
          <Plus className="h-7 w-7" />
          <span className="text-sm font-bold">Ajouter un nouveau projet</span>
        </button>
      </div>
    </div>
  );
}
