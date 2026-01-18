"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { authService } from "@/services/authService";

// Schéma de validation
const forgotSchema = z.object({
  email: z.string().email("Email invalide"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.requestPasswordReset({ email: data.email });
      toast.success(res.message || t('otpSent'), {
        description: `Un code a été envoyé à ${data.email}`
      });

      router.push(`/auth/verify-reset-code?email=${encodeURIComponent(data.email)}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur d'envoi";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <header className="absolute inset-x-0 top-0">
        <div className="mx-auto flex w-full max-w-md items-center justify-between px-4 pt-4">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToLogin')}
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
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {t('forgotPasswordTitle')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t('forgotPasswordSubtitle')}
            </p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-5">
                
                {/* EMAIL */}
                <div className="grid gap-2 text-left">
                  <Label htmlFor="email" className="text-base font-medium">{t('emailLabel')}</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    placeholder={t('emailPlaceholder')}
                    type="email"
                    className="h-12 text-base transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-primary/5" 
                  />
                  {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                </div>

                {/* BOUTON */}
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-12 text-base font-bold mt-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                >
                  {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi...
                      </>
                  ) : t('sendResetLink')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}