'use client';

import { useState } from 'react';
import { Menu, X, ShoppingCart, Bell, Search, User } from 'lucide-react';
import SideBar from '@/src/components/ui/SideBar';
import RoleGuard from '@/src/components/ui/RoleGuard';
import SearchBar from '@/src/components/ui/client/SearchBar';
import { useCart } from '@/src/hooks/CartContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { items } = useCart();
  const pathname = usePathname();


  const isHomePage = pathname === '/client';

  return (
    <RoleGuard allowedRole="CLIENT">
      <div className="flex h-screen overflow-hidden bg-app-surface relative">
        
        <div className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:w-64 w-[280px]`}>
            <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          
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

            {/* Éléments de droite (Panier, Notifications, Profil) */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-xl border border-app-secondary/20 bg-app-surface hover:bg-app-card transition-all cursor-pointer">
                <Bell className="h-4 w-4 text-app-primary" />
              </button>
              <div className="h-8 w-px bg-app-secondary/20 mx-1 hidden sm:block" />
              <div className="flex items-center gap-2 pl-1 cursor-pointer group">
                <div className="h-8 w-8 rounded-xl bg-app-accent/10 text-app-accent flex items-center justify-center font-bold text-xs">
                  C
                </div>
                <span className="text-xs font-bold text-app-primary hidden sm:block group-hover:text-app-accent transition-colors">Mon Compte</span>
              </div>
            </div>
          </header>

          {/* Sous-barre de recherche pour version mobile */}
          {isHomePage && (
            <div className="px-4 py-2 bg-app-surface border-b border-app-secondary/10 md:hidden">
            <SearchBar />
          </div>
          )}
          
          {/* Corps de la page */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}