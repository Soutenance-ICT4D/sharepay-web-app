import { ThemeToggle } from "@/components/shared/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button"; // Notre nouveau bouton
import { Github, Mail, ArrowRight } from "lucide-react"; // Des icônes

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-24 transition-colors duration-500 bg-background">
      
      {/* En-tête */}
      <div className="text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-primary">
          {t('title')}
        </h1>
        <p className="text-xl text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      
      {/* Démo des Boutons (Design System) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        
        <div className="flex flex-col gap-4 p-6 border rounded-xl bg-card">
            <h3 className="text-sm font-medium text-muted-foreground uppercase">Actions Principales</h3>
            <div className="flex flex-wrap gap-2">
                <Button className="w-full">
                    Commencer
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="secondary" className="w-full">
                    En savoir plus
                </Button>
            </div>
        </div>

        <div className="flex flex-col gap-4 p-6 border rounded-xl bg-card">
            <h3 className="text-sm font-medium text-muted-foreground uppercase">Variantes</h3>
            <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" size="icon">
                    <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                    <Mail className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm">
                    Supprimer
                </Button>
            </div>
        </div>

      </div>

      {/* Barre de configuration (Langue / Thème) */}
      <div className="fixed bottom-8 p-2 border rounded-full bg-background/80 backdrop-blur shadow-lg flex items-center gap-4 px-6">
        <ThemeToggle />
        <div className="h-4 w-px bg-border" />
        <LanguageSwitcher />
      </div>

    </main>
  );
}