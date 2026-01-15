// src/services/authService.ts
export const authService = {
  // Étape 1 : Demander la réinitialisation
  requestPasswordReset: async (email: string) => {
    // Remplacer par l'URL de votre service de paiement/auth
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  },

  // Étape 2 : Vérifier l'OTP
  verifyOtp: async (email: string, otp: string) => {
    const response = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
      headers: { 'Content-Type': 'application/json' },
    });
    return response.json();
  }
};