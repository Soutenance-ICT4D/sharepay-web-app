"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, Plus, Wallet } from "lucide-react";

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  // Données fictives pour la simulation
  const transactions = [
    { id: 1, name: "Netflix Subscription", date: "Aujourd'hui, 10:23", amount: -12.99, type: "expense", logo: "N" },
    { id: 2, name: "Freelance Payment", date: "Hier, 14:30", amount: +850.00, type: "income", logo: "F" },
    { id: 3, name: "Supermarché Casino", date: "23 Oct, 18:12", amount: -45.50, type: "expense", logo: "S" },
    { id: 4, name: "Virement Alice", date: "21 Oct, 09:00", amount: +25.00, type: "income", logo: "A" },
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. SECTION WELCOME */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {t('header.welcome', { name: 'John' })}
            </h1>
            <p className="text-muted-foreground mt-1">
                {t('header.subtitle')}
            </p>
        </div>
        <div className="flex gap-2">
            <Button className="shadow-lg shadow-primary/20 gap-2">
                <Plus className="h-4 w-4" /> {t('actions.add')}
            </Button>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Carte Solde Principal (Mise en avant) */}
        <div className="p-6 rounded-xl border bg-gradient-to-br from-primary/90 to-emerald-600 text-white shadow-lg lg:col-span-2 relative overflow-hidden group">
             {/* Effet visuel de fond */}
             <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
             
             <div className="relative z-10">
                <p className="text-primary-foreground/80 font-medium text-sm mb-1">{t('stats.totalBalance')}</p>
                <h2 className="text-4xl font-bold tracking-tight">24,500.00 FCFA</h2>
                <div className="mt-6 flex gap-3">
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                        <ArrowUpRight className="mr-2 h-4 w-4" /> {t('actions.send')}
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm">
                        <ArrowDownLeft className="mr-2 h-4 w-4" /> {t('actions.receive')}
                    </Button>
                </div>
             </div>
        </div>

        {/* Carte Revenus */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('stats.income')}</p>
                    <h3 className="text-2xl font-bold mt-2 text-primary">+ 1,250 €</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <ArrowDownLeft className="h-4 w-4" />
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">+12% depuis le mois dernier</p>
        </div>

        {/* Carte Dépenses */}
        <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('stats.expenses')}</p>
                    <h3 className="text-2xl font-bold mt-2 text-red-500">- 840 €</h3>
                </div>
                <div className="p-2 bg-red-500/10 rounded-full text-red-500">
                    <ArrowUpRight className="h-4 w-4" />
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">+5% depuis le mois dernier</p>
        </div>
      </div>

      {/* 3. RECENT TRANSACTIONS */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Colonne Large : Transactions */}
        <div className="md:col-span-2 rounded-xl border bg-card shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-semibold">{t('recent.title')}</h3>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    {t('recent.viewAll')}
                </Button>
            </div>
            <div className="p-0">
                {transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors border-b last:border-0">
                        <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                tx.type === 'income' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            }`}>
                                {tx.logo}
                            </div>
                            <div>
                                <p className="font-medium text-sm">{tx.name}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                        </div>
                        <div className={`font-semibold text-sm ${
                            tx.type === 'income' ? 'text-green-600' : 'text-foreground'
                        }`}>
                            {tx.amount > 0 ? "+" : ""} {tx.amount} €
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Colonne Droite : Quick Transfer / Pub / Autre */}
        <div className="rounded-xl border bg-muted/30 shadow-sm p-6 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-2">
            <div className="h-12 w-12 rounded-full bg-background border flex items-center justify-center shadow-sm">
                <Wallet className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
                <h3 className="font-semibold">Carte Virtuelle</h3>
                <p className="text-sm text-muted-foreground mt-1 px-4">Créez une carte pour vos achats en ligne sécurisés.</p>
            </div>
            <Button variant="outline" className="w-full">Créer une carte</Button>
        </div>
      </div>
    </div>
  );
}