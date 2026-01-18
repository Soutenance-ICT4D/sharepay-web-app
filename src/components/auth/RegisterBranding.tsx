"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { HeroAnimation } from "@/components/ui/hero-animation";

export default function RegisterBranding() {
  const t = useTranslations("Auth");

  return (
    <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-l lg:flex">
      <div className="absolute inset-0 bg-emerald-600/90">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <HeroAnimation />
        </div>
      </div>

      <div className="relative z-20 flex items-center text-lg font-medium justify-end">
        SharePay
        <div className="ml-2 h-8 w-8 relative">
          <Image
            src="/images/logo_sharepay_bg_remove_svg.svg"
            alt="Logo"
            fill
            className="object-contain brightness-0 invert"
          />
        </div>
      </div>

      <div className="relative z-20 mt-auto text-right">
        <blockquote className="space-y-2">
          <p className="text-2xl font-semibold tracking-tight">Créer un compte</p>
          <p className="text-sm opacity-90">Rejoignez SharePay et commencez à encaisser plus vite.</p>
          <p className="text-lg">&ldquo;{t("quote")}&rdquo;</p>
          <footer className="text-sm opacity-80">
            {t("quoteAuthor")} <span className="opacity-50">|</span> {t("quoteRole")}
          </footer>
        </blockquote>
      </div>
    </div>
  );
}
