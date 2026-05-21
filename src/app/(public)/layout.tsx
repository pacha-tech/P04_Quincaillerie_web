"use client";

import Link from "next/link";
import { ShoppingCart, User, Loader2, MapPin } from "lucide-react"; 
import { useLocation } from "@/src/hooks/LocationContext";
import GuestGuard from "@/src/components/ui/GuestGuard";
import { CartProvider } from "@/src/hooks/CartContext";
import SearchBar from "@/src/components/ui/client/SearchBar";

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  const { latitude, longitude, loading: locationLoading, error: locationError, requestLocation } = useLocation();
  
  return (
    <GuestGuard>
      <div className="flex flex-col min-h-screen bg-app-surface font-sans text-app-primary selection:bg-app-accent/20">
        
        <header className="sticky top-0 z-50 h-20 bg-app-surface/80 backdrop-blur-md border-b border-app-primary/5 flex items-center justify-between px-4 md:px-8 transition-all">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-4 md:mr-8 group">
            <div className="w-10 h-10 bg-app-primary rounded-xl flex items-center justify-center shadow-md transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
              <span className="text-white text-lg font-bold -rotate-3 group-hover:rotate-0 transition-transform duration-300">BX</span>
            </div>
            <span className="hidden sm:block text-xl font-black tracking-tight text-app-primary">
              Brixel
            </span>
          </Link>
          
          {/* Barre de recherche centrale */}
          <div className="flex-1 max-w-2xl px-2 md:px-4">
            <SearchBar />
          </div>

          {/* Éléments de droite */}
          <div className="flex items-center gap-2 md:gap-4 ml-4 md:ml-8">
            
            {/* ── INDICATEUR GPS INTEGRÉ POUR LES VISITEURS ── */}
            {locationLoading ? (
              <div className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full bg-app-surface border border-app-primary/5 text-app-secondary text-xs font-bold animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Recherche...</span>
              </div>
            ) : locationError ? (
              <button 
                onClick={() => requestLocation(true)}
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors cursor-pointer text-xs font-bold"
                title="Erreur GPS - Cliquez pour réessayer"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Erreur GPS</span>
              </button>
            ) : latitude && longitude ? (
              <div 
                className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100 text-xs font-bold" 
                title="Position acquise avec succès"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Position active</span>
              </div>
            ) : null}
            {/* ── FIN INDICATEUR GPS ── */}

            {/* Bouton Connexion */}
            <Link 
              href="/login" 
              className="flex items-center gap-2 h-10 px-4 rounded-full text-sm font-bold text-app-primary bg-app-card border border-app-primary/5 hover:bg-app-primary/5 transition-all shadow-sm active:scale-95"
            >
              <User size={18} />
              <span className="hidden md:block">Connexion</span>
            </Link>

          </div>
        </header>

        <main className="flex-1 w-full mx-auto p-6 md:p-8 pt-8 md:pt-12">
          {children}
        </main>
      
      </div>  
    </GuestGuard>
  );
}