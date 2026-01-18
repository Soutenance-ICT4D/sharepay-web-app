"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/authService";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";

const verifySchema = z.object({
  otpCode: z.string().min(6, "OTP requis (6 chiffres)"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyResetCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const cooldownKey = `sharepay.resetOtpResendEndsAt:${email}`;

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [suggestLogin, setSuggestLogin] = useState(false);
  const [suggestGoogle, setSuggestGoogle] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = window.setInterval(() => {
      setResendCooldown((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendCooldown]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  const otpCode = watch("otpCode") ?? "";

  const onSubmit = async (data: VerifyFormValues) => {
    if (!email) {
      toast.error("Email manquant dans l'URL");
      return;
    }

    setSuggestLogin(false);
    setSuggestGoogle(false);

    setIsLoading(true);
    try {
      const verifyRes = await authService.verifyResetOtp({
        email,
        otpCode: data.otpCode,
      });

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "sharepay.resetPassword",
          JSON.stringify({ email, resetToken: verifyRes.data.resetToken })
        );
      }

      toast.success(verifyRes.message || "Code vérifié");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.sessionStorage.getItem(cooldownKey);
    const endsAt = raw ? Number(raw) : NaN;
    const remaining = Number.isFinite(endsAt) ? Math.ceil((endsAt - Date.now()) / 1000) : 0;

    if (remaining > 0) {
      setResendCooldown(remaining);
      return;
    }

    const nextEndsAt = Date.now() + 60_000;
    window.sessionStorage.setItem(cooldownKey, String(nextEndsAt));
    setResendCooldown(60);
  }, [cooldownKey]);

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
      const res = await authService.resendResetPasswordOtp({ email });
      toast.success(res.message || `Un code a été envoyé à ${email}`);

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(cooldownKey, String(Date.now() + 60_000));
      }
      setResendCooldown(60);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur";
      toast.error(message);

      const lower = message.toLowerCase();
      if (lower.includes("user not found")) {
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
            href="/auth/forgot-password"
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-5">
                <input {...register("otpCode")} className="hidden" tabIndex={-1} />

                <OtpVerificationForm
                  email={email}
                  title="Vérifier le code"
                  subtitle="Entrez le code OTP reçu par email."
                  otp={otpCode}
                  onOtpChange={(val) => setValue("otpCode", val, { shouldValidate: true })}
                  onSubmit={() => handleSubmit(onSubmit)()}
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

                      {errors.otpCode ? (
                        <p className="text-xs text-red-500">{errors.otpCode.message}</p>
                      ) : null}
                    </>
                  }
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
