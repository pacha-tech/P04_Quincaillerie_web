'use client';

import { useState } from "react";
import SideBar from "@/src/components/ui/SideBar";
import RoleGuard from "@/src/components/ui/RoleGuard";
import { 
  Menu, Search, Bell, Store, Loader2, X, 
  MapPin, Phone, Info, Settings, Edit3 
} from "lucide-react";
import { useAuth } from "@/src/hooks/AuthContext";
import VendeurFooter from "@/src/components/ui/vendeur/VendeurFooter";
import { NotificationProvider } from "@/src/hooks/NotificationContext";


export default function VendeurLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false); // État pour le popup de la boutique

  // Récupération des infos depuis le contexte
  const { isLoading, quincaillerieDetail } = useAuth();


  return (
    <RoleGuard allowedRole="VENDEUR">
      <NotificationProvider>
        <div className="flex h-screen bg-app-surface w-full relative overflow-hidden">        
        
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:w-64 w-[280px]`}>
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          </div>
          
          {/* Main Content */}
          <main className="flex-1 flex flex-col w-full max-w-full transition-all duration-300 md:ml-0 h-full min-h-screen overflow-y-auto">
            
            {/* Header */}
            <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-app-secondary/10 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden p-2 -ml-2 rounded-lg hover:bg-app-surface text-app-primary transition"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-app-primary rounded-lg flex items-center justify-center shadow-inner">
                    <Store className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black text-lg text-app-primary hidden md:block">
                    {quincaillerieDetail?.name || 'Ma Boutique'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <button className="p-2 rounded-full hover:bg-app-surface text-app-secondary transition-colors md:hidden">
                  <Search className="w-5 h-5" />
                </button>
                
                <button className="relative p-2 rounded-full hover:bg-app-surface transition-colors cursor-pointer">
                  <Bell className="w-6 h-6 md:w-7 md:h-7 text-app-primary" />
                  <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                    3
                  </span>
                </button>
                
                <div className="h-8 w-px bg-app-secondary/20 mx-1 hidden sm:block" />

                {/* ── ZONE DE LA QUINCAILLERIE (POPUP) ── */}
                <div className="relative">
                  {/* Avatar de la boutique cliquable */}
                  <div 
                    onClick={() => setIsStoreMenuOpen(!isStoreMenuOpen)}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="relative h-8 w-8 md:h-9 md:w-9 rounded-xl bg-app-accent/10 text-app-accent flex items-center justify-center font-bold text-sm md:text-base overflow-hidden border border-app-accent/20 transition-all group-hover:bg-app-accent group-hover:text-white">
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : quincaillerieDetail?.name ? (
                        <span>{quincaillerieDetail.name.charAt(0).toUpperCase()}</span>
                      ) : (
                        <Store className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  {/* Calque invisible pour forcer la fermeture au clic à l'extérieur */}
                  {isStoreMenuOpen && (
                    <div 
                      className="fixed inset-0 w-screen h-screen z-40 cursor-default" 
                      onClick={() => setIsStoreMenuOpen(false)}
                    />
                  )}

                  {/* Le Popup des détails de la quincaillerie */}
                  {isStoreMenuOpen && (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-app-surface border border-app-secondary/20 shadow-2xl z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                      
                      {/* Bouton Fermer */}
                      <button 
                        onClick={() => setIsStoreMenuOpen(false)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-app-card/80 backdrop-blur-sm border border-app-secondary/10 text-app-secondary hover:text-app-primary hover:bg-app-surface transition-all z-10 cursor-pointer"
                        title="Fermer"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Header du popup avec nom et statut */}
                      <div className="p-5 pt-8 border-b border-app-secondary/10 bg-app-card/30 relative">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="h-12 w-12 rounded-xl bg-app-accent/10 text-app-accent flex items-center justify-center font-black text-xl shadow-sm shrink-0">
                            {quincaillerieDetail?.name ? quincaillerieDetail.name.charAt(0).toUpperCase() : <Store className="h-6 w-6" />}
                          </div>
                          <div>
                            <p className="font-bold text-app-primary leading-tight line-clamp-1 text-lg">
                              {quincaillerieDetail?.name || 'Boutique'}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`w-2 h-2 rounded-full ${quincaillerieDetail?.status === 'ACTIF' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                              <p className="text-xs text-app-secondary font-medium">
                                {quincaillerieDetail?.status || 'En attente'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Corps du popup avec les infos */}
                      <div className="p-3 space-y-1.5">
                        
                        {/* Adresse complète */}
                        <div className="flex items-start gap-3 px-3 py-2.5 text-sm text-app-primary bg-app-surface rounded-lg">
                          <MapPin className="w-4 h-4 text-app-secondary shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="font-medium">Adresse</span>
                            <span className="text-app-secondary text-xs leading-relaxed">
                              {quincaillerieDetail ? `${quincaillerieDetail.region}, ${quincaillerieDetail.ville}, ${quincaillerieDetail.quartier}` : 'Non renseignée'}
                            </span>
                          </div>
                        </div>

                        {/* Précision */}
                        <div className="flex items-start gap-3 px-3 py-2.5 text-sm text-app-primary bg-app-surface rounded-lg">
                          <Info className="w-4 h-4 text-app-secondary shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <span className="font-medium">Précision</span>
                            <span className="text-app-secondary text-xs line-clamp-2">
                              {quincaillerieDetail?.precision || 'Aucune précision'}
                            </span>
                          </div>
                        </div>

                        {/* Téléphone */}
                        <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-app-primary bg-app-surface rounded-lg">
                          <Phone className="w-4 h-4 text-app-secondary shrink-0" />
                          <span>{quincaillerieDetail?.telephone || 'Non renseigné'}</span>
                        </div>
                        
                      </div>

                      {/* Pied du popup avec boutons d'action */}
                      <div className="p-2 border-t border-app-secondary/10 bg-app-card/30 flex flex-col gap-1">
                        <button 
                          className="flex items-center gap-3 w-full p-2.5 text-sm font-medium text-app-primary hover:bg-app-primary hover:text-white rounded-xl transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                          Gérer la boutique
                        </button>
                        <button 
                          className="flex items-center gap-3 w-full p-2.5 text-sm font-medium text-app-primary hover:bg-app-primary hover:text-white rounded-xl transition-colors cursor-pointer"
                        >
                          <Settings className="w-4 h-4" />
                          Parametre
                        </button>
                      </div>

                    </div>
                  )}
                </div>
                {/* ── FIN ZONE QUINCAILLERIE ── */}

              </div>
            </header>

            {/* Corps de la page */}
            <div className="flex-1 flex flex-col w-full p-4 md:p-6">
              {children}
            </div>
           {/* <VendeurFooter/>*/}
          </main>
        </div>
      </NotificationProvider>
    </RoleGuard>
  );
}