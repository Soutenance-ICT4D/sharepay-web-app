"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTransition } from "react";
import { Check, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image"; // On utilisera une balise img standard pour éviter la config next.config.ts pour l'instant

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // On utilise des images PNG provenant de flagcdn pour être compatible Windows
  const languages = [
    { 
      code: 'fr', 
      label: 'Français', 
      flagSrc: 'https://flagcdn.com/w40/fr.png' 
    },
    { 
      code: 'en', 
      label: 'English', 
      flagSrc: 'https://flagcdn.com/w40/gb.png' 
    },
  ];

  const currentLanguage = languages.find(l => l.code === locale);

  function onSelect(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="relative h-full flex items-center group cursor-pointer px-2 z-50">
      
      {/* --- LE DÉCLENCHEUR (TRIGGER) --- */}
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
        {/* Spinner si chargement, sinon Drapeau Actuel */}
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="relative h-3.5 w-5 overflow-hidden rounded-sm shadow-sm">
             {/* Balise img simple pour ne pas bloquer sur next.config.ts */}
             <img 
               src={currentLanguage?.flagSrc} 
               alt={currentLanguage?.label} 
               className="h-full w-full object-cover"
             />
          </div>
        )}
        
        {/* Code langue actuel (FR/EN) */}
        <span className="uppercase font-semibold">{locale}</span>
        
        {/* Flèche animée */}
        <ChevronDown className="h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
      </div>

      {/* --- LE MENU DÉROULANT (DROPDOWN) --- */}
      <div className="absolute top-full right-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
        
        <div className="w-40 rounded-xl border bg-card p-1 shadow-xl ring-1 ring-border">
          <div className="flex flex-col gap-0.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                disabled={isPending}
                className={cn(
                  "relative flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted/80",
                  locale === lang.code 
                    ? "font-semibold text-primary bg-primary/5" 
                    : "text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-3.5 w-5 overflow-hidden rounded-sm shadow-sm">
                    <img 
                      src={lang.flagSrc} 
                      alt={lang.label} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span>{lang.label}</span>
                </div>
                
                {/* Coche si actif */}
                {locale === lang.code && (
                  <Check className="h-3.5 w-3.5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}