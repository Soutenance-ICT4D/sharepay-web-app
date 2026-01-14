"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing"; // Important : Importe depuis NOTRE config, pas next/navigation
import { ChangeEvent, useTransition } from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;

    startTransition(() => {
      // On remplace l'URL actuelle par la même URL mais avec la nouvelle locale
      // router.replace permet de changer l'URL sans rajouter une entrée dans l'historique (UX plus propre)
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative inline-block">
      <select
        defaultValue={locale}
        onChange={onSelectChange}
        disabled={isPending}
        className="h-10 w-20 appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="fr">FR 🇫🇷</option>
        <option value="en">EN 🇬🇧</option>
      </select>
      
      {/* Petite flèche SVG pour le style (optionnel) */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}