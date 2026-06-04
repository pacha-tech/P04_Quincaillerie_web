"use client";

import { useState } from 'react';
import { Store, CreditCard, Bell, Truck, Loader2 } from 'lucide-react';
import { useAuth } from '@/src/hooks/AuthContext';
import ProfilPaiementVendeur from '@/src/components/ui/vendeur/parametre/ProfilPaiementVendeur';
import InfosGenerales from '@/src/components/ui/vendeur/parametre/InfosGenerales';
import NotificationsAlertes from '@/src/components/ui/vendeur/parametre/NotificationsAlertes';
import PolitiquesVente from '@/src/components/ui/vendeur/parametre/PolitiquesVente';
import LogoutModal from '@/src/components/ui/LogoutModal';

export default function ParametresQuincailleriePage() {
  const { quincaillerieDetail, isLoading: isAuthLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'compte' | 'notifications' | 'politiques'>('general');


  // Écran de chargement sécurisé (le temps que Firebase réponde)
  if (isAuthLoading || !quincaillerieDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <Loader2 size={40} className="animate-spin text-app-accent mb-4" />
        <p className="font-bold">Chargement de vos paramètres...</p>
      </div>
    );
  }

  

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-full mx-auto">
        
        {/* EN-TÊTE PRINCIPAL */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">Ma Quincaillerie</h1>
          <p className="text-gray-500 font-medium">Gérez l'identité, la sécurité et les règles de votre boutique.</p>
        </div>

        {/* NAVIGATION ONGLETS */}
        <div className="flex border-b border-gray-200 gap-6 md:gap-20 overflow-x-auto pb-px mb-8 scrollbar-none">
          {[
            { id: 'general', icon: Store, label: 'Infos & Sécurité' },
            { id: 'compte', icon: CreditCard, label: 'Paiement' },
            { id: 'notifications', icon: Bell, label: 'Alertes & Stocks' },
            { id: 'politiques', icon: Truck, label: 'Vente & Livraison' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 font-bold text-sm border-b-2 whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* AFFICHAGE CONDITIONNEL DES COMPOSANTS */}
        {activeTab === 'general' && (
          <InfosGenerales initialData={quincaillerieDetail}/>
        )}

        {activeTab === 'compte' && (
          <div className="animate-in fade-in duration-200">
            <ProfilPaiementVendeur />
          </div>
        )}

        {activeTab === 'notifications' && (
          <NotificationsAlertes />
        )}

        {activeTab === 'politiques' && (
          <PolitiquesVente />
        )}

      </div>
      
    </div>
  );
}