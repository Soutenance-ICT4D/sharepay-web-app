"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/routing"; // useRouter pour la redirection
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Loader2 pour le spinner
import { toast } from "sonner"; // Pour les notifications
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/authService";
import RegisterBranding from "@/components/auth/RegisterBranding";

// --- 1. DÉFINITION DU SCHÉMA DE VALIDATION (Contrat avec le backend Spring Boot) ---
const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(5, "Numéro de téléphone invalide").optional(),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const t = useTranslations('Auth');
  const router = useRouter();

  // États visuels
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // État de chargement simulation
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // --- 2. CONFIGURATION DU FORMULAIRE ---
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  // Pour le PhoneInput qui est un composant contrôlé spécial
  const phoneNumber = watch("phone");

  // --- 3. SIMULATION DE L'INSCRIPTION (Backend Spring Boot) ---
  // --- 3. SIMULATION DE L'INSCRIPTION (Backend Spring Boot) ---
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const res = await authService.register({
        fullName: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        role: "MERCHANT", // Rôle par défaut pour ce formulaire
      });

      // Mode Bypass : Si vérifié, on redirige vers le login
      if (res.data?.verified) {
        toast.success("Inscription réussie. Vous pouvez vous connecter.");
        router.push("/auth/login");
      } else {
        // Fallback si jamais le bypass est désactivé un jour
        toast.success("Compte créé. Veuillez vérifier vos emails.");
        router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
      }
    } catch (err: any) {
      let message = "Erreur d'inscription";
      if (err.name === "ApiError") {
        message = err.message || message;
        if (err.code === "VALIDATION_ERROR") {
          message = "Données invalides. Veuillez vérifier les champs.";
        }
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 4. SIMULATION GOOGLE ---
  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGoogleLoading(false);
    toast.error("Google Login non configuré");
  };

  // Style commun
  const inputStyle = "h-12 text-base transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-primary/5";

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8 relative flex h-full items-center">
        <div className="absolute left-4 top-4 md:left-8 md:top-8 z-20 hidden md:block">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg text-primary hover:opacity-80 transition-opacity"
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

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
          <div className="flex justify-center md:hidden">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg text-primary hover:opacity-80 transition-opacity"
            >
              <div className="relative h-7 w-7">
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

          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{t("registerTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("registerSubtitle")}</p>
          </div>

          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-5">

                {/* NOM */}
                <div className="grid gap-2 text-left">
                  <Label htmlFor="name" className="text-base font-medium">{t('nameLabel')}</Label>
                  <Input
                    {...register("name")}
                    id="name"
                    placeholder={t('namePlaceholder')}
                    className={inputStyle}
                  />
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                {/* EMAIL */}
                <div className="grid gap-2 text-left">
                  <Label htmlFor="email" className="text-base font-medium">{t('emailLabel')}</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    placeholder={t('emailPlaceholder')}
                    type="email"
                    className={inputStyle}
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                {/* TÉLÉPHONE */}
                <div className="grid gap-2 text-left">
                  <Label htmlFor="phone" className="text-base font-medium">{t('phoneLabel')}</Label>
                  <PhoneInput
                    id="phone"
                    value={phoneNumber}
                    onChange={(val) => setValue("phone", val || "")}
                    placeholder={t('phonePlaceholder')}
                  />
                  {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
                </div>

                {/* PASSWORD */}
                <div className="grid gap-2 text-left">
                  <Label htmlFor="password" className="text-base font-medium">{t('passwordLabel')}</Label>
                  <div className="relative">
                    <Input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className={`${inputStyle} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="grid gap-2 text-left">
                  <Label htmlFor="confirmPassword" className="text-base font-medium">{t('confirmPasswordLabel')}</Label>
                  <div className="relative">
                    <Input
                      {...register("confirmPassword")}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`${inputStyle} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                </div>

                {/* BOUTON SUBMIT */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 text-base font-bold mt-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    t('registerButton')
                  )}
                </Button>
              </div>
            </form>

            {/* SEPARATEUR */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">
                  {t('orContinue')}
                </span>
              </div>
            </div>

            {/* GOOGLE BUTTON */}
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={handleGoogleRegister}
                disabled={isGoogleLoading}
                className="w-full h-12 gap-3 text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                {isGoogleLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Google
              </Button>
            </div>

            {/* LIENS */}
            <p className="px-8 text-center text-sm text-muted-foreground">
              {t('hasAccount')}{" "}
              <Link
                href="/auth/login"
                className="font-bold text-primary hover:underline underline-offset-4 transition-colors"
              >
                {t('cta_login')}
              </Link>
            </p>

            <p className="px-8 text-center text-xs text-muted-foreground">
              {t('termsText')}{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                {t('termsLink')}
              </Link>{" "}
              et{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                {t('privacyLink')}
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <RegisterBranding />
    </div>
  );
}