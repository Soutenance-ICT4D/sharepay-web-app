// src/components/auth/OtpVerificationForm.tsx

import { useState } from "react";
import { authService } from "@/services/authService";


export default function OtpVerificationForm({ email }: { email: string }) {
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    // Intégration backend directe ici
    const res = await authService.verifyEmail({ email, otpCode: otp });
    if(res.succes) {
      // Rediriger vers la page de nouveau mot de passe
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-[#10385B] mb-2">Vérification</h2>
      <p className="text-gray-600 mb-6">Code envoyé à <span className="font-semibold">{email}</span></p>
      
      <div className="flex justify-center gap-2 mb-6">
        {/* Vous pouvez utiliser une librairie comme 'react-otp-input' ou des inputs natifs */}
        <input 
          maxLength={6}
          className="text-center text-2xl tracking-[1em] w-full p-3 border-b-2 border-[#10385B] focus:border-[#098865] outline-none"
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>

      <button 
        onClick={handleVerify}
        className="w-full bg-[#10385B] text-white p-3 rounded-lg font-semibold mb-4"
      >
        Vérifier le code
      </button>
      
      <button className="text-[#098865] text-sm font-medium">
        Renvoyer le code (59s)
      </button>
    </div>
  );
}