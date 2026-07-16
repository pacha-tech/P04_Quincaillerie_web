"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { userService } from '@/src/services/UserService';
import { useAuth } from '@/src/hooks/AuthContext';
import { UserRole } from '@/src/types/auth';
import AuthLayout from '@/src/components/ui/AuthLayout';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "L'email est obligatoire";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est obligatoire";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const userCredential = await userService.login(formData.email, formData.password);
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const token = idTokenResult.token;
      const role = idTokenResult.claims.role || 'VISITEUR';

      localStorage.setItem('firebase_token', token);
      login(role as UserRole);

      if (role === 'VISITEUR') {
        router.push('/visiteur');
      } else {
        router.push(role === 'VENDEUR' ? '/vendeur' : '/client');
      }

    } catch (error: any) {
      let errorMessage = "Identifiants incorrects.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
      }

      Swal.fire({
        icon: 'error',
        title: 'Erreur de connexion',
        text: errorMessage,
        confirmButtonColor: '#E53935',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <main className="bg-white w-full max-w-md rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100/50 relative">
        {isLoading && <div className="absolute inset-0 z-50 bg-black/5 rounded-2xl md:rounded-3xl flex items-center justify-center cursor-not-allowed" />}

        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-app-text-primary">Bon retour !</h2>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Connectez-vous pour continuer</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 md:space-y-5">
          <div className={`space-y-3 md:space-y-4 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>

            <div>
              <div className={`flex items-center bg-app-surface border rounded-xl px-3 py-2.5 md:px-4 md:py-3 focus-within:border-[#E94560] focus-within:bg-white transition-all ${errors.email ? 'border-red-500' : 'border-transparent'}`}>
                <Mail size={18} className="text-[#1A1A2E] mr-2 md:mr-3 shrink-0" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="bg-transparent w-full outline-none text-app-text-primary placeholder:text-gray-400 text-sm md:text-base" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className={`flex items-center bg-app-surface border rounded-xl px-3 py-2.5 md:px-4 md:py-3 focus-within:border-[#E94560] focus-within:bg-white transition-all ${errors.password ? 'border-red-500' : 'border-transparent'}`}>
                <Lock size={18} className="text-[#1A1A2E] mr-2 md:mr-3 shrink-0" />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} className="bg-transparent w-full outline-none text-app-text-primary placeholder:text-gray-400 text-sm md:text-base" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none p-1">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-xs text-[#E94560] font-semibold hover:underline px-1 py-1 cursor-pointer">
                Mot de passe oublié ?
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full h-11 md:h-12 bg-[#1A1A2E] hover:bg-[#252542] text-white rounded-xl font-bold text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md cursor-pointer mt-2">
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "SE CONNECTER"}
          </button>

          {!isLoading && (
            <div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 mt-4 text-xs md:text-sm">
                <span className="text-gray-500">Pas encore de compte ?</span>
                <Link href="/signup" className="text-[#E94560] font-bold hover:underline p-1">Créer un compte</Link>
              </div>
              <div className='flex flex-col sm:flex-row items-center justify-center'>
                <Link href="/" className="text-[#1A1A2E]/70 hover:text-[#1A1A2E] text-sm text-center underline p-1">Retour à l'accueil</Link>
              </div>
            </div>
          )}
        </form>
      </main>
    </AuthLayout>
  );
}