"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authService } from "@/services/authService";

const schema = z
  .object({
    newPassword: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

type ResetSession = {
  email: string;
  resetToken: string;
};

export default function ResetPasswordUpdatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetSession = useMemo<ResetSession | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.sessionStorage.getItem("sharepay.resetPassword");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ResetSession;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!email) {
      toast.error("Email manquant dans l'URL");
      router.push("/auth/login");
      return;
    }

    if (!resetSession?.resetToken || resetSession.email !== email) {
      toast.error("Session expirée. Veuillez vérifier le code à nouveau.");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }
  }, [email, resetSession, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    if (!email) {
      toast.error("Email manquant dans l'URL");
      return;
    }

    if (!resetSession?.resetToken || resetSession.email !== email) {
      toast.error("Session expirée. Veuillez vérifier le code à nouveau.");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authService.resetPassword({
        email,
        resetToken: resetSession.resetToken,
        newPassword: data.newPassword,
      });

      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("sharepay.resetPassword");
      }

      toast.success(res.message || "Mot de passe mis à jour");
      router.push("/auth/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Nouveau mot de passe</h1>
        <p className="text-sm text-muted-foreground">Choisissez un nouveau mot de passe.</p>
      </div>

      <div className="grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5">
            <div className="grid gap-2 text-left">
              <Label className="text-base font-medium">Email</Label>
              <Input value={email} readOnly className="h-12 text-base" />
            </div>

            <div className="grid gap-2 text-left">
              <Label htmlFor="newPassword" className="text-base font-medium">
                Nouveau mot de passe
              </Label>
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
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="grid gap-2 text-left">
              <Label htmlFor="confirmPassword" className="text-base font-medium">
                Confirmer le mot de passe
              </Label>
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
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
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

        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href={`/auth/reset-password?email=${encodeURIComponent(email)}`}
            className="inline-flex items-center hover:text-primary transition-colors font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </p>
      </div>
    </>
  );
}
