// src/components/auth/OtpVerificationForm.tsx

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

type Props = {
  email: string;
  title: string;
  subtitle?: ReactNode;
  otp: string;
  onOtpChange: (val: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  isSubmitting: boolean;
  onResend: () => void;
  isResending: boolean;
  resendCooldown: number;
  resendLabel: string;
  suggestions?: ReactNode;
};

export default function OtpVerificationForm({
  email,
  title,
  subtitle,
  otp,
  onOtpChange,
  onSubmit,
  submitLabel,
  isSubmitting,
  onResend,
  isResending,
  resendCooldown,
  resendLabel,
  suggestions,
}: Props) {
  return (
    <>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>

        <p className="text-sm text-muted-foreground">
          {subtitle ?? (
            <>
              Code envoyé à <span className="font-medium text-foreground">{email}</span>
            </>
          )}
        </p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <InputOTP maxLength={6} value={otp} onChange={onOtpChange}>
          <InputOTPGroup className="gap-2">
            <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
            <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
            <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
            <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
            <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
            <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
          </InputOTPGroup>
        </InputOTP>

        <div className="text-sm text-muted-foreground">
          Vous n&apos;avez pas reçu le code ?{" "}
          <button
            className="text-primary hover:underline font-medium disabled:opacity-60"
            type="button"
            onClick={onResend}
            disabled={resendCooldown > 0 || isResending}
          >
            {isResending ? (
              <span className="inline-flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi...
              </span>
            ) : resendCooldown > 0 ? (
              `${resendLabel} (${resendCooldown}s)`
            ) : (
              resendLabel
            )}
          </button>
        </div>

        {suggestions ?? null}

        <Button
          onClick={onSubmit}
          disabled={isSubmitting || otp.length < 6}
          className="w-full h-12 text-base font-bold mt-4 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Vérification...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </>
  );
}