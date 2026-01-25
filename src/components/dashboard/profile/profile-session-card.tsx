"use client";

import { useMemo } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";

import { tokenStorage } from "@/lib/token-storage";

import { decodeJwt, formatEpochSeconds } from "./profile-utils";

export function ProfileSessionCard() {
  const session = useMemo(() => {
    const tokens = tokenStorage.get();
    const persistMode = tokenStorage.getPersistMode();
    const claims = tokens?.accessToken ? decodeJwt(tokens.accessToken) : null;

    const exp = typeof claims?.exp === "number" ? claims.exp : undefined;
    const iat = typeof claims?.iat === "number" ? claims.iat : undefined;

    return {
      hasAccessToken: Boolean(tokens?.accessToken),
      persistMode,
      issuedAt: formatEpochSeconds(iat),
      expiresAt: formatEpochSeconds(exp),
    };
  }, []);

  return (
    <section className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-bold text-lg text-foreground">Session & sécurité</h3>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <KeyRound className="h-4 w-4" />
              Token d’accès
            </div>
            <div className="mt-2 font-bold text-foreground">
              {session.hasAccessToken ? "Présent" : "Absent"}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Persistance: {session.persistMode === "local" ? "LocalStorage" : "SessionStorage"}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Validité</div>
            <div className="mt-2 text-sm text-foreground">
              <div>
                <span className="font-bold">Émis:</span> {session.issuedAt ?? "—"}
              </div>
              <div>
                <span className="font-bold">Expire:</span> {session.expiresAt ?? "—"}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          Les informations affichées proviennent des tokens stockés côté navigateur.
        </p>
      </div>
    </section>
  );
}
