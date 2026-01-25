"use client";

import Image from "next/image";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function PayAppBar() {
  return (
    <div className="sticky top-0 z-20">
      <header className="border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto w-full max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-9 w-9 flex items-center justify-center">
              <Image
                src="/images/logo_sharepay_bg_remove_svg.svg"
                alt="SharePay"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold tracking-tight text-foreground truncate">SharePay</div>
              <div className="text-[11px] text-muted-foreground truncate">Paiement sécurisé</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0 border rounded-full pl-1 pr-2 py-1 bg-background shadow-sm hover:border-primary/50 transition-colors">
              <ThemeToggle />
              <div className="h-4 w-px bg-border mx-1" />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
