import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function OverviewInsightCard({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  actionLabel: string;
  onAction?: () => void;
}) {
  return (
    <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6">
      <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shrink-0 shadow-lg shadow-primary/20">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-bold text-foreground">{title}</h4>
        <p className="text-muted-foreground text-sm mt-1 max-w-2xl">{description}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        className="border-primary/30 text-primary font-bold hover:bg-primary hover:text-primary-foreground"
        onClick={onAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
}
