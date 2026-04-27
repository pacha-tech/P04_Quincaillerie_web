'use client';

import SideBar from "@/src/components/ui/SideBar";
import { CartProvider } from "@/src/hooks/CartContext";
import { LocationProvider } from "@/src/hooks/LocationContext";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
        <div className="flex min-h-screen bg-app-surface">        
          <SideBar/>
          <main className="flex-1 w-full max-w-full transition-all duration-300 md:ml-64">
            <div className="h-full w-full">
              {children}
            </div>
          </main>
        </div>
      </CartProvider>
  );
}