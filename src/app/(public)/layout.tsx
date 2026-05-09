import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { LocationProvider } from "@/src/hooks/LocationContext";
import GuestGuard from "@/src/components/ui/GuestGuard";
import { CartProvider } from "@/src/hooks/CartContext";
import SearchBar from "@/src/components/ui/client/SearchBar";

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    
      <GuestGuard>
        
          <div className="flex flex-col min-h-screen bg-app-surface font-sans text-app-primary selection:bg-app-accent/20">
          
          
            <header className="sticky top-0 z-50 h-20 bg-app-surface/80 backdrop-blur-md border-b border-app-primary/5 flex items-center justify-between px-4 md:px-8 transition-all">
              

              <Link href="/" className="flex items-center gap-2 mr-4 md:mr-8 group">
                <div className="w-10 h-10 bg-app-primary rounded-xl flex items-center justify-center shadow-md transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <span className="text-white text-lg font-bold -rotate-3 group-hover:rotate-0 transition-transform duration-300">BX</span>
                </div>
                <span className="hidden sm:block text-xl font-black tracking-tight text-app-primary">
                  Brixel
                </span>
              </Link>
              

              <div className="flex-1 max-w-2xl px-2 md:px-4">
                <SearchBar />
              </div>


              <div className="flex items-center gap-2 md:gap-4 ml-4 md:ml-8">
                

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