// src/services/authService.ts
import { apiRequest } from "@/lib/api-client";
import { tokenStorage, type AuthTokens } from "@/lib/token-storage";

type TokensResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
};

type EmptyData = Record<string, never>;

const AUTH_BASE = "/auth";

export const authService = {
  async register(input: {
    fullName: string;
    email: string;
    password: string;
    role: "MERCHANT" | "USER";
    phone?: string;
  }) {
    // Le backend attend "fullName" mais notre formulaire a "name". 
    // Le mapping est fait à l'appel de la fonction.
    return apiRequest<{
      id: number;
      fullName: string;
      email: string;
      phone: string;
      role: string;
      verified: boolean;
    }>(`${AUTH_BASE}/register`, {
      method: "POST",
      body: {
        ...input,
        // Assurer que phone est bien formaté ou envoyé (string ou null/undefined selon backend)
      },
    });
  },

  async resendVerifyEmailOtp(input: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    return apiRequest<EmptyData>(`${AUTH_BASE}/register`, {
      method: "POST",
      body: input,
    });
  },

  async verifyEmail(input: { email: string; otpCode: string }) {
    return apiRequest<EmptyData>(`${AUTH_BASE}/verify-otp`, {
      method: "POST",
      body: input,
    });
  },

  async login(input: { email: string; password: string }, options?: { persist?: boolean }) {
    const res = await apiRequest<TokensResponse>(`${AUTH_BASE}/login`, {
      method: "POST",
      body: input,
    });

    // DEBUG: Log received tokens
    console.log("[AuthService] Login Response:", res.data);

    tokenStorage.set(res.data as AuthTokens, { persist: options?.persist ?? false });
    return res;
  },

  async googleLogin(input: { idToken: string }, options?: { persist?: boolean }) {
    const res = await apiRequest<TokensResponse>(`${AUTH_BASE}/google`, {
      method: "POST",
      body: input,
    });

    tokenStorage.set(res.data as AuthTokens, { persist: options?.persist ?? false });
    return res;
  },

  async refresh() {
    const tokens = tokenStorage.get();
    if (!tokens?.refreshToken) {
      throw new Error("Missing refresh token");
    }

    const res = await apiRequest<TokensResponse>(`${AUTH_BASE}/refresh-token`, {
      method: "POST",
      body: { refreshToken: tokens.refreshToken },
    });

    tokenStorage.set(res.data as AuthTokens);
    return res;
  },

  async logout() {
    const tokens = tokenStorage.get();
    if (!tokens?.refreshToken) {
      tokenStorage.clear();
      return;
    }

    await apiRequest<EmptyData>(`${AUTH_BASE}/logout`, {
      method: "POST",
      body: { refreshToken: tokens.refreshToken },
    });

    tokenStorage.clear();
  },

  async requestPasswordReset(input: { email: string }) {
    return apiRequest<EmptyData>(`${AUTH_BASE}/request-password-reset`, {
      method: "POST",
      body: input,
    });
  },

  async resendResetPasswordOtp(input: { email: string }) {
    return apiRequest<EmptyData>(`${AUTH_BASE}/request-password-reset`, {
      method: "POST",
      body: input,
    });
  },

  async verifyResetOtp(input: { email: string; otpCode: string }) {
    return apiRequest<{ resetToken: string }>(`${AUTH_BASE}/verify-reset-otp`, {
      method: "POST",
      body: input,
    });
  },

  async resetPassword(input: { email: string; resetToken: string; newPassword: string }) {
    return apiRequest<EmptyData>(`${AUTH_BASE}/reset-password`, {
      method: "POST",
      body: input,
    });
  },
};
