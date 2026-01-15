import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Facebook, Twitter, Linkedin, Github, CheckCircle2 } from "lucide-react";

export function SiteFooter() {
  const t = useTranslations('Footer');

  // Liens des réseaux sociaux (Mets tes vrais liens ici plus tard)
  const socialLinks = [
    { icon: Twitter, href: "#" },
    { icon: Github, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Facebook, href: "#" },
  ];

  return (
    <footer className="border-t bg-muted/30 pt-16 pb-8">
      <div className="container mx-auto px-4">
        
        {/* --- PARTIE HAUTE : GRILLE DE LIENS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          
          {/* Colonne 1 : Branding (Prend 2 colonnes sur mobile, 1 sur PC) */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2">
                <div className="relative h-8 w-8">
                    <Image 
                        src="/images/logo_sharepay_bg_remove_svg.svg" 
                        alt="SharePay Logo" 
                        fill
                        className="object-contain"
                    />
                </div>
                <span className="font-bold text-xl text-primary">SharePay</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t('tagline')}
            </p>
            
            {/* Indicateur de Status (Crédibilité Fintech) */}
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-500/10 px-3 py-1.5 rounded-full w-fit dark:text-green-400 dark:bg-green-500/20">
              <CheckCircle2 className="h-4 w-4" />
              <span>{t('systemStatus')}</span>
            </div>
          </div>

          {/* Colonne 2 : Produit */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">{t('product')}</h3>
            <Link href="/#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('features')}</Link>
            <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('pricing')}</Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('api')}</Link>
            <Link href="/status" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('status')}</Link>
          </div>

          {/* Colonne 3 : Entreprise */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">{t('company')}</h3>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('about')}</Link>
            <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('blog')}</Link>
            <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('careers')}</Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('contact')}</Link>
          </div>

          {/* Colonne 4 : Légal */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-foreground">{t('legal')}</h3>
            <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('privacy')}</Link>
            <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('terms')}</Link>
            <Link href="/legal/security" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('security')}</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('cookies')}</Link>
          </div>
        </div>

        {/* --- SÉPARATEUR --- */}
        <div className="h-px w-full bg-border my-8" />

        {/* --- PARTIE BASSE : COPYRIGHT & SOCIALS --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            {t('copyright')}
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <a 
                key={index}
                href={social.href} 
                target="_blank" 
                rel="noreferrer"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10 p-2 rounded-full transition-all"
              >
                <social.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}