"use client";

import * as React from "react";
import PhoneInputFromLib from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Import des styles de base
import { cn } from "@/lib/utils";

interface PhoneInputProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  className?: string;
  placeholder?: string;
  id?: string;
}

export function PhoneInput({ value, onChange, className, id, placeholder }: PhoneInputProps) {
  return (
    <div className={cn(
      // --- CONTENEUR PRINCIPAL (Style Shadcn Input) ---
      "flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "focus-within:ring-2 focus-within:ring-primary focus-within:border-primary focus-within:bg-primary/5 transition-all duration-200",
      
      // --- CORRECTIF CSS POUR LA LIBRAIRIE ---
      // 1. On enlève la bordure par défaut de la lib
      "[&_.PhoneInputCountry]:mr-2",
      
      // 2. On s'assure que le sélecteur natif prenne bien les couleurs du thème
      "[&_.PhoneInputCountrySelect]:bg-transparent",
      "[&_.PhoneInputCountrySelect]:text-foreground",
      "[&_.PhoneInputCountrySelect]:cursor-pointer",
      
      // 3. IMPORTANT : Couleur des options du dropdown (Natif)
      // Cela force le menu déroulant à être sombre en mode dark et clair en mode light
      "[&_select]:dark:bg-popover", 
      "[&_select]:dark:text-popover-foreground",
      "[&_select]:bg-background", 
      "[&_select]:text-foreground",

      className
    )}>
      <PhoneInputFromLib
        international
        defaultCountry="CM"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        id={id}
        // Input text pour le numéro
        numberInputProps={{
          className: "flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground h-full text-base ml-1",
        }}
        // Sélecteur de pays (Drapeau)
        countrySelectProps={{
            className: cn(
                "bg-transparent text-foreground outline-none cursor-pointer",
                // On force aussi les classes ici pour être sûr
                "dark:bg-popover dark:text-popover-foreground"
            )
        }}
      />
    </div>
  );
}