"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation"; // Attention : useSearchParams de next/navigation
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import { authService } from "@/services/authService";

export default function OtpPage() {
  const t = useTranslations('Auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Récupère l'email depuis l'URL (si disponible) pour l'afficher
  const email = searchParams.get("email") || "votre email";

  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const onVerify = async () => {
    if (value.length < 6) return; // Ne rien faire si incomplet

    setIsLoading(true);
    try {
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

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {t('otpTitle')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('otpSubtitle')} <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="grid gap-6 mt-4">
        <div className="flex flex-col items-center justify-center space-y-4">
            
            {/* COMPOSANT OTP */}
            <InputOTP
                maxLength={6}
                value={value}
                onChange={(val) => setValue(val)}
            >
                <InputOTPGroup className="gap-2">
                    {/* On sépare les slots pour le style */}
                    <InputOTPSlot index={0} className="h-12 w-12 text-lg border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary" />
                    <InputOTPSlot index={1} className="h-12 w-12 text-lg border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary" />
                    <InputOTPSlot index={2} className="h-12 w-12 text-lg border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary" />
                    <InputOTPSlot index={3} className="h-12 w-12 text-lg border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary" />
                    <InputOTPSlot index={4} className="h-12 w-12 text-lg border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary" />
                    <InputOTPSlot index={5} className="h-12 w-12 text-lg border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-primary focus-within:border-primary" />
                </InputOTPGroup>
            </InputOTP>

            <div className="text-sm text-muted-foreground">
                Vous n&apos;avez pas reçu le code ?{" "}
                <button className="text-primary hover:underline font-medium">
                    {t('resendCode')}
                </button>
            </div>

            {/* BOUTON VERIFY */}
            <Button 
                onClick={onVerify}
                disabled={isLoading || value.length < 6}
                className="w-full h-12 text-base font-bold mt-4 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
            >
              {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Vérification...
                  </>
              ) : t('verifyButton')}
            </Button>
        </div>

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