"use client";

import { useState } from 'react';
import { useCart } from '@/src/hooks/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Store, Sparkles, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';

export default function CartOverviewPage() {
  const { items, clearCart, clearAll } = useCart();
  const router = useRouter();

  // ── État pour le Popup de confirmation ──
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'all' | 'cart'; targetId?: string } | null>(null);

  const groupedCarts = items.reduce((acc, item) => {
    if (!acc[item.idQuincaillerie]) acc[item.idQuincaillerie] = [];
    acc[item.idQuincaillerie].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  // Action confirmée depuis le popup
  const handleConfirmDelete = () => {
    if (!confirmModal) return;
    if (confirmModal.type === 'all') {
      clearAll();
    } else if (confirmModal.type === 'cart' && confirmModal.targetId) {
      clearCart(confirmModal.targetId);
    }
    setConfirmModal(null);
  };

  // ── ÉTAT VIDE ──
  if (Object.keys(groupedCarts).length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-app-card border border-app-secondary/10 rounded-full flex items-center justify-center shadow-lg mb-6">
           <ShoppingBag className="w-10 h-10 text-app-primary opacity-50" />
        </div>
        <h2 className="text-2xl font-black text-app-primary mb-2">Panier vide</h2>
        <p className="text-app-secondary max-w-sm mb-6">Votre espace de commande est prêt, il ne manque plus que vos matériaux.</p>
        <button onClick={() => router.push('/client')} className="bg-app-primary text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-app-primary/90 transition-colors">
          Découvrir les boutiques
        </button>
      </div>
    );
  }

  // ── ÉTAT REMPLI ──
  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 space-y-6">
      
      {/* ── Bannière Hero (Hauteur Réduite) ── */}
      <div className="relative overflow-hidden bg-app-primary rounded-2xl p-6 md:p-8 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-app-accent/20 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 text-app-accent rounded-md text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3" /> Espace Panier
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Vos paniers en cours
          </h1>
          <p className="text-white/80 mt-1 text-sm">
            {Object.keys(groupedCarts).length} boutique(s) en attente.
          </p>
        </div>

        <button 
          onClick={() => setConfirmModal({ isOpen: true, type: 'all' })}
          className="relative z-10 flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2.5 rounded-lg transition-colors font-bold border border-red-500/20 text-sm"
        >
          <Trash2 className="w-4 h-4" /> 
          Purger tout
        </button>
      </div>

      {/* ── Grille des Boutiques (Animations adoucies) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Object.entries(groupedCarts).map(([idQuincaillerie, storeItems]) => {
          const storeName = storeItems[0]?.storeName.split(' ')[0] || "Boutique";
          const totalQty = storeItems.length;
          const totalAmount = storeItems.reduce((sum, item) => {
            const price = item.inPromotion && item.pricePromo ? item.pricePromo : item.price;
            return sum + (price * item.quantity);
          }, 0);

          return (
            <div key={idQuincaillerie} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-app-secondary/10 flex flex-col overflow-hidden">
              
              {/* Header */}
              <div className="p-5 flex justify-between items-start border-b border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-app-primary/5 text-app-primary rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-app-primary text-lg leading-none">{storeName}</h3>
                    <p className="text-xs font-semibold text-app-secondary/70 mt-1">{totalQty} article(s)</p>
                  </div>
                </div>
                <button 
                  onClick={() => setConfirmModal({ isOpen: true, type: 'cart', targetId: idQuincaillerie })}
                  className="p-2 text-app-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Supprimer ce panier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Images Preview */}
              <div className="p-5 flex-1">
                <div className="flex items-center -space-x-2 mb-3">
                  {storeItems.slice(0, 4).map((item, i) => (
                    <div key={i} className="relative w-12 h-12 rounded-lg border-2 border-white overflow-hidden bg-gray-100 shadow-sm z-10">
                      <Image src={item.imageUrl || '/placeholder.png'} alt={item.productName} fill className="object-cover" />
                    </div>
                  ))}
                  {storeItems.length > 4 && (
                    <div className="relative w-12 h-12 rounded-lg border-2 border-white bg-app-primary/5 flex items-center justify-center text-xs font-bold text-app-primary z-0">
                      +{storeItems.length - 4}
                    </div>
                  )}
                </div>
                <p className="text-xs text-app-secondary line-clamp-1">
                  {storeItems.map(i => i.productName).join(', ')}
                </p>
              </div>

              {/* Footer avec bouton clair */}
              <div className="p-5 bg-gray-50 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-app-secondary uppercase block">Total estimé</span>
                  <span className="text-lg font-black text-emerald-600">{totalAmount.toLocaleString()} F</span>
                </div>
                
                <Link href={`/client/panier/${idQuincaillerie}`}>
                  <button className="bg-app-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-app-primary/90 transition-colors shadow-sm">
                    Détails <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Modal de Confirmation (Custom Popup) ── */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-app-primary mb-2">Confirmer la suppression</h3>
            <p className="text-app-secondary text-sm mb-6">
              {confirmModal.type === 'all' 
                ? "Êtes-vous sûr de vouloir vider l'intégralité de vos paniers ? Cette action est irréversible."
                : `Êtes-vous sûr de vouloir supprimer ce panier de la boutique ?`}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 text-app-primary hover:bg-gray-100 rounded-lg font-bold text-sm transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-colors"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}