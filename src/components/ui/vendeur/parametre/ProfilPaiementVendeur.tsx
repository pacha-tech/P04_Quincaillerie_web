"use client";

import { useState, useEffect } from 'react';
import { 
  CreditCard, Edit2, X, Save, User, Smartphone, AlertCircle, Loader2, Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { paiementService } from '@/src/services/PaiementService'; 
import { ComptePaiement } from '@/src/types/ComptePaiement';

export default function ProfilPaiementVendeur() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [compteActuel, setCompteActuel] = useState<ComptePaiement>({
    nomCompte: "",
    numeroTelephone: "",
    operateur: ""
  });

  const [formData, setFormData] = useState<ComptePaiement>(compteActuel);

  const [errors, setErrors] = useState<{
    nom?: string;
    numeroTelephone?: string;
    operateur?: string;
  }>({});

  useEffect(() => {
    const fetchPaiementInfos = async () => {
      try {
        const data = await paiementService.getInfosPaiementSeller();
        
        // Sécurité : on s'assure que si le numéro vient sans 237, on l'ajoute
        let phone = data?.numeroTelephone || "";
        if (phone.length === 9) phone = `237${phone}`;

        const safeData: ComptePaiement = {
          nomCompte: data?.nomCompte || "",
          numeroTelephone: phone,
          operateur: data?.operateur || ""
        };
        
        setCompteActuel(safeData);
        setFormData(safeData);
      } catch (error) {
        toast.error("Impossible de charger vos informations de paiement.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaiementInfos();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!formData.operateur) {
      newErrors.operateur = "Veuillez choisir un opérateur de paiement.";
    }
    if (!formData.nomCompte.trim()) {
      newErrors.nom = "Le nom du titulaire du compte est requis.";
    }
    // Le numéro complet doit faire 12 caractères (237 + 9 chiffres)
    if (formData.numeroTelephone.length !== 12) {
      newErrors.numeroTelephone = "Le numéro doit comporter 9 chiffres après le code pays.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setErrors({});

    // On formate la payload : Nom en MAJUSCULES
    const payloadEnvoyee: ComptePaiement = {
      ...formData,
      nomCompte: formData.nomCompte.trim().toUpperCase()
    };

    try {
      const updatedData = await paiementService.modifyInfosPaiementSeller(payloadEnvoyee);
      
      const safeData: ComptePaiement = {
        nomCompte: updatedData?.nomCompte || payloadEnvoyee.nomCompte,
        numeroTelephone: updatedData?.numeroTelephone || payloadEnvoyee.numeroTelephone,
        operateur: updatedData?.operateur || payloadEnvoyee.operateur
      };

      setCompteActuel(safeData);
      setIsEditing(false);
      toast.success("Compte de reversement mis à jour avec succès !");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
  };

  const maskNumber = (num: string) => {
    /*
    if (!num || num.length < 12) return num || "Non renseigné";
    return `+${num.slice(0,3)} ${num.slice(3,5)}X XXX ${num.slice(9,12)}`;
    */
    if (!num || num.length < 12) return num || "Non renseigné";
    return `+${num.slice(0,3)} ${num.slice(3,12)}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl max-w-2xl flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin text-app-accent mb-4" size={40} />
        <p className="text-gray-500 font-bold text-sm">Chargement de vos informations...</p>
      </div>
    );
  }

  const isConfigured = compteActuel.nomCompte && compteActuel.numeroTelephone && compteActuel.operateur;

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-xl max-w-2xl">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <CreditCard className="text-app-accent shrink-0" size={24} />
            Compte de réception des fonds
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Le compte sur lequel vos ventes sont reversées après livraison.
          </p>
        </div>
        
        {!isEditing ? (
          <button 
            onClick={() => { setFormData(compteActuel); setErrors({}); setIsEditing(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-full transition-colors cursor-pointer"
          >
            <Edit2 size={16} /> Modifier
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm rounded-full transition-colors cursor-pointer"
          >
            <X size={16} /> Annuler
          </button>
        )}
      </div>

      {/* MODE LECTURE */}
      {!isEditing && (
        <div className={`rounded-2xl p-6 text-white relative overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-200 ${isConfigured ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gray-100 border-2 border-dashed border-gray-300'}`}>
          <div className={`absolute top-0 right-0 p-6 opacity-20 ${!isConfigured && 'text-gray-400'}`}>
            <CreditCard size={100} />
          </div>
          
          {isConfigured ? (
            <>
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="bg-white p-2 rounded-xl">
                  <img 
                    src={compteActuel.operateur === 'ORANGE_MONEY_CM' ? '/logos/orange1.png' : '/logos/mtn1.png'} 
                    alt={compteActuel.operateur} 
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-black uppercase tracking-wider">Opérateur actif</p>
                  <p className="text-lg font-bold">{compteActuel.operateur === 'ORANGE_MONEY_CM' ? 'Orange Money' : 'MTN Mobile Money'}</p>
                </div>
              </div>

              <div className="space-y-1 relative z-10">
                <p className="text-[11px] text-gray-400 font-black uppercase tracking-wider">Titulaire & Numéro</p>
                {/* On affiche le nom tel qu'il a été enregistré (en majuscules) */}
                <p className="text-xl font-black tracking-wide">{compteActuel.nomCompte}</p>
                <p className="text-2xl font-mono tracking-widest text-emerald-400">{maskNumber(compteActuel.numeroTelephone)}</p>
              </div>
            </>
          ) : (
            <div className="relative z-10 text-center py-6 text-gray-500">
              <AlertCircle size={40} className="mx-auto mb-3 opacity-50" />
              <p className="font-bold text-lg text-gray-700 mb-1">Aucun compte configuré</p>
              <p className="text-sm">Cliquez sur "Modifier" pour ajouter vos informations de réception de fonds.</p>
            </div>
          )}
        </div>
      )}

      {/* MODE ÉDITION */}
      {isEditing && (
        <form onSubmit={handleSave} className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-200">
          
          {/* Opérateur */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400">
              1. Choisissez l'opérateur
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${formData.operateur === 'ORANGE_MONEY_CM' ? 'border-orange-500 bg-orange-50/30' : errors.operateur ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <input type="radio" name="operator" value="ORANGE_MONEY_CM" className="hidden" onChange={() => { setFormData({...formData, operateur: 'ORANGE_MONEY_CM'}); setErrors({...errors, operateur: undefined}); }} />
                <img src="/logos/orange1.png" alt="OM" className="w-8 h-8 object-contain" />
                <span className="font-bold text-sm text-gray-800">Orange Money</span>
              </label>
              
              <label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${formData.operateur === 'MTN' ? 'border-yellow-400 bg-yellow-50/30' : errors.operateur ? 'border-red-300 bg-red-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <input type="radio" name="operator" value="MTN" className="hidden" onChange={() => { setFormData({...formData, operateur: 'MTN'}); setErrors({...errors, operateur: undefined}); }} />
                <img src="/logos/mtn1.png" alt="Momo" className="w-8 h-8 object-contain" />
                <span className="font-bold text-sm text-gray-800">MTN MoMo</span>
              </label>
            </div>
            {errors.operateur && <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.operateur}</p>}
          </div>

          {/* Nom du compte */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><User size={14} /> Nom complet du compte</label>
            <input 
              type="text" 
              value={formData.nomCompte} 
              onChange={(e) => { setFormData({...formData, nomCompte: e.target.value}); setErrors({...errors, nom: undefined}); }} 
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl font-bold text-sm uppercase focus:ring-2 focus:ring-app-accent/50 outline-none transition-colors ${errors.nom ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200'}`} 
              placeholder="Ex: JEAN DUPONT"
            />
            {/* Note UX pour guider l'utilisateur */}
            <p className="text-xs text-gray-500 flex items-start gap-1.5 mt-1">
              <Info size={14} className="shrink-0 text-blue-500 mt-0.5" />
              Saisissez le nom complet et exact, dans le même ordre que celui attribué par votre opérateur mobile.
            </p>
            {errors.nom && <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.nom}</p>}
          </div>

          {/* Numéro de téléphone */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5"><Smartphone size={14} /> Numéro de téléphone</label>
            <div className={`flex items-center bg-gray-50 border rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-app-accent/50 transition-colors ${errors.numeroTelephone ? 'border-red-400 ring-1 ring-red-400' : 'border-gray-200'}`}>
              <div className="bg-gray-100 px-4 py-3 border-r border-gray-200 flex items-center justify-center">
                <span className="font-black text-sm text-gray-600">+237</span>
              </div>
              <input 
                type="text" 
                // On affiche la valeur sans le "237" pour l'UX
                value={formData.numeroTelephone.replace(/^237/, '')} 
                onChange={(e) => { 
                  const val = e.target.value.replace(/\D/g, ''); 
                  if(val.length <= 9) {
                    // On enregistre dans le state avec le 237 pour que l'API ait les 12 chiffres
                    setFormData({...formData, numeroTelephone: val ? `237${val}` : ''});
                    setErrors({...errors, numeroTelephone: undefined});
                  }
                }} 
                className="w-full px-3 py-3 bg-transparent font-bold text-sm outline-none" 
                placeholder="6XXXXXXXX" 
              />
            </div>
            {errors.numeroTelephone && <p className="text-xs font-bold text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12}/> {errors.numeroTelephone}</p>}
          </div>

          {/* Bouton Sauvegarder */}
          <button type="submit" disabled={isSaving} className="w-full py-4 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2">
            {isSaving ? <><Loader2 size={18} className="animate-spin" /> Enregistrement...</> : <><Save size={18} /> Sauvegarder</>}
          </button>
        </form>
      )}
    </div>
  );
}