"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    
    setTheme(newTheme);
    
    // Cookie pour éviter le flash blanc (SSR)
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      // AMÉLIORATIONS ICI :
      // 1. rounded-full : Bouton rond
      // 2. hover:bg-primary/10 : Fond vert très clair au survol
      // 3. hover:text-primary : L'icône devient verte au survol
      // 4. hover:scale-110 & active:scale-95 : Animation de "rebond"
      className="relative rounded-full transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95"
    >
      {/* SOLEIL (Visible en Light Mode) */}
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 hover:rotate-45" />
      
      {/* LUNE (Visible en Dark Mode) */}
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 dark:hover:-rotate-12" />
      
      <span className="sr-only">Changer le thème</span>
    </Button>
  );
}