import { ReactNode } from "react";

function ProgressBar({ value, className }: { value: number; className: string }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-4 h-1 w-full bg-muted rounded-full overflow-hidden">
      <div className={`h-full ${className}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export type OverviewStat = {
  label: string;
  value: string;
  badge: { label: string; className: string };
  icon: ReactNode;
  iconWrapClassName: string;
  progress: { value: number; className: string };
};

export function OverviewStatsGrid({ stats }: { stats: OverviewStat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${stat.iconWrapClassName}`}>{stat.icon}</div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${stat.badge.className}`}>
              {stat.badge.label}
            </span>
          </div>

          <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-extrabold text-foreground">{stat.value}</span>
          </div>

          <ProgressBar value={stat.progress.value} className={stat.progress.className} />
        </div>
      ))}
    </div>
  );
}
