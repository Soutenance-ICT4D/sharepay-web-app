import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css"; // Assure-toi que c'est le bon chemin (ou @/app/globals.css)
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/provider/theme-provider"; // Vérifie ton chemin (provider ou providers ?)
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import NextTopLoader from 'nextjs-toploader';
import { cookies } from 'next/headers'; // <--- 1. IMPORT IMPORTANT
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "SharePay",
  description: "Unified Payment Aggregator",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params
}: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  // 2. LECTURE DU COOKIE CÔTÉ SERVEUR
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme");
  const theme = themeCookie?.value || "system";
  
  // Si le cookie dit "dark", on force la classe immédiatement
  const themeClass = theme === "dark" ? "dark" : "";

  return (
    // 3. INJECTION DE LA CLASSE (Plus de flash blanc !)
    <html lang={locale} className={themeClass} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          inter.variable
        )}
      >
        <NextTopLoader 
          color="#098865"
          showSpinner={false}
          shadow="0 0 10px #098865,0 0 5px #098865"
        />

        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}