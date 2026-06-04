"use client";

import { useState, useEffect } from 'react';
import { Store, Shield, Edit2, Save, X, MapPin, Phone, Star, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { QuincaillerieDetail } from '@/src/types/QuincaillerieDetail';
import LogoutModal from '../../LogoutModal';
import { useAuth } from '@/src/hooks/AuthContext';

interface InfosGeneralesProps {
  initialData: QuincaillerieDetail;
}

export default function InfosGenerales({ initialData }: InfosGeneralesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [shopInfos, setShopInfos] = useState<QuincaillerieDetail>(initialData);
  const [shopForm, setShopForm] = useState<QuincaillerieDetail>(initialData);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {logout } = useAuth();
  


  useEffect(() => {
    setShopInfos(initialData);
    setShopForm(initialData);
  }, [initialData]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Sauvegarde de la boutique...", { id: 'save-shop' });
    await new Promise(r => setTimeout(r, 1000)); // Simule API
    setShopInfos(shopForm);
    setIsEditing(false);
    toast.success("Boutique mise à jour !", { id: 'save-shop' });
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
      {/* Colonne gauche : Infos Boutique */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 relative">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Store className="text-blue-500" /> Profil Public
          </h3>
          {!isEditing ? (
            <button onClick={() => { setShopForm(shopInfos); setIsEditing(true); }} className="p-2 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"><Edit2 size={16} /></button>
          ) : (
            <button onClick={() => setIsEditing(false)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"><X size={16} /></button>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 font-black text-2xl border border-blue-100">
                {shopInfos.name.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <h4 className="text-2xl font-black text-gray-900">{shopInfos.name}</h4>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 font-bold rounded text-xs">{shopInfos.status}</span>
                  <span className="flex items-center text-amber-500 font-bold"><Star size={14} className="fill-current mr-1" /> {shopInfos.averageRating}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Localisation</p>
                <p className="text-sm font-bold text-gray-800 flex items-start gap-1"><MapPin size={14} className="mt-0.5 text-gray-400 shrink-0" /> {shopInfos.ville}, {shopInfos.quartier}</p>
                <p className="text-xs text-gray-500 ml-5">{shopInfos.precision}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Contact Client</p>
                <p className="text-sm font-bold text-gray-800 flex items-center gap-1"><Phone size={14} className="text-gray-400" /> +{shopInfos.telephone}</p>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-gray-600 font-medium">{shopInfos.description}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Nom de la boutique</label>
              <input type="text" value={shopForm.name} onChange={e => setShopForm({ ...shopForm, name: e.target.value })} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Ville</label>
                <input type="text" value={shopForm.ville} onChange={e => setShopForm({ ...shopForm, ville: e.target.value })} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">Quartier</label>
                <input type="text" value={shopForm.quartier} onChange={e => setShopForm({ ...shopForm, quartier: e.target.value })} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500">Description</label>
              <textarea rows={3} value={shopForm.description || ''} onChange={e => setShopForm({ ...shopForm, description: e.target.value })} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Save size={16} /> Enregistrer</button>
          </form>
        )}
      </div>

      {/* Colonne droite : Sécurité */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 h-fit">
        <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 mb-6"><Shield className="text-red-500" /> Sécurité</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Lock size={18} className="text-gray-400" />
              <p className="text-sm font-bold text-gray-900">Mot de passe</p>
            </div>
            <p className="text-xs text-gray-500 mb-3">Modifiez votre mot de passe pour sécuriser votre compte.</p>
            <button className="w-full py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition">Changer le mot de passe</button>
          </div>
          <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
            <p className="text-sm font-bold text-red-900 mb-1">Déconnexion</p>
            <p className="text-xs text-red-700/80 mb-3">Fermez la session sur cet appareil.</p>
            <button 
              onClick={() => {
              setShowLogoutModal(true);
            }}

             className="w-full py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition">Se déconnecter</button>
          </div>
        </div>
      </div>

      <LogoutModal 
          isOpen={showLogoutModal} 
          onClose={() => setShowLogoutModal(false)} 
          onConfirm={handleLogout} 
      />
    </div>
  );
}