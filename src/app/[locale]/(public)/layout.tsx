import { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { PublicAuthGate } from "@/components/shared/public-auth-gate";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PublicAuthGate>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        
        <main className="flex-1 container">
          {children}
        </main>

        <SiteFooter />
      </div>
    </PublicAuthGate>
  );
}