"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
    getValues,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true);
    // Simulation API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast.success(t('otpSent'), {
        description: `Un code a été envoyé à ${data.email}`
    });

    // Redirection vers la page OTP en passant l'email en paramètre (optionnel)
    router.push(`/auth/otp?email=${encodeURIComponent(data.email)}`);
  };

  return (
    <>
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

        {/* RETOUR LOGIN */}
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