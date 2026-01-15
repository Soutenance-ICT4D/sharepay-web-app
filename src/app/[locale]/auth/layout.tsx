import { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { HeroAnimation } from "@/components/ui/hero-animation"; 

export default function AuthLayout({ children }: { children: ReactNode }) {
  const t = useTranslations('Auth');

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      
      {/* --- BLOC 1 : FORMULAIRE --- */}
      <div className="lg:p-8 relative flex h-full items-center">
        {/* Bouton retour accueil */}
        <div className="absolute left-4 top-4 md:left-8 md:top-8 z-20">
            <Link 
                href="/" 
                className="flex items-center gap-2 font-bold text-lg text-primary hover:opacity-80 transition-opacity"
            >
                <div className="relative h-6 w-6">
                    <Image 
                        src="/images/logo_sharepay_bg_remove_svg.svg" 
                        alt="Logo" 
                        fill 
                        className="object-contain"
                    />
                </div>
                SharePay
            </Link>
        </div>

        {/* MODIFICATION ICI : 
           - Avant : sm:w-[350px]
           - Après : sm:w-[450px] (Élargit le conteneur du formulaire)
        */}
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          {children}
        </div>
      </div>

      {/* --- BLOC 2 : BRANDING --- */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-l lg:flex">
        <div className="absolute inset-0 bg-primary/90">
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
            <p className="text-lg">
              &ldquo;{t('quote')}&rdquo;
            </p>
            <footer className="text-sm opacity-80">
                {t('quoteAuthor')} <span className="opacity-50">|</span> {t('quoteRole')}
            </footer>
          </blockquote>
        </div>
      </div>

    </div>
  );
}