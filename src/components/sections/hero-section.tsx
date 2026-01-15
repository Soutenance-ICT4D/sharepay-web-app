"use client"; // Important car on utilise useTranslations et HeroAnimation (client)

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight, Terminal } from "lucide-react";
// 1. IMPORT DU NOUVEAU COMPOSANT
import { HeroAnimation } from "@/components/ui/hero-animation";

export function HeroSection() {
  const t = useTranslations('Landing');

  return (
    <section className="relative overflow-hidden py-20 md:py-32 flex flex-col items-center text-center gap-8 min-h-[600px] justify-center">
      
      {/* 2. L'ANIMATION 3D EN FOND */}
      <HeroAnimation />

      {/* --- GLOW LÉGER (OPTIONNEL) --- */}
      {/* On garde un léger glow vert derrière le texte pour la lisibilité */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-background/80 blur-3xl -z-10 rounded-full pointer-events-none" />

      {/* 3. LE CONTENU (Reste inchangé mais avec z-10 pour passer devant) */}
      <div className="z-10 flex flex-col items-center gap-8 px-4">
          
        {/* Badge */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors border-transparent bg-primary/10 text-primary hover:bg-primary/20 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            v1.0 Public Beta
            </div>
        </div>

        {/* Titre */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-forwards ease-out">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            {t('heroTitle')}
            </span>
        </h1>

        {/* Sous-titre */}
        <p className="text-xl text-muted-foreground max-w-[600px] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-forwards ease-out bg-background/40 backdrop-blur-sm p-2 rounded-xl">
            {t('heroSubtitle')}
        </p>

        {/* Boutons */}
        <div className="flex flex-wrap gap-4 justify-center mt-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-forwards ease-out">
            <Button size="lg" className="h-12 px-8 text-base gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-1 transition-all duration-300" asChild>
            <Link href="/auth/register">
                {t('ctaStart')} <ArrowRight className="h-4 w-4" />
            </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2 bg-background/50 backdrop-blur hover:bg-background/80 hover:-translate-y-1 transition-all duration-300">
            <Terminal className="h-4 w-4" />
            {t('ctaDemo')}
            </Button>
        </div>

      </div>
    </section>
  );
}