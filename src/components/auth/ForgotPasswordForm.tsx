// src/components/auth/ForgotPasswordForm.tsx
import { useState } from 'react';
import { authService } from '@/services/authService';

export default function ForgotPasswordForm({ onEmailSent }: { onEmailSent: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Appel au service préparé
    try {
      await authService.requestPasswordReset({ email });
      onEmailSent(email); // On passe à l'étape suivante
    } catch (err) {
      console.error("Erreur d'envoi", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#10385B] mb-4">Réinitialiser le mot de passe</h2>
      <p className="text-gray-600 mb-6">Entrez votre email pour recevoir un code de vérification.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" 
          placeholder="votre@email.com"
          className="w-full p-3 border rounded focus:ring-2 focus:ring-[#098865] outline-none"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button 
          disabled={loading}
          className="w-full bg-[#098865] text-white p-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
        >
          {loading ? 'Envoi...' : 'Envoyer le code'}
        </button>
      </form>
    </div>
  );
}