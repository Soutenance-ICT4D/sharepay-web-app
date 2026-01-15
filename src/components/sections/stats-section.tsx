import { useTranslations } from "next-intl";

export function StatsSection() {
  const t = useTranslations('Landing');

  const stats = [
    { label: t('stat1Label'), value: t('stat1Value') },
    { label: t('stat2Label'), value: t('stat2Value') },
    { label: t('stat3Label'), value: t('stat3Value') },
  ];

  return (
    <section className="py-24 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-primary/20">
          {stats.map((stat, index) => (
            <div key={index} className="p-4">
              <div className="text-4xl md:text-6xl font-extrabold text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-primary-foreground/80 font-medium uppercase tracking-wide text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}