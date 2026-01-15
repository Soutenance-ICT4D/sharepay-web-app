import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  const t = useTranslations('Landing');

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Petit effet de fond (cercle flou) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-bold max-w-2xl mx-auto">
          {t('ctaFinalTitle')}
        </h2>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          {t('ctaFinalSubtitle')}
        </p>
        <div className="flex justify-center">
          <Button size="lg" className="h-12 px-8 text-lg gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all" asChild>
            <Link href="/auth/register">
              {t('ctaFinalButton')} <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}