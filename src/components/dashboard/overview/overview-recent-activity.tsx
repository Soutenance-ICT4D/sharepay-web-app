import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export type OverviewActivityItem = {
  id: string;
  title: string;
  meta: string;
  amount: string;
  status: string;
  amountClassName?: string;
  statusClassName?: string;
  icon: ReactNode;
  iconWrapClassName: string;
};

export function OverviewRecentActivity({
  title,
  viewAllLabel,
  items,
  onViewAll,
  onLoadMore,
}: {
  title: string;
  viewAllLabel: string;
  items: OverviewActivityItem[];
  onViewAll?: () => void;
  onLoadMore?: () => void;
}) {
  return (
    <div className="bg-card text-card-foreground rounded-xl border flex flex-col overflow-hidden">
      <div className="p-6 border-b flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-primary hover:text-primary hover:bg-primary/10 font-bold"
          onClick={onViewAll}
        >
          {viewAllLabel}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[450px]">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="w-full text-left p-4 border-b last:border-b-0 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${item.iconWrapClassName}`}>
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{item.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">{item.meta}</p>
              </div>

              <div className="text-right">
                <p className={`text-sm font-bold ${item.amountClassName ?? "text-foreground"}`}>
                  {item.amount}
                </p>
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest ${
                    item.statusClassName ?? "text-muted-foreground"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 bg-muted/30 text-center">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground font-bold"
          onClick={onLoadMore}
        >
          Charger plus d'activité
        </Button>
      </div>
    </div>
  );
}
