'use client';

import { CartProvider } from "@/src/hooks/CartContext";


export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
        <div className="flex min-h-screen bg-app-surface">        
          <main className="flex-1 w-full max-w-full transition-all duration-300">
            <div className="h-full w-full">
              {children}
            </div>
          </main>
        </div>
    </CartProvider>
  );
}