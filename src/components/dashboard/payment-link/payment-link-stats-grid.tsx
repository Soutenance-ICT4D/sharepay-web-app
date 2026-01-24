import { ReactNode } from "react";

export type PaymentLinkStat = {
  label: string;
  value: string;
  badgeLabel: string;
  badgeClassName: string;
  icon: ReactNode;
  iconWrapClassName: string;
};

export function PaymentLinkStatsGrid({ stats }: { stats: PaymentLinkStat[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className={["p-2 rounded-lg", stat.iconWrapClassName].join(" ")}>{stat.icon}</div>
            <span
              className={[
                "text-xs font-bold flex items-center px-2 py-1 rounded-full",
                stat.badgeClassName,
              ].join(" ")}
            >
              {stat.badgeLabel}
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
