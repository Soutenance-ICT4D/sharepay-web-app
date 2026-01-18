"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [suggestLogin, setSuggestLogin] = useState(false);
  const [suggestGoogle, setSuggestGoogle] = useState(false);
  const [value, setValue] = useState("");

  const cooldownKey = `sharepay.verifyEmailOtpResendEndsAt:${email}`;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.sessionStorage.getItem(cooldownKey);
    const endsAt = raw ? Number(raw) : NaN;
    const remaining = Number.isFinite(endsAt) ? Math.ceil((endsAt - Date.now()) / 1000) : 0;

    if (remaining > 0) {
      setResendCooldown(remaining);
      return;
    }

    setResendCooldown(0);
  }, [cooldownKey]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = window.setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendCooldown]);

  const onVerify = async () => {
    if (!email) {
      toast.error("Email manquant dans l'URL");
      return;
    }

    if (value.length < 6) return;

    setIsLoading(true);
    try {
      setSuggestLogin(false);
      setSuggestGoogle(false);

      const res = await authService.verifyEmail({
        email,
        otpCode: value,
      });

      toast.success(res.message || "Email vérifié");
      router.push("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de vérification";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onResend = async () => {
    if (!email) {
      toast.error("Email manquant dans l'URL");
      return;
    }
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setSuggestLogin(false);
    setSuggestGoogle(false);

    try {
      if (typeof window === "undefined") {
        throw new Error("Action non disponible");
      }

      const raw = window.sessionStorage.getItem("sharepay.pendingRegister");
      if (!raw) {
        throw new Error("Informations d'inscription introuvables. Recommencez l'inscription.");
      }

      const parsed = JSON.parse(raw) as {
        fullName: string;
        email: string;
        password: string;
        phone?: string;
      };

      const res = await authService.resendVerifyEmailOtp(parsed);
      toast.success(res.message || `Un code a été envoyé à ${email}`);

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(cooldownKey, String(Date.now() + 60_000));
      }
      setResendCooldown(60);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur";
      toast.error(message);

      const lower = message.toLowerCase();
      if (lower.includes("email already") || lower.includes("already used")) {
        setSuggestLogin(true);
      }
      if (lower.includes("social") || lower.includes("google")) {
        setSuggestGoogle(true);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <header className="absolute inset-x-0 top-0">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 pt-4">
          <Link
            href="/auth/register"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-base text-primary hover:opacity-80 transition-opacity"
          >
            <div className="relative h-6 w-6">
              <Image
                src="/images/logo_sharepay_bg_remove_svg.svg"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            SharePay
          </Link>
        </div>
      </header>

      <div className="container min-h-screen flex items-center justify-center px-4 pt-20 pb-8">
        <div className="w-full max-w-md space-y-6">
          <div className="grid gap-6">
            <OtpVerificationForm
              email={email}
              title="Vérifier votre email"
              subtitle={
                <>
                  Entrez le code OTP reçu par email.
                  {email ? (
                    <>
                      {" "}
                      <span className="font-medium text-foreground">{email}</span>
                    </>
                  ) : null}
                </>
              }
              otp={value}
              onOtpChange={setValue}
              onSubmit={onVerify}
              submitLabel="Vérifier"
              isSubmitting={isLoading}
              onResend={onResend}
              isResending={isResending}
              resendCooldown={resendCooldown}
              resendLabel="Renvoyer le code"
              suggestions={
                <>
                  {suggestLogin ? (
                    <div className="text-sm text-muted-foreground">
                      <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Se connecter
                      </Link>
                    </div>
                  ) : null}

                  {suggestGoogle ? (
                    <div className="text-sm text-muted-foreground">
                      <Link href="/auth/login" className="text-primary hover:underline font-medium">
                        Continuer avec Google
                      </Link>
                    </div>
                  ) : null}
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
