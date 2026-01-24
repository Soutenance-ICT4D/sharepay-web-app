"use client";

import { Button } from "@/components/ui/button";

export function TransactionsPaginationFooter({
  from,
  to,
  total,
  page,
  pages,
  onPrev,
  onNext,
  onSetPage,
}: {
  from: number;
  to: number;
  total: number;
  page: number;
  pages: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSetPage?: (page: number) => void;
}) {
  const safePages = Math.max(1, pages);
  const safePage = Math.min(Math.max(1, page), safePages);

  const pageButtons = (() => {
    if (safePages <= 5) return Array.from({ length: safePages }, (_, i) => i + 1);
    if (safePage <= 3) return [1, 2, 3, 4, safePages];
    if (safePage >= safePages - 2) return [1, safePages - 3, safePages - 2, safePages - 1, safePages];
    return [1, safePage - 1, safePage, safePage + 1, safePages];
  })();

  return (
    <div className="bg-muted/30 px-6 py-4 flex items-center justify-between border-t">
      <p className="text-xs text-muted-foreground font-medium">
        Affichage de {from} à {to} sur {total} transactions
      </p>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onPrev} disabled={safePage <= 1}>
          Précédent
        </Button>

        <div className="flex items-center gap-1">
          {pageButtons.map((p, idx) => {
            const isEdgeGap = idx > 0 && p - pageButtons[idx - 1] > 1;
            return (
              <div key={p} className="flex items-center gap-1">
                {isEdgeGap ? <span className="px-1 text-muted-foreground/60">...</span> : null}
                <button
                  type="button"
                  className={
                    "size-8 rounded text-xs font-bold transition-colors " +
                    (p === safePage
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted")
                  }
                  onClick={() => onSetPage?.(p)}
                >
                  {p}
                </button>
              </div>
            );
          })}
        </div>

        <Button type="button" variant="outline" size="sm" onClick={onNext} disabled={safePage >= safePages}>
          Suivant
        </Button>
      </div>
    </div>
  );
}
