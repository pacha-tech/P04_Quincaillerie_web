"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { localisationService } from '@/src/services/LocalisationService';
import { Localisation } from '@/src/types/Localisation';
import { 
  ArrowLeft, MapPin, Map, Check, Eye, EyeOff, 
  Store, ShieldCheck, Loader2, ArrowRight, Info, UploadCloud, FileText,
  CircleCheck
} from 'lucide-react';
import { userService } from '@/src/services/UserService';
import { RegisterSellerDTO } from '@/src/types/DTO/RegisterSellerDTO';
import { authentification } from '@/src/config/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { UserRole } from '@/src/types/auth';
import { useAuth } from '@/src/hooks/AuthContext'
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const MapStep = dynamic(() => import('@/src/components/ui/vendeur/MapStep'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50 animate-pulse">
      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
    </div>
  )
});

export default function SignupVendeurPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const {login} = useAuth();

  const [formData, setFormData] = useState({
    nom: '', email: '', telephone: '', password: '',
    storeName: '', precision: '', description: '',
    latitude: 3.865, longitude: 11.520, 
    region: '', ville: '', quartier: '', 
    nui: '', acceptTerms: false, wantTips: false,
    documentPreuve: null as File | null
  });

  const [errors, setErrors] = useState({
    nom: false, email: false, telephone: false, password: false,
    storeName: false, location: false, acceptTerms: false, nui: false, documentPreuve: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, documentPreuve: e.target.files![0] }));
      setErrors(prev => ({ ...prev, documentPreuve: false }));
    }
  };

  const handleNext = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (step === 1) {
      newErrors.nom = !formData.nom.trim();
      newErrors.email = !formData.email.trim();
      newErrors.telephone = !/^6\d{8}$/.test(formData.telephone);
      newErrors.password = formData.password.length < 6;
      
      if (newErrors.nom || newErrors.email || newErrors.telephone || newErrors.password) isValid = false;
    }

    if (step === 2) {
      newErrors.storeName = !formData.storeName.trim();
      newErrors.location = geoStatus !== "success";
      
      if (newErrors.storeName || newErrors.location) isValid = false;
    }

    setErrors(newErrors);
    if (isValid) setStep(s => s + 1);
  };

  const handlePrev = () => setStep(s => s - 1);

  const handleBrowserGeolocation = () => {
    setGeoStatus("loading");
    setErrors(prev => ({ ...prev, location: false }));
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => handleLocationAcquired(position.coords.latitude, position.coords.longitude),
        () => setGeoStatus("error"),
        { enableHighAccuracy: true }
      );
    } else {
      setGeoStatus("error");
    }
  };

  const handleLocationAcquired = async (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    setGeoStatus("loading");
    
    try {
      const result: Localisation = await localisationService.getLocalisation(lat, lng);
      setFormData(prev => ({
        ...prev,
        region: result.region,
        ville: result.ville,
        quartier: result.quartier
      }));
      setGeoStatus("success");
      setErrors(prev => ({ ...prev, location: false }));
    } catch (error) {
      setGeoStatus("error");
      setFormData(prev => ({ ...prev, region: "", ville: "", quartier: "" }));
    } finally {
      setShowMapModal(false); 
    }
  };

  const handleSubmit = async () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.nui.trim()) {
      newErrors.nui = true;
      isValid = false;
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = true;
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    setLoading(true);

    const dto: RegisterSellerDTO = {
        user: {
            password: formData.password,
            name: formData.nom,
            email: formData.email,
            phone: formData.telephone,
            role: "VENDEUR",
            imageUrl: "",
        },
        quincaillerie: {
            storeName: formData.storeName,
            region: formData.region,
            ville: formData.ville,
            quartier: formData.quartier,
            precision: formData.precision,
            photoUrl: "",
            description: formData.description || "Boutique partenaire",
            latitude: formData.latitude,
            longitude: formData.longitude,
            nui: formData.nui,
            acceptsTerms: formData.acceptTerms,
            wantTips: formData.wantTips,
        }
      };

    try {
      const response = await userService.registerSeller(dto); 

      const customToken = response.token; 
      console.log("Le token est:",customToken);
      
      if (!customToken) {
        throw new Error("Le serveur n'a pas renvoyé de token d'authentification.");
      }
      
      console.log("On tente de s'auto loger");
      const userCredential = await signInWithCustomToken(authentification, customToken);
            
            
      const idTokenResult = await userCredential.user.getIdTokenResult();
      const token = idTokenResult.token;
            
      const role = idTokenResult.claims.role;
      console.log("Le role est: ",role);
      
            
      localStorage.setItem('firebase_token', token);
      login(role as UserRole);

      await Swal.fire({
        icon: 'success',
        title: `Bienvenue ${formData.storeName} !`,
        text: 'Votre compte a été créé avec succès.',
        confirmButtonText: "Accéder à mon espace",
        confirmButtonColor: '#00897B',
        allowOutsideClick: false,
      });

      router.push('/vendeur'); 
    } catch (error:any) {
      console.error(error);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Ajout du style `disabled:` pour bloquer visuellement les inputs
  const inputBase = "w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-sm outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100";
  const labelStyle = "block text-xs font-bold text-gray-700 mb-1";
  const errorText = "text-xs text-red-500 mt-1 block";
  
  return (
    <div className="min-h-screen bg-app-surface flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col overflow-hidden">
        
        <div className="p-5 md:p-8 border-b border-gray-100">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h1 className="text-xl font-black text-gray-900">Ouvrir une boutique</h1>
              <p className="text-xs text-gray-400 mt-0.5">Rejoignez Brixel en 4 étapes</p>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 w-8 rounded-full transition-all ${
                  step === i ? 'bg-black' : step > i ? 'bg-green-500' : 'bg-gray-100'
                }`} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 md:p-8">
          
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Nom complet</label>
                  <input type="text" name="nom" disabled={loading} value={formData.nom} onChange={handleChange} className={`${inputBase} ${errors.nom ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-black'}`} />
                  {errors.nom && <span className={errorText}>Le nom est obligatoire.</span>}
                </div>
                <div>
                  <label className={labelStyle}>Email</label>
                  <input type="email" name="email" disabled={loading} value={formData.email} onChange={handleChange} className={`${inputBase} ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-black'}`} />
                  {errors.email && <span className={errorText}>L'email est obligatoire.</span>}
                </div>
              </div>

              <div>
                <label className={labelStyle}>Téléphone</label>
                <input type="tel" name="telephone" disabled={loading} maxLength={9} placeholder="Ex: 6XXXXXXXX" value={formData.telephone} onChange={handleChange} className={`${inputBase} ${errors.telephone ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-black'}`} />
                {errors.telephone && <span className={errorText}>Doit commencer par 6 (9 chiffres).</span>}
              </div>

              <div>
                <label className={labelStyle}>Mot de passe</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" disabled={loading} value={formData.password} onChange={handleChange} className={`${inputBase} pr-10 ${errors.password ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-black'}`} />
                  <button type="button" disabled={loading} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <span className={errorText}>Min. 6 caractères requis.</span>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <label className={labelStyle}>Nom de la quincaillerie</label>
                <div className="relative">
                  <Store className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="text" name="storeName" disabled={loading} value={formData.storeName} onChange={handleChange} className={`${inputBase} pl-10 ${errors.storeName ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-black'}`} />
                </div>
                {errors.storeName && <span className={errorText}>Nom de boutique requis.</span>}
              </div>

              <div>
                <label className={labelStyle}>Localisation (Générée par API)</label>
                <div className={`p-4 bg-gray-50 border rounded-xl space-y-4 ${errors.location ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200'}`}>
                  <div className="flex gap-3">
                    <button onClick={handleBrowserGeolocation} disabled={loading} className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      <MapPin className="w-4 h-4" /> Ma position
                    </button>
                    <button onClick={() => setShowMapModal(true)} disabled={loading} className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
                      <Map className="w-4 h-4" /> Carte
                    </button>
                  </div>

                  <div className="text-center min-h-[40px] flex flex-col justify-center items-center">
                    {geoStatus === "loading" && <span className="text-xs text-gray-500 flex items-center justify-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin"/> Recherche de votre zone...</span>}
                    {geoStatus === "error" && <span className="text-xs text-red-500 font-medium">Échec de géolocalisation.</span>}
                    
                    {geoStatus === "success" && (
                      <div className="flex flex-col items-center bg-green-50 px-4 py-2 rounded-lg border border-green-100 w-full">
                        <span className="flex flex-row text-xs font-medium text-green-800">
                          <CircleCheck className="w-4 h-4 mr-3" /> {formData.region} , {formData.ville} , {formData.quartier}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {errors.location && <span className={errorText}>Veuillez définir votre position.</span>}
              </div>

              <div>
                <label className={labelStyle}>Détails de l'adresse (Facultatif)</label>
                <input type="text" name="precision" disabled={loading} placeholder="Ex: Face station Total" value={formData.precision} onChange={handleChange} className={`${inputBase} border-gray-200 focus:border-black`} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 items-start">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  Cette étape sert uniquement à confirmer les données géographiques détectées. Assurez-vous que les informations sont correctes.
                </p>
              </div>

              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-4">
                <div>
                  <span className="block text-xs text-gray-400 mb-0.5">Boutique</span>
                  <span className="text-sm font-bold text-gray-900">{formData.storeName}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-200/50">
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">Région</span>
                    <span className="text-sm font-bold text-gray-900 line-clamp-1">{formData.region || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">Ville</span>
                    <span className="text-sm font-bold text-gray-900 line-clamp-1">{formData.ville || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-gray-400 mb-0.5">Quartier</span>
                    <span className="text-sm font-bold text-gray-900 line-clamp-1">{formData.quartier || "-"}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200/50">
                  <span className="block text-xs text-gray-400 mb-0.5">Précision</span>
                  <span className="text-sm font-bold text-gray-900">{formData.precision || "Aucune"}</span>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              
              <div>
                <label className={labelStyle}>Preuve d'existence (Reçu, Certificat...)</label>
                <label className={`flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl transition-all ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100 hover:border-gray-300'}`}>
                  <div className="flex flex-col items-center justify-center pt-4 pb-4 px-4 text-center">
                    <FileText className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-xs text-gray-500 leading-relaxed">
                      <span className="font-bold text-gray-700">Cliquez</span> ou glissez le document
                    </p>
                    {formData.documentPreuve && (
                      <div className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full truncate max-w-[250px]">
                        {formData.documentPreuve.name}
                      </div>
                    )}
                  </div>
                  <input type="file" disabled={loading} className="hidden" accept="image/*,application/pdf" onChange={handleDocumentChange} />
                </label>
              </div>

              <div>
                <label className={labelStyle}>Numéro d'Identification Unique (NUI)</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="text" name="nui" disabled={loading} value={formData.nui} onChange={handleChange} className={`${inputBase} pl-10 ${errors.nui ? 'border-red-500 ring-1 ring-red-500/20' : 'border-gray-200 focus:border-black'}`} />
                </div>
                {errors.nui && <span className={errorText}>Le NUI est obligatoire.</span>}
              </div>

              <div className={`p-4 bg-gray-50 border rounded-xl space-y-2 ${errors.acceptTerms ? 'border-red-500' : 'border-gray-200'} ${loading ? 'opacity-60' : ''}`}>
                <label className={`flex items-start gap-3 ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  <input type="checkbox" disabled={loading} checked={formData.acceptTerms} onChange={(e) => { setFormData({...formData, acceptTerms: e.target.checked}); setErrors({...errors, acceptTerms: false}); }} className="mt-0.5 w-4 h-4 rounded border-gray-300 disabled:cursor-not-allowed" />
                  <span className="text-xs text-gray-700 leading-tight">J'accepte les conditions d'utilisation et la politique de confidentialité. <span className="text-red-500">*</span></span>
                </label>
              </div>
              {errors.acceptTerms && <span className={errorText}>Vous devez accepter les conditions.</span>}
            </div>
          )}
        </div>

        <div className="p-5 md:p-8 border-t border-gray-100 flex gap-3">
          {step > 1 && (
            <button onClick={handlePrev} disabled={loading} className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          {step < 4 ? (
            <button onClick={handleNext} disabled={loading} className="flex-1 py-2.5 bg-black text-white rounded-xl font-bold text-sm shadow transition hover:bg-gray-800 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              Continuer <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading} className="flex-1 py-2.5 bg-black text-white rounded-xl font-bold text-sm shadow transition hover:bg-gray-800 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin"/> Création en cours...</> : <><Check className="w-4 h-4"/> Ouvrir la boutique</>}
            </button>
          )}
        </div>
      </div>

      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl h-[65vh] flex flex-col shadow-xl overflow-hidden border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-bold text-gray-900">Positionnez votre quincaillerie</h3>
              <button onClick={() => setShowMapModal(false)} className="text-gray-400 hover:text-gray-800 transition">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow relative z-0">
              <MapStep lat={formData.latitude} lng={formData.longitude} onChange={(lat, lng) => setFormData(prev => ({...prev, latitude: lat, longitude: lng}))} />
            </div>
            <div className="p-5 bg-white border-t border-gray-100 flex gap-3">
              <button onClick={() => setShowMapModal(false)} className="px-5 py-2.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-100 transition">
                Annuler
              </button>
              <button onClick={() => handleLocationAcquired(formData.latitude, formData.longitude)} className="flex-1 py-2.5 bg-black text-white rounded-xl text-sm font-bold shadow hover:bg-gray-800 transition">
                Confirmer l'adresse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

