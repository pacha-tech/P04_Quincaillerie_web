"use client";

import { use, useState } from 'react';
import { useCart } from '@/src/hooks/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ChevronLeft, Trash2, MessageSquare, Minus, Plus, Zap, 
  AlertTriangle, Loader2, ShoppingBag, Clock, Store, ArrowRight
} from 'lucide-react';
import { commandeService } from '@/src/services/CommandeService';
import { CommandeResponse } from '@/src/types/CommandeResponse';

export default function CartDetailPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = use(params);
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'cart' | 'item'; targetId?: string } | null>(null);
  
  const [orderConfirmModalOpen, setOrderConfirmModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccessModalOpen, setOrderSuccessModalOpen] = useState(false);
  const [createdOrders, setCreatedOrders] = useState<CommandeResponse[]>([]);

  const storeItems = items.filter(item => item.idQuincaillerie === storeId);
  const storeName = storeItems[0]?.storeName || "La boutique";

  const totalQty = storeItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = storeItems.reduce((sum, item) => {
    const price = item.inPromotion && item.pricePromo ? item.pricePromo : item.price;
    return sum + (price * item.quantity);
  }, 0);

  const handleNegotiate = () => {
    /*
    let message = `Bonjour 👋, je souhaiterais négocier pour :\n`;
    storeItems.forEach(item => {
      message += `• ${item.productName} (Qté: ${item.quantity})\n`;
    });
    message += `\nTotal estimé : ${totalAmount} FCFA`;
    router.push(`/chat/${storeId}?msg=${encodeURIComponent(message)}`);
    */
  };

  const handleConfirmDelete = () => {
    if (!confirmModal) return;
    if (confirmModal.type === 'cart') {
      clearCart(storeId);
      router.back();
    } else if (confirmModal.type === 'item' && confirmModal.targetId) {
      removeItem(confirmModal.targetId);
    }
    setConfirmModal(null);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const response: CommandeResponse[] = await commandeService.passCommand(storeId);
      setCreatedOrders(response);
      setOrderConfirmModalOpen(false); 
      setOrderSuccessModalOpen(true);  
    } catch (error) {
      console.error("Erreur lors de la création de la commande", error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (storeItems.length === 0 && !orderSuccessModalOpen) return null; 

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24 lg:pb-12 pt-5">
      
      {/* ── HEADER PREMIUM "FLOATING ISLAND" ── */}
      <header className="sticky top-4 z-40 mb-8 mx-0 md:mx-2 rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-gray-900/5 transition-all">
        <div className="px-4 md:px-6 h-20 md:h-24 flex items-center justify-between gap-4 bg-gradient-to-r from-white/40 to-transparent rounded-[24px]">
          
          <div className="flex items-center gap-4 md:gap-5">
            {/* Bouton Retour (Mobile uniquement) */}
            <button 
              onClick={() => router.back()} 
              className="md:hidden w-10 h-10 flex items-center justify-center bg-white shadow-sm border border-gray-100 rounded-full text-gray-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>
            
            {/* Infos de la boutique */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Icône plate */}
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-app-primary/10 text-app-primary flex items-center justify-center border border-app-primary/20">
                <Store className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              
              <div className="flex flex-col justify-center">
                <span className="text-[10px] md:text-xs font-black text-app-primary/60 uppercase tracking-[0.15em] mb-0.5">
                  Panier en cours
                </span>
                <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-none tracking-tight truncate max-w-[150px] sm:max-w-[200px] md:max-w-[400px]">
                  {storeName}
                </h1>
              </div>
            </div>
          </div>

          {/* Badge informatif et Bouton Vider tout */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2.5 bg-gray-50/80 px-4 py-2.5 rounded-xl border border-gray-200/60 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-gray-700">
                {storeItems.length} article{storeItems.length > 1 ? 's' : ''}
              </span>
            </div>
            
            <button 
              onClick={() => setConfirmModal({ isOpen: true, type: 'cart' })}
              className="text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 md:px-4 md:py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-transparent hover:border-red-100"
            >
              <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-red-500" />
              <span className="hidden sm:inline">Vider tout</span>
            </button>
          </div>

        </div>
      </header>

      {/* ── CONTENU PRINCIPAL ── */}
      <div className="max-w-full mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
        
        {/* ── COLONNE GAUCHE : LISTE DES ARTICLES ── */}
        <div className="flex-1 w-full">
          <div className="bg-white rounded-2xl border border-gray-200/70 shadow-sm overflow-hidden">
            

            {/* Liste compacte */}
            <div className="divide-y divide-gray-100">
              {storeItems.map((item) => {
                const unitPrice = item.inPromotion && item.pricePromo ? item.pricePromo : item.price;
                const subTotal = unitPrice * item.quantity;

                return (
                  <div key={item.idPrice} className="p-4 md:p-5 flex flex-row items-center gap-4 md:gap-5 hover:bg-gray-50/30 transition-colors">
                    
                    {/* Image Produit */}
                    <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <Image src={item.imageUrl || '/placeholder.png'} alt={item.productName} fill className="object-cover" />
                      {item.inPromotion && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg shadow-sm">
                          <Zap className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Infos Principales */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm md:text-base leading-tight line-clamp-2 mb-1">
                        {item.productName}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-green-600">{unitPrice.toLocaleString()} Fcfa</span>
                        {item.inPromotion && <span className="text-xs text-gray-400 line-through">{item.price} Fcfa</span>}
                      </div>
                    </div>

                    {/* Contrôles de quantité & Total */}
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-3 md:gap-6">
                      
                      {/* Sélecteur de quantité */}
                      <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm h-9">
                        <button onClick={() => updateQuantity(item.idPrice, -1)} className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-l-lg border-r border-gray-100 cursor-pointer">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.idPrice, 1)} className="w-9 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-r-lg border-l border-gray-100 cursor-pointer">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block w-28">
                          <p className="text-base font-black text-green-600">{subTotal.toLocaleString()} Fcfa</p>
                        </div>
                        <button 
                          onClick={() => setConfirmModal({ isOpen: true, type: 'item', targetId: item.idPrice })}
                          className="w-9 h-9 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── COLONNE DROITE : RÉSUMÉ (Maintenu en position fixe) ── */}
        <div className="w-full lg:w-[360px] shrink-0 sticky top-50">
          <div className="bg-white rounded-2xl border border-gray-200/70 shadow-lg shadow-gray-200/40 p-5 md:p-6">
            <h3 className="text-lg font-black text-gray-900 mb-5">Récapitulatif</h3>
            
            <div className="space-y-3.5 text-sm font-medium mb-6">
              <div className="flex justify-between items-center text-gray-600">
                <span>{totalQty} Produit{totalQty > 1 ? 's' : ''}</span>
                <span className="text-green-600 font-bold">{totalAmount.toLocaleString()} Fcfa</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Frais de livraison</span>
                <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-xs font-bold border border-orange-100">À définir</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Montant total estimé</span>
                <span className="text-3xl font-black text-green-600 leading-none">{totalAmount.toLocaleString()} Fcfa</span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => setOrderConfirmModalOpen(true)} 
                className="w-full bg-app-primary hover:bg-app-primary/90 text-white h-12 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 shadow-sm active:scale-[0.98] cursor-pointer"
              >
                Passer la commande <ArrowRight className="w-4 h-4" />
              </button>
              
              <button 
                onClick={handleNegotiate} 
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 h-12 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2 shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-app-primary" />
                Négocier avec le vendeur
              </button>
            </div>
            
            <div className="mt-5 bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 flex gap-3 items-start">
              <AlertTriangle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-500 leading-tight">
                La commande sera envoyée à la quincaillerie. Vous paierez une fois la disponibilité et la livraison confirmées.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── MODAL DE CONFIRMATION DE COMMANDE ── */}
      {orderConfirmModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[24px] p-6 max-w-[400px] w-full shadow-2xl relative">
            <div className="w-12 h-12 bg-app-primary/10 text-app-primary rounded-2xl flex items-center justify-center mb-5 border border-app-primary/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Confirmer la commande</h3>
            
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Vous êtes sur le point d'envoyer votre demande de commande à <span className="font-bold text-gray-900">{storeName}</span> pour un total de <span className="font-bold text-gray-900">{totalQty} article(s)</span>.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex justify-between items-center">
              <span className="text-sm font-bold text-gray-500">Montant estimé</span>
              <span className="text-lg font-black text-green-600">{totalAmount.toLocaleString()} FCFA</span>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setOrderConfirmModalOpen(false)} 
                disabled={isPlacingOrder}
                className="flex-1 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 cursor-pointer"
              >
                Annuler
              </button>
              <button 
                onClick={handlePlaceOrder} 
                disabled={isPlacingOrder}
                className="flex-[1.5] py-3 bg-app-primary hover:bg-app-primary/90 text-white rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {isPlacingOrder ? <><Loader2 className="w-4 h-4 animate-spin" /> Envoi...</> : 'Oui, Commander'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL DE SUCCÈS ── */}
      {orderSuccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in zoom-in">
          <div className="bg-white rounded-[24px] p-8 max-w-[400px] w-full shadow-2xl text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-5">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Demande envoyée !</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              <span className="font-bold text-gray-900">{storeName}</span> a bien reçu votre demande. Elle vérifiera la disponibilité avant de vous envoyer une facture pour le paiement.
            </p>
            
            <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 mb-8 text-left">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Références</span>
              <div className="flex flex-col gap-1.5">
                {createdOrders.map(cmd => (
                  <div key={cmd.idCommande} className="text-xs font-mono font-medium text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm">
                    #{cmd.idCommande.substring(0, 12).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => {
                clearCart(storeId);
                setOrderSuccessModalOpen(false);
                router.push('/client/commande');
              }}
              className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold shadow-md transition-all active:scale-[0.98] text-sm cursor-pointer"
            >
              Suivre mes commandes
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL DE SUPPRESSION ── */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-6 max-w-[360px] w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-500 text-sm mb-6">
              {confirmModal.type === 'cart' 
                ? "Êtes-vous sûr de vouloir vider l'intégralité de ce panier ?"
                : "Voulez-vous retirer cet article de votre liste ?"}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-bold text-sm transition-colors border border-gray-200 cursor-pointer"
              >
                Annuler
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors shadow-sm cursor-pointer"
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