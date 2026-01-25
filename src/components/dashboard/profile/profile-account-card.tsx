"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Camera, Mail, MapPin, Phone, User, Wallet } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { tokenStorage } from "@/lib/token-storage";

import { decodeJwt } from "./profile-utils";

function initials(value: string) {
  const parts = value.trim().split(/\s+/g).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

type LocalProfilePrefs = {
  phone?: string;
  country?: string;
  currency?: string;
  photoDataUrl?: string;
};

const PROFILE_PREFS_KEY = "sharepay.profilePrefs";

function readPrefs(): LocalProfilePrefs {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(PROFILE_PREFS_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as LocalProfilePrefs;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writePrefs(next: LocalProfilePrefs) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_PREFS_KEY, JSON.stringify(next));
}

export function ProfileAccountCard() {
  const { userName, userEmail, userId, isAuthenticated } = useMemo(() => {
    const tokens = tokenStorage.get();
    const claims = tokens?.accessToken ? decodeJwt(tokens.accessToken) : null;

    const email = (claims?.email as string | undefined) ?? undefined;
    const name = (claims?.name as string | undefined) ?? undefined;
    const id = (claims?.sub as string | undefined) ?? undefined;

    return {
      userName: name,
      userEmail: email,
      userId: id,
      isAuthenticated: Boolean(tokens?.accessToken),
    };
  }, []);

  const displayName = userName || (userEmail ? userEmail.split("@")[0] : "Utilisateur");
  const avatarText = initials(displayName);

  const [prefs, setPrefs] = useState<LocalProfilePrefs>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPrefs(readPrefs());
  }, []);

  const handlePhotoChange = async (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const photoDataUrl = typeof reader.result === "string" ? reader.result : undefined;
      setPrefs((current) => ({ ...current, photoDataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      writePrefs(prefs);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg text-foreground">Profil</h3>
        </div>
        <span className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <BadgeCheck className={isAuthenticated ? "h-4 w-4 text-emerald-600" : "h-4 w-4 text-muted-foreground"} />
          {isAuthenticated ? "Connecté" : "Non connecté"}
        </span>
      </div>

      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 lg:min-w-[340px]">
            <Avatar className="h-20 w-20 border border-border">
              <AvatarImage src={prefs.photoDataUrl} alt={displayName} />
              <AvatarFallback className="font-bold text-lg">{avatarText || "SP"}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Nom complet</div>
              <div className="mt-1 text-xl font-extrabold text-foreground truncate">{displayName}</div>
              <div className="mt-1 text-sm text-muted-foreground truncate">{userEmail ?? "Non renseigné"}</div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <div className="grid gap-1 flex-1">
                  <Label htmlFor="profile-photo" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Photo de profil
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="profile-photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e.target.files?.[0])}
                      className="h-10"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 px-3"
                      onClick={() => setPrefs((current) => ({ ...current, photoDataUrl: undefined }))}
                      disabled={!prefs.photoDataUrl}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <Phone className="h-4 w-4" />
                  Téléphone
                </div>
                <div className="mt-3">
                  <PhoneInput value={prefs.phone} onChange={(value) => setPrefs((c) => ({ ...c, phone: value }))} />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <MapPin className="h-4 w-4" />
                  Pays
                </div>
                <div className="mt-3">
                  <select
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={prefs.country ?? ""}
                    onChange={(e) => setPrefs((c) => ({ ...c, country: e.target.value || undefined }))}
                  >
                    <option value="">Sélectionner…</option>
                    <option value="CM">Cameroun</option>
                    <option value="CI">Côte d’Ivoire</option>
                    <option value="SN">Sénégal</option>
                    <option value="FR">France</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <Wallet className="h-4 w-4" />
                  Devise
                </div>
                <div className="mt-3">
                  <select
                    className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={prefs.currency ?? "XAF"}
                    onChange={(e) => setPrefs((c) => ({ ...c, currency: e.target.value || undefined }))}
                  >
                    <option value="XAF">XAF</option>
                    <option value="XOF">XOF</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/20 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <Mail className="h-4 w-4" />
                  Identifiant
                </div>
                <div className="mt-3 font-mono text-sm text-foreground/80 truncate">{userId ?? "—"}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button type="button" className="font-bold" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="font-bold"
                onClick={() => setPrefs(readPrefs())}
                disabled={isSaving}
              >
                Annuler
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
