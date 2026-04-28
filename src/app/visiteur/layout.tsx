import SearchBar from "../../components/ui/client/SearchBar";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { LocationProvider } from "@/src/hooks/LocationContext";
import GuestGuard from "@/src/components/ui/GuestGuard";
import { CartProvider } from "@/src/hooks/CartContext";

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    // On met le fond de l'application en app-surface
    <CartProvider>
      <GuestGuard>
      <div className="flex flex-col min-h-screen bg-app-surface">
        
        {/* Navbar Boutique */}
        <header className="h-16 border-b border-app-secondary/10 flex items-center justify-between px-8 bg-app-card sticky top-0 z-50 shadow-sm">
          <Link href="/">
            {/* Utilisation de ton accent (E94560) */}
            <h1 className="text-xl font-bold text-app-accent mr-8 cursor-pointer tracking-wider">
              BRIXEL
            </h1>
          </Link>
          
          <div className="flex-1 max-w-2xl px-4">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4 ml-8">
            <button className="text-app-text-secondary hover:text-app-accent transition-colors">
              <ShoppingCart size={22} />
            </button>
            <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-app-text-primary hover:bg-app-surface p-2 rounded-lg transition-colors">
              <User size={20} />
              <span>Connexion</span>
            </Link>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-6">
          {children}
        </main>
      </div>  
    </GuestGuard>
    </CartProvider>
  );
}