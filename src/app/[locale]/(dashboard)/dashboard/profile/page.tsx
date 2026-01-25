"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { tokenStorage } from "@/lib/token-storage";

import { ProfileAccountCard } from "@/components/dashboard/profile/profile-account-card";
import { ProfilePageHeading } from "@/components/dashboard/profile/profile-page-heading";
import { ProfileSessionCard } from "@/components/dashboard/profile/profile-session-card";

export default function ProfilePage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      tokenStorage.clear();
      toast.success("Vous êtes déconnecté.");
      router.push("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la déconnexion";
      toast.error(message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-8">
      <ProfilePageHeading
        title="Mon Profil"
        subtitle="Gérez vos informations de compte et consultez l’état de votre session."
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProfileAccountCard />
          <ProfileSessionCard />
        </div>

        <aside className="space-y-8">
          <section className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/30">
              <h3 className="font-bold text-lg text-foreground">À propos</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground">
                Cette page affiche les informations disponibles côté navigateur. Pour enrichir le profil (adresse,
                téléphone, etc.), il faudra un endpoint backend &quot;me&quot;.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
