"use client";

import { ArrowRight, BookOpen, Code2, Download, FileText, Mail, MessageSquare } from "lucide-react";

import { Link } from "@/i18n/routing";

export function DevelopersSidebar() {
  return (
    <div className="space-y-6">
      <div className="p-5 sm:p-6 rounded-xl bg-muted/40 border border-border space-y-6">
        <div>
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Bibliothèques SDK</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Node.js", href: "#" },
              { label: "Python", href: "#" },
              { label: "Ruby", href: "#" },
              { label: "PHP", href: "#" },
            ].map((sdk) => (
              <Link
                key={sdk.label}
                href={sdk.href}
                className="flex items-center gap-2 p-2 rounded bg-card hover:border-primary border border-transparent transition-all"
              >
                <div className="h-5 w-5 rounded bg-primary/10 text-primary flex items-center justify-center">
                  <Code2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold text-foreground">{sdk.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Besoin d'aide ?</h4>
          <ul className="space-y-4">
            <li>
              <Link
                href="#"
                className="flex items-center justify-between group text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4" />
                  <span>Communauté Slack</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center justify-between group text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <span>Support Technique</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="flex items-center justify-between group text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4" />
                  <span>Fichiers Postman</span>
                </div>
                <Download className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-700 dark:text-amber-400">
        <div className="flex items-start gap-3">
          <BookOpen className="h-5 w-5" />
          <div>
            <h5 className="text-sm font-bold mb-1">Mode Test Activé</h5>
            <p className="text-xs leading-relaxed opacity-80">
              Utilisez vos clés d'API Sandbox pour tester les flux de paiement sans transactions réelles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
