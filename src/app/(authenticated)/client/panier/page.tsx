"use client";

import { useState } from 'react';
import { useCart } from '@/src/hooks/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Trash2, Store, Sparkles, ShoppingBag, ArrowRight, 
  AlertTriangle, Receipt, CreditCard, ChevronRight, 
  Loader2, X, CheckCircle2, Smartphone, Clock, PackageCheck
} from 'lucide-react';
import { commandeService } from '@/src/services/CommandeService';
import { CommandeResponse } from '@/src/types/CommandeResponse';


export default function CartOverviewPage() {
  const { items, clearCart, clearAll } = useCart();
  const router = useRouter();

  
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'all' | 'cart'; targetId?: string } | null>(null);
  
  
  const [orderConfirmModalOpen, setOrderConfirmModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [createdOrders, setCreatedOrders] = useState<CommandeResponse[]>([]);


  
  const groupedCarts = items.reduce((acc, item) => {
    if (!acc[item.idQuincaillerie]) acc[item.idQuincaillerie] = [];
    acc[item.idQuincaillerie].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  
  const handleConfirmDelete = () => {
    if (!confirmModal) return;
    if (confirmModal.type === 'all') {
      clearAll();
    } else if (confirmModal.type === 'cart' && confirmModal.targetId) {
      clearCart(confirmModal.targetId);
    }
    setConfirmModal(null);
  };

  
  const cartsArray = Object.entries(groupedCarts).map(([id, storeItems]) => {
    const name = storeItems[0]?.storeName || "Boutique";
    const qty = storeItems.length;
    const total = storeItems.reduce((sum, item) => {
      const price = item.inPromotion && item.pricePromo ? item.pricePromo : item.price;
      return sum + (price * item.quantity);
    }, 0);
    return { id, name, items: storeItems, qty, total };
  });

  cartsArray.sort((a, b) => b.total - a.total);
  const grandTotal = cartsArray.reduce((sum, cart) => sum + cart.total, 0);
  const storeCount = cartsArray.length;
  const totalItemsCount = cartsArray.reduce((sum, cart) => sum + cart.qty, 0);

  
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {

      const response: CommandeResponse[] = await commandeService.passCommand(null);
      
      setCreatedOrders(response);
      setOrderConfirmModalOpen(false);
    
      clearAll();

    } catch (error) {
      console.error("Erreur lors de la création de la commande", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };


  // ── ÉTAT VIDE ──
  if (storeCount === 0 && createdOrders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-app-surface border border-app-secondary/10 rounded-full flex items-center justify-center shadow-sm mb-6">
           <ShoppingBag className="w-10 h-10 text-app-primary opacity-30" />
        </div>
        <h2 className="text-2xl font-black text-app-primary mb-2">Votre espace est vide</h2>
        <p className="text-app-secondary max-w-sm mb-8">Commencez à explorer nos quincailleries partenaires pour préparer vos commandes.</p>
        <button onClick={() => router.push('/client')} className="bg-app-primary text-white px-8 py-3.5 rounded-xl font-bold shadow-md hover:bg-app-primary/90 transition-all active:scale-95">
          Découvrir les boutiques
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 pb-28 lg:pb-6 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative">
      
      {/* ── COLONNE GAUCHE (Contenu Principal) ── */}
      {/* Le contenu des paniers s'affiche seulement si on a pas encore commandé */}
      {storeCount > 0 && (
        <div className="flex-1 w-full space-y-6">
          {/* Bannière Hero */}
          <div className="relative overflow-hidden bg-app-primary rounded-2xl p-5 md:px-7 md:py-6 flex flex-row items-start sm:items-center justify-between gap-1 md:gap-4 shadow-sm">
            <div className="absolute top-[-50%] right-[-10%] w-48 h-48 bg-app-accent/20 blur-3xl rounded-full pointer-events-none"></div>
            <div className="relative z-10 flex flex-col gap-1">
              <div className="inline-flex items-center gap-1.5 text-app-accent text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Paniers en cours
              </div>
              <h1 className="text-xl md:text-3xl font-black text-white leading-tight">
                Gérez vos matériaux
              </h1>
            </div>
            <button onClick={() => setConfirmModal({ isOpen: true, type: 'all' })} className="hidden md:flex relative z-10 flex-row items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl transition-colors font-medium border border-red-500/20 text-sm">
              <Trash2 className="w-4 h-4" /> Tout purger
            </button>
          </div>

          {/* Grille des Boutiques */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 md:gap-6">
            {cartsArray.map((cart) => (
              <div key={cart.id} className="bg-white rounded-[24px] border border-gray-200/70 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
                <div className="p-6 pb-4 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-app-surface text-app-primary rounded-2xl flex items-center justify-center shadow-inner border border-gray-100">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-app-primary text-xl leading-tight line-clamp-1">{cart.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-app-secondary rounded-md text-xs font-semibold">
                          {cart.qty} article{cart.qty > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setConfirmModal({ isOpen: true, type: 'cart', targetId: cart.id })} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <p className="text-sm text-app-secondary line-clamp-1 font-medium">
                    {cart.items.map(i => i.productName).join(', ')}
                  </p>
                </div>
                <div className="p-5 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-app-secondary uppercase tracking-wider mb-0.5">Sous-total</span>
                    <span className="text-xl font-black text-emerald-600 leading-none">
                      {cart.total.toLocaleString()} Fcfa
                    </span>
                  </div>
                  <Link href={`/client/panier/${cart.id}`}>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-app-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-app-primary/90 hover:shadow-md transition-all active:scale-95">
                      Ouvrir <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── COLONNE DROITE : RÉSUMÉ FIXE (Desktop) ── */}
      {storeCount > 0 && (
        <div className="hidden lg:block w-[360px] shrink-0">
          <div className="sticky top-24 bg-white border border-gray-200/70 rounded-[24px] p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="p-2.5 bg-app-primary/5 rounded-xl text-app-primary">
                <Receipt className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-black text-app-primary">Résumé global</h2>
            </div>
            <div className="pt-2 border-t border-gray-100 mt-2">
              <div className="flex flex-col mb-6">
                <span className="text-sm font-bold text-app-secondary uppercase tracking-wider mb-1">Total estimé</span>
                <span className="text-3xl font-black text-emerald-600 leading-none">
                  {grandTotal.toLocaleString()} Fcfa
                </span>
              </div>
              
             <button 
                onClick={() => setOrderConfirmModalOpen(true)}
                className="w-full flex justify-center items-center gap-2 bg-app-primary text-white py-4 rounded-xl font-bold shadow-md hover:bg-app-primary/90 transition-all active:scale-95 text-lg"
              >
                <ShoppingBag className="w-5 h-5" /> Passer la commande
              </button>
            </div>
          </div>
        </div>
      )}

  
      {storeCount > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-40 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-app-primary leading-tight">
              {grandTotal.toLocaleString()} F
            </span>
          </div>
          <button onClick={() => setOrderConfirmModalOpen(true)} className="bg-app-primary text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform">
             Commander <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}


      {orderConfirmModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative">
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-5">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-app-primary mb-2">Passer la commande ?</h3>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
              <p className="text-app-secondary text-sm leading-relaxed font-medium">
                Vous allez commander <span className="font-bold text-app-primary">{totalItemsCount} produit(s)</span>.
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-500 uppercase">Total</span>
                <span className="text-lg font-black text-app-primary">{grandTotal.toLocaleString()} FCFA</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setOrderConfirmModalOpen(false)} 
                disabled={isPlacingOrder}
                className="px-5 py-3 text-app-primary bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button 
                onClick={handlePlaceOrder} 
                disabled={isPlacingOrder}
                className="px-5 py-3 bg-app-primary hover:bg-app-primary/90 text-white rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
              >
                {isPlacingOrder ? <><Loader2 className="w-4 h-4 animate-spin" /> Création...</> : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}


      {orderSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in zoom-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-app-primary mb-1">Demande envoyée !</h3>
            <p className="text-app-secondary text-sm mb-6">
              Vos quincailleries ont été notifiées. Elles vérifieront la disponibilité de vos articles avant de vous inviter au paiement.
            </p>
            
            <div className="w-full bg-gray-50/80 border border-gray-100 rounded-2xl p-4 mb-6 text-left">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Suivi des commandes</span>
              <div className="flex flex-col gap-2">
                {createdOrders.map(cmd => (
                  <div key={cmd.idCommande} className="text-xs font-mono bg-white p-2 rounded-lg border border-gray-200">
                    #{cmd.idCommande.substring(0, 12).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => router.push('/client/commande')}
              className="w-full py-3.5 bg-app-primary text-white rounded-xl font-bold shadow-md hover:bg-app-primary/90 transition-all active:scale-95 text-sm"
            >
              Voir mes commandes
            </button>
          </div>
        </div>
      )}

      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-app-primary mb-2">Confirmer la suppression ?</h3>
            <p className="text-app-secondary text-sm mb-6">
              {confirmModal.type === 'all' 
                ? "Voulez-vous vider tous vos paniers ?" 
                : "Voulez-vous retirer tous les articles de cette boutique ?"}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal(null)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold"
              >
                Annuler
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-bold"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}