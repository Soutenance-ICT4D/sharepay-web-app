import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css"; // On remonte d'un cran vers src/app/globals.css
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SharePay",
  description: "Unified Payment Aggregator",
};

// Définition propre du type pour Next.js 15/16 (Params est une Promise)
type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params
}: Props) {
  // 1. On attend la résolution des paramètres (Crucial pour Next.js 16)
  const { locale } = await params;

  // 2. Vérification de sécurité : si la locale n'est pas dans notre liste -> 404
  // Le 'as any' permet de contourner temporairement le typage strict de 'includes'
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 3. Récupération des messages de traduction côté serveur
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}