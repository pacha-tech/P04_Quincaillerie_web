"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, Mail, Phone, Lock, Eye, EyeOff, User } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SignUpPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    if (!isLoading) fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est obligatoire";
    if (!formData.email.trim()) newErrors.email = "L'email est obligatoire";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email invalide";
    if (!formData.phone.trim()) newErrors.phone = "Le numéro est obligatoire";
    else if (!/^6[0-9]{8}$/.test(formData.phone)) newErrors.phone = "Format invalide";
    if (!formData.password) newErrors.password = "Le mot de passe est obligatoire";
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 caractères";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('password', formData.password);
      if (selectedImage) data.append('file', selectedImage);

      await new Promise(resolve => setTimeout(resolve, 1500));

      await Swal.fire({
        icon: 'success',
        title: `Bienvenue ${formData.name} !`,
        text: 'Votre compte a été créé avec succès.',
        confirmButtonText: "Se connecter",
        confirmButtonColor: '#00897B',
        allowOutsideClick: false,
      });
      
      router.push('/login'); 
      
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Oups !',
        text: error.response?.data?.message || error.message || "Une erreur s'est produite lors de l'inscription.",
        confirmButtonColor: '#E53935',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className="min-h-[100dvh] bg-app-surface flex items-center justify-center p-4 py-8 relative">
      {isLoading && <div className="absolute inset-0 z-50 bg-black/5 flex items-center justify-center cursor-not-allowed" />}
      
      {/* MODIF ICI : my-auto pour centrer si la hauteur le permet, margin top/bottom automatique sinon */}
      <main className="bg-white w-full max-w-md rounded-2xl md:rounded-3xl shadow-xl p-5 sm:p-6 md:p-8 relative">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-5 md:space-y-6 mt-2 md:mt-4">
          
          {/* SÉLECTEUR D'IMAGE */}
          <div className="flex justify-center">
            <div className="relative cursor-pointer group" onClick={triggerFileInput}>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImagePick} className="hidden" />
              <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-app-primary/20 bg-app-primary/5 flex items-center justify-center overflow-hidden transition-transform ${isLoading ? '' : 'group-hover:scale-105'}`}>
                {previewUrl ? <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" /> : <User size={36} className="text-app-primary md:w-10 md:h-10" />}
              </div>
              <div className={`absolute bottom-0 right-0 w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-white flex items-center justify-center ${isLoading ? 'bg-gray-400' : 'bg-app-primary'}`}>
                <Camera size={14} className="text-white" />
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-extrabold text-app-text-primary">Créer un compte</h2>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Rejoignez Brixel dès aujourd'hui</p>
          </div>

          <div className={`space-y-3 md:space-y-4 ${isLoading ? 'opacity-70 pointer-events-none' : ''}`}>
            <div>
              <div className={`flex items-center bg-app-surface border rounded-xl px-3 py-2.5 md:px-4 md:py-3 focus-within:border-app-primary focus-within:bg-white transition-all ${errors.name ? 'border-red-500' : 'border-transparent'}`}>
                <User size={18} className="text-app-primary mr-2 md:mr-3 shrink-0" />
                <input type="text" name="name" placeholder="Nom complet" value={formData.name} onChange={handleChange} className="bg-transparent w-full outline-none text-app-text-primary placeholder:text-gray-400 text-sm md:text-base" />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
            </div>

            <div>
              <div className={`flex items-center bg-app-surface border rounded-xl px-3 py-2.5 md:px-4 md:py-3 focus-within:border-app-primary focus-within:bg-white transition-all ${errors.email ? 'border-red-500' : 'border-transparent'}`}>
                <Mail size={18} className="text-app-primary mr-2 md:mr-3 shrink-0" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="bg-transparent w-full outline-none text-app-text-primary placeholder:text-gray-400 text-sm md:text-base" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div>
              <div className={`flex items-center bg-app-surface border rounded-xl px-3 py-2.5 md:px-4 md:py-3 focus-within:border-app-primary focus-within:bg-white transition-all ${errors.phone ? 'border-red-500' : 'border-transparent'}`}>
                <Phone size={18} className="text-app-primary mr-2 md:mr-3 shrink-0" />
                <input type="tel" name="phone" placeholder="Téléphone (ex: 6XXXXXXXX)" value={formData.phone} onChange={handleChange} className="bg-transparent w-full outline-none text-app-text-primary placeholder:text-gray-400 text-sm md:text-base" />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
            </div>

            <div>
              <div className={`flex items-center bg-app-surface border rounded-xl px-3 py-2.5 md:px-4 md:py-3 focus-within:border-app-primary focus-within:bg-white transition-all ${errors.password ? 'border-red-500' : 'border-transparent'}`}>
                <Lock size={18} className="text-app-primary mr-2 md:mr-3 shrink-0" />
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} className="bg-transparent w-full outline-none text-app-text-primary placeholder:text-gray-400 text-sm md:text-base" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 focus:outline-none p-1">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full h-11 md:h-12 mt-2 bg-app-primary text-white rounded-xl font-bold text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:bg-app-primary/90 shadow-md cursor-pointer">
            {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "S'INSCRIRE"}
          </button>

          {!isLoading && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 mt-2 text-xs md:text-sm">
              <span className="text-gray-500">Déjà un compte ?</span>
              <Link href="/login" className="text-app-primary font-bold hover:underline p-1">Connectez-vous</Link>
            </div>
          )}
        </form>
      </main>
    </div>
  );
}