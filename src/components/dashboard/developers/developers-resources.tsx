"use client";

import { ArrowRight, BookOpen, Code2 } from "lucide-react";

import { Link } from "@/i18n/routing";

export function DevelopersResources() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Link
        href="#"
        className="group relative flex flex-col p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-xl shadow-primary/10 overflow-hidden hover:-translate-y-1 transition-all duration-300"
      >
        <div className="relative z-10 flex flex-col h-full">
          <div className="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
            <BookOpen className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Documentation Guides</h3>
          <p className="text-primary-foreground/80 text-sm leading-relaxed mb-8 max-w-sm">
            Explorez nos guides d'intégration complets : du premier paiement à la gestion complexe des abonnements et des
            webhooks.
          </p>
          <div className="mt-auto flex items-center gap-3 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
            <span>Consulter les guides</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <span className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
          <BookOpen className="h-40 w-40" />
        </span>
      </Link>

      <Link
        href="#"
        className="group relative flex flex-col p-6 sm:p-8 rounded-2xl bg-card text-card-foreground border border-border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden"
      >
        <div className="relative z-10 flex flex-col h-full">
          <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
            <Code2 className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Référence API</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 max-w-sm">
            Accédez aux spécifications REST complètes. Endpoints, paramètres de requête et exemples de réponses JSON en
            temps réel.
          </p>
          <div className="mt-auto flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary group-hover:gap-4 transition-all">
            <span>Exploration Technique</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
        <span className="absolute -right-8 -bottom-8 text-muted opacity-20 -rotate-12">
          <Code2 className="h-40 w-40" />
        </span>
      </Link>
    </div>
  );
}
