"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import { tokenStorage } from "@/lib/token-storage";
import { LoaderPage } from "@/components/shared/loader-page";

export function PublicAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tokens = tokenStorage.getPersistent();
    if (tokens?.accessToken) {
      router.push("/dashboard");
      return;
    }

    if (loaderRef.current) loaderRef.current.style.display = "none";
    if (contentRef.current) contentRef.current.style.display = "block";
  }, [router]);

  return (
    <>
      <div ref={loaderRef}>
        <LoaderPage />
      </div>

      <div ref={contentRef} style={{ display: "none" }}>
        {children}
      </div>
    </>
  );
}
