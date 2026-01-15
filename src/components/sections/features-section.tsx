import { useTranslations } from "next-intl";
import { CreditCard, ArrowRightLeft, ShieldCheck, Wallet } from "lucide-react";

export function FeaturesSection() {
  const t = useTranslations('Landing');

  const features = [
    {
      icon: Wallet,
      title: t('feat1Title'),
      description: t('feat1Desc'),
    },
    {
      icon: ArrowRightLeft,
      title: t('feat2Title'),
      description: t('feat2Desc'),
    },
    {
      icon: CreditCard,
      title: t('feat3Title'),
      description: t('feat3Desc'),
    },
    {
      icon: ShieldCheck,
      title: t('feat4Title'),
      description: t('feat4Desc'),
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        
        {/* En-tête de section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            {t('featureTitle')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('featureSubtitle')}
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}