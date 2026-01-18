"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      router.push("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la déconnexion";
      toast.error(message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <p className="text-muted-foreground">Page en cours d’implémentation.</p>
      <div className="pt-4">
        <Button
          type="button"
          variant="destructive"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
        </Button>
      </div>
    </div>
  );
}
