"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/authService";

const updateSchema = z
  .object({
    newPassword: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type UpdateFormValues = z.infer<typeof updateSchema>;

export default function ResetPasswordUpdatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState(emailParam);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem("sharepay.resetPassword");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as { email?: string; resetToken?: string };
      if (parsed.email) setEmail(parsed.email);
      if (parsed.resetToken) setResetToken(parsed.resetToken);
    } catch {
      // ignore
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
  });

  const onSubmit = async (data: UpdateFormValues) => {
    if (!email) {
      toast.error("Email manquant");
      return;
    }
    if (!resetToken) {
      toast.error("Jeton de réinitialisation manquant. Veuillez vérifier le code à nouveau.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.resetPassword({
        email,
        resetToken,
        newPassword: data.newPassword,
      });

      toast.success(res.message || "Mot de passe mis à jour");

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("sharepay.resetPassword");
      }

      router.push("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur";
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
            href={`/auth/verify-reset-code?email=${encodeURIComponent(emailParam || email)}`}
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
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Nouveau mot de passe</h1>
            <p className="text-sm text-muted-foreground">
              Choisissez un nouveau mot de passe pour <span className="font-medium text-foreground">{email || "votre compte"}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-5">
              <div className="grid gap-2 text-left">
                <Label htmlFor="newPassword" className="text-base font-medium">Mot de passe</Label>
                <div className="relative">
                  <Input
                    {...register("newPassword")}
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    className="h-12 pr-10 text-base transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-primary/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.newPassword && <p className="text-xs text-red-500">{errors.newPassword.message}</p>}
              </div>

              <div className="grid gap-2 text-left">
                <Label htmlFor="confirmPassword" className="text-base font-medium">Confirmer</Label>
                <div className="relative">
                  <Input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className="h-12 pr-10 text-base transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-primary/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-bold mt-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
