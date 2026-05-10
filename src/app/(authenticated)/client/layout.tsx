'use client';

import { useState } from 'react';
import { 
  Menu, X, Bell, Search, User, Loader2, 
  Settings, Edit3, Mail, Phone, Shield 
} from 'lucide-react';
import SideBar from '@/src/components/ui/SideBar';
import RoleGuard from '@/src/components/ui/RoleGuard';
import SearchBar from '@/src/components/ui/client/SearchBar';
import { useCart } from '@/src/hooks/CartContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/src/hooks/AuthContext';
import ClientFooter from '@/src/components/ui/client/ClientFooter';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Nouvel état pour le menu profil
  
  const { items } = useCart();
  const { userInfos, isLoading } = useAuth();
  const pathname = usePathname();

  const isHomePage = pathname === '/client';
  const isSearchPage = pathname === '/client/search';

  return (
    <RoleGuard allowedRole="CLIENT">
      <div className="flex h-screen overflow-hidden bg-app-surface relative">
        
        <div className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:w-64 w-[280px]`}>
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 overflow-y-auto relative">
          
          {/* En-tête (AppBar) Client */}
          <header className="sticky top-0 z-40 bg-app-surface/95 backdrop-blur-xl px-4 md:px-6 py-3 border-b border-app-secondary/20 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Bouton pour ouvrir la sidebar sur mobile */}
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 bg-app-surface border border-app-secondary/20 rounded-xl lg:hidden text-app-primary hover:bg-app-accent hover:text-white transition-all cursor-pointer"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <div className="text-center lg:text-left">
                <h1 className="text-lg md:text-xl font-black text-app-primary tracking-tight">
                  Brixel <span className="text-transparent bg-clip-text bg-gradient-to-r from-app-accent to-blue-500">Client</span>
                </h1>
              </div>
            </div>

            {isHomePage && (
              <div className="hidden md:block flex-1 max-w-md mx-4">
                <SearchBar />
              </div>
            )}

            {isSearchPage && (
              <div className="hidden md:block flex-1 max-w-md mx-4">
                <SearchBar />
              </div>
            )}

            {/* Éléments de droite */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl border border-app-secondary/20 bg-app-surface hover:bg-app-card transition-all cursor-pointer">
                <Bell className="h-4 w-4 text-app-primary" />
              </button>
              <div className="h-8 w-px bg-app-secondary/20 mx-1 hidden sm:block" />
              
              {/* ZONE DU PROFIL */}
              <div className="relative">
                {/* Avatar cliquable */}
                <div 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 pl-1 cursor-pointer group"
                >
                  <div className="relative h-8 w-8 rounded-xl bg-app-accent/10 text-app-accent flex items-center justify-center font-bold text-xs overflow-hidden border border-app-accent/20 transition-all group-hover:bg-app-accent group-hover:text-white">
                    {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                      ) : userInfos?.name ? (
                          <span>{userInfos.name.charAt(0).toUpperCase()}</span>
                      ) : (
                          <User className="h-4 w-4" />
                      )}
                  </div>
                </div>

                {/* Calque invisible CORRIGÉ pour forcer la fermeture au clic à l'extérieur */}
                {isProfileOpen && (
                  <div 
                    className="fixed inset-0 w-screen h-screen z-40 cursor-default" 
                    onClick={() => setIsProfileOpen(false)}
                  />
                )}

                {/* Le Popup (Menu déroulant) */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-app-surface border border-app-secondary/20 shadow-2xl z-50 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* ── NOUVEAU : BOUTON FERMER (CROIX) ── */}
                    <button 
                      onClick={() => setIsProfileOpen(false)}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-app-card/80 backdrop-blur-sm border border-app-secondary/10 text-app-secondary hover:text-app-primary hover:bg-app-surface transition-all z-10 cursor-pointer"
                      title="Fermer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Header du popup avec nom et email */}
                    {/* J'ai ajouté 'pt-8' pour laisser de la place à la croix en haut */}
                    <div className="p-5 pt-8 border-b border-app-secondary/10 bg-app-card/30 relative">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="h-10 w-10 rounded-xl bg-app-accent/10 text-app-accent flex items-center justify-center font-bold text-lg shadow-sm">
                          {userInfos?.name ? userInfos.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-app-primary leading-tight line-clamp-1">{userInfos?.name || 'Utilisateur'}</p>
                          <p className="text-xs text-app-secondary font-medium">@{userInfos?.role?.toLowerCase() || 'client'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Corps du popup avec les infos */}
                    <div className="p-3 space-y-1">
                      <div className="flex items-center gap-3 px-3 py-2 text-sm text-app-primary bg-app-surface rounded-lg">
                        <Mail className="w-4 h-4 text-app-secondary shrink-0" />
                        <span className="line-clamp-1">{userInfos?.email || 'Non renseigné'}</span>
                      </div>
                      <div className="flex items-center gap-3 px-3 py-2 text-sm text-app-primary bg-app-surface rounded-lg">
                        <Phone className="w-4 h-4 text-app-secondary shrink-0" />
                        <span>{userInfos?.phone || 'Non renseigné'}</span>
                      </div>
                    </div>

                    {/* Pied du popup avec les boutons d'action */}
                    <div className="p-2 border-t border-app-secondary/10 bg-app-card/30 flex flex-col gap-1">
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm font-medium text-app-primary hover:bg-app-primary hover:text-white rounded-xl transition-colors cursor-pointer">
                        <Edit3 className="w-4 h-4" />
                        Modifier le profil
                      </button>
                      <button className="flex items-center gap-3 w-full p-2.5 text-sm font-medium text-app-primary hover:bg-app-primary hover:text-white rounded-xl transition-colors cursor-pointer">
                        <Settings className="w-4 h-4" />
                        Paramètres
                      </button>
                    </div>

                  </div>
                )}
              </div>
              {/* FIN ZONE DU PROFIL */}

            </div>
          </header>

          {/* Sous-barre de recherche pour version mobile */}
          {isHomePage && (
            <div className="px-4 py-2 bg-app-surface border-b border-app-secondary/10 md:hidden">
              <SearchBar />
            </div>
          )}
          
          {/* Corps de la page */}
          <main className="flex-1 overflow-y-auto space-y-8">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
              {children}
            </div>
            {/*<ClientFooter/>*/}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}