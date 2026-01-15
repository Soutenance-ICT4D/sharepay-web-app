"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ChevronDown, 
  CreditCard, 
  ArrowRightLeft, 
  Code, 
  Activity,
  LayoutDashboard,
  ShieldCheck
} from "lucide-react";

export function SiteHeader() {
  const t = useTranslations('Navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Configuration des menus avec Descriptions
  const menuItems = [
    {
      label: t('features'),
      children: [
        { 
            label: t('menu_payments'), 
            description: t('desc_payments'),
            href: '/features/payments', 
            icon: CreditCard 
        },
        { 
            label: t('menu_transfers'), 
            description: t('desc_transfers'), 
            href: '/features/transfers', 
            icon: ArrowRightLeft 
        },
        { 
            label: "Dashboard", 
            description: t('desc_dashboard'), 
            href: '/dashboard', 
            icon: LayoutDashboard 
        },
      ]
    },
    {
      label: t('developers'),
      children: [
        { 
            label: t('menu_api'), 
            description: t('desc_api'), 
            href: '/docs', 
            icon: Code 
        },
        { 
            label: t('menu_status'), 
            description: t('desc_status'), 
            href: '/status', 
            icon: Activity 
        },
        { 
            label: "Sécurité", 
            description: t('desc_security'), 
            href: '/security', 
            icon: ShieldCheck 
        },
      ]
    },
    { label: t('pricing'), href: '/pricing' },
    { label: t('company'), href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* --- 1. LOGO & NOM --- */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="relative h-10 w-10">
                <Image 
                    src="/images/logo_sharepay_bg_remove_svg.svg" 
                    alt="SharePay Logo" 
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            <span className="font-bold text-xl text-primary">SharePay</span>
        </Link>

        {/* --- 2. NAVIGATION DESKTOP --- */}
        <nav className="hidden lg:flex items-center gap-8">
          {menuItems.map((item, index) => (
            <div key={index} className="relative group h-full flex items-center">
              {item.children ? (
                <>
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 focus:outline-none">
                    {item.label}
                    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  
                  {/* --- DROPDOWN AMÉLIORÉ --- */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0">
                    {/* Largeur augmentée (w-[360px]) pour accommoder les descriptions */}
                    <div className="w-[360px] rounded-xl border bg-card p-2 shadow-xl ring-1 ring-border z-50">
                      <div className="grid gap-1">
                        {item.children.map((child, idx) => (
                          <Link 
                            key={idx} 
                            href={child.href}
                            className="flex items-start gap-4 rounded-lg p-3 hover:bg-muted/80 transition-colors group/item"
                          >
                            {/* Icône avec fond coloré */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover/item:bg-primary group-hover/item:text-primary-foreground transition-colors duration-300">
                                {child.icon && <child.icon className="h-5 w-5" />}
                            </div>
                            
                            {/* Texte et Description */}
                            <div className="flex flex-col gap-1">
                              <div className="text-sm font-semibold text-foreground group-hover/item:text-primary transition-colors">
                                {child.label}
                              </div>
                              {child.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {child.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Link 
                  href={item.href || '#'} 
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* --- 3. ACTIONS --- */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-0 border rounded-full pl-1 pr-3 py-1 bg-background shadow-sm hover:border-primary/50 transition-colors">
            <ThemeToggle />
            <div className="h-4 w-px bg-border mx-1" />
            <LanguageSwitcher />
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" className="font-medium" asChild>
                <Link href="/auth/login">{t('login')}</Link>
            </Button>
            <Button asChild className="font-bold shadow-md hover:shadow-lg transition-all">
                <Link href="/auth/register">{t('register')}</Link>
            </Button>
          </div>
        </div>

        {/* --- 4. MOBILE HAMBURGER --- */}
        <button 
          className="lg:hidden p-2 text-muted-foreground hover:text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* --- MENU MOBILE --- */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-background px-4 py-6 shadow-lg animate-fadeIn h-[calc(100vh-80px)] overflow-y-auto">
          <nav className="flex flex-col gap-6">
            {menuItems.map((item, index) => (
              <div key={index} className="flex flex-col gap-3">
                {item.children ? (
                  <>
                    <div className="font-bold text-lg text-primary px-2">{item.label}</div>
                    <div className="grid grid-cols-1 gap-2 pl-2">
                      {item.children.map((child, idx) => (
                        <Link 
                          key={idx} 
                          href={child.href}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted active:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                           <div className="p-2 bg-primary/10 rounded-md text-primary mt-0.5">
                             {child.icon && <child.icon className="h-4 w-4" />}
                           </div>
                           <div className="flex flex-col">
                             <span className="text-foreground font-medium text-base">{child.label}</span>
                             {child.description && (
                                <span className="text-xs text-muted-foreground mt-0.5">{child.description}</span>
                             )}
                           </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link 
                    href={item.href || '#'}
                    className="block font-bold text-lg text-foreground hover:text-primary px-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="h-px bg-border w-full my-2" />

            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border">
                <span className="text-sm font-semibold">Réglages</span>
                <div className="flex items-center bg-background rounded-full border px-2 py-1">
                  <ThemeToggle />
                  <div className="h-4 w-px bg-border mx-1" />
                  <LanguageSwitcher />
                </div>
            </div>

            <div className="flex flex-col gap-3 pb-8">
                <Button variant="outline" className="w-full h-12 text-base" asChild>
                    <Link href="/auth/login">{t('login')}</Link>
                </Button>
                <Button className="w-full h-12 text-base shadow-lg" asChild>
                    <Link href="/auth/register">{t('register')}</Link>
                </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}