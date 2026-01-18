"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // Attention : useSearchParams de next/navigation
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import { authService } from "@/services/authService";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";

export default function OtpPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupère l'email depuis l'URL (si disponible) pour l'afficher
  const email = searchParams.get("email") || "votre email";

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [suggestLogin, setSuggestLogin] = useState(false);
  const [suggestGoogle, setSuggestGoogle] = useState(false);
  const [value, setValue] = useState("");

  const cooldownKey = `sharepay.otpResendEndsAt:${email}`;

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
    if (value.length < 6) return; // Ne rien faire si incomplet

    setIsLoading(true);
    try {
      setSuggestLogin(false);
      setSuggestGoogle(false);
      const res = await authService.verifyEmail({
        email,
        otpCode: value,
      });

      toast.success(res.message || t('otpSuccess'));
      router.push("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur de vérification";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onResend = async () => {
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
    <>
      <div className="grid gap-6 mt-4">
        <OtpVerificationForm
          email={email}
          title={t('otpTitle')}
          subtitle={
            <>
              {t('otpSubtitle')} <span className="font-medium text-foreground">{email}</span>
            </>
          }
          otp={value}
          onOtpChange={setValue}
          onSubmit={onVerify}
          submitLabel={t('verifyButton')}
          isSubmitting={isLoading}
          onResend={onResend}
          isResending={isResending}
          resendCooldown={resendCooldown}
          resendLabel={t('resendCode')}
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

        {/* RETOUR */}
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToLogin')}
          </Link>
        </p>
      </div>
    </>
  );
}