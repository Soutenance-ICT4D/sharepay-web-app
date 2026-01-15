import { useTranslations } from "next-intl";
import Image from "next/image";

export function LogosSection() {
  const t = useTranslations('Landing');

  // Liste des partenaires avec leurs chemins d'accès
  // Vérifie bien les extensions (.svg, .png, .jpg) de tes fichiers !
  const partners = [
    { name: "Orange Money", src: "/images/partners/orange.png" },
    { name: "MTN Mobile Money", src: "/images/partners/mtn.png" },
    { name: "Visa", src: "/images/partners/visa.svg" },
    { name: "MasterCard", src: "/images/partners/mastercard.png" },
    { name: "Ecobank", src: "/images/partners/ecobank.png" },
    { name: "UBA", src: "/images/partners/uba.png" },
  ];

  return (
    <section className="py-12 border-b bg-muted/20">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-semibold text-muted-foreground mb-8 uppercase tracking-wider">
          {t('trustedBy')}
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className="relative h-12 w-32 transition-all duration-300 opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
            >
              {/* Utilisation de next/image pour l'optimisation */}
              <Image 
                src={partner.src} 
                alt={`${partner.name} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}