"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/authService";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";

const resetSchema = z
  .object({
    otpCode: z.string().min(6, "OTP requis (6 chiffres)"),
  });

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
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
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const otpCode = watch("otpCode") ?? "";

  const onSubmit = async (data: ResetFormValues) => {
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

      toast.success(verifyRes.message || "OTP vérifié");
      router.push(`/auth/reset-password/update?email=${encodeURIComponent(email)}`);
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
    <>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5">
            <div className="grid gap-2 text-left">
              <Label className="text-base font-medium">Email</Label>
              <Input value={email} readOnly className="h-12 text-base" />
            </div>

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

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/auth/login"
            className="inline-flex items-center hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la connexion
          </Link>
        </p>
      </div>
    </>
  );
}
