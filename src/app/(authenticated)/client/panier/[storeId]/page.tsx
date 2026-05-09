"use client";

import { use, useState } from 'react';
import { useCart } from '@/src/hooks/CartContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  ChevronLeft, Trash2, MessageSquare, Minus, Plus, Zap, 
  AlertTriangle, CreditCard, Smartphone, Loader2, CheckCircle, XCircle 
} from 'lucide-react';

export default function CartDetailPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = use(params);
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const router = useRouter();

  // ── États existants ──
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; type: 'cart' | 'item'; targetId?: string } | null>(null);
  
  // ── ÉTATS POUR LA SIMULATION DE PAIEMENT (Brixel Pay) ──
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentErrorMsg, setPaymentErrorMsg] = useState('');

  const storeItems = items.filter(item => item.idQuincaillerie === storeId);
  const storeName = storeItems[0]?.storeName.split(' ')[0] || "la boutique";

  const totalQty = storeItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = storeItems.reduce((sum, item) => {
    const price = item.inPromotion && item.pricePromo ? item.pricePromo : item.price;
    return sum + (price * item.quantity);
  }, 0);

  const handleNegotiate = () => {
    let message = `Bonjour 👋, je souhaiterais négocier pour :\n`;
    storeItems.forEach(item => {
      message += `• ${item.productName} (Qté: ${item.quantity})\n`;
    });
    message += `\nTotal estimé : ${totalAmount} FCFA`;
    router.push(`/chat/${storeId}?msg=${encodeURIComponent(message)}`);
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

  // ── LOGIQUE DE SIMULATION DE PAIEMENT ──
  const openPaymentModal = () => {
    setPaymentState('idle');
    setPhoneNumber('');
    setPaymentErrorMsg('');
    setPaymentModalOpen(true);
  };

  const processSimulatedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 9) return;

    // 1. On passe en mode "Chargement/Attente USSD"
    setPaymentState('processing');

    // 2. On simule le délai réseau et l'action du client sur son téléphone (4 secondes)
    setTimeout(() => {
      // 3. Application des "Numéros Magiques" pour les tests
      if (phoneNumber === '600000001') {
        setPaymentState('error');
        setPaymentErrorMsg('Fonds insuffisants. Veuillez recharger votre compte Mobile Money.');
      } else if (phoneNumber === '600000002') {
        setPaymentState('error');
        setPaymentErrorMsg('Paiement annulé. Vous avez refusé la transaction sur votre téléphone.');
      } else {
        // Pour tout autre numéro, on simule un succès
        setPaymentState('success');
      }
    }, 4000); // 4000 millisecondes = 4 secondes
  };

  const handlePaymentSuccessClose = () => {
    // Le paiement a réussi : on vide le panier de cette boutique, on ferme le modal et on redirige
    clearCart(storeId);
    setPaymentModalOpen(false);
    // Redirection vers une page de succès globale ou historique des commandes
    router.push('/client'); 
  };

  if (storeItems.length === 0) return null; 

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-6 bg-app-surface min-h-screen">
      
      {/* Navigation Top */}
      <div className="md:hidden flex items-center justify-between mb-6 md:mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-app-primary bg-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors font-bold text-sm">
          <ChevronLeft className="w-4 h-4" /> Retour
        </button>
        <div className="text-right">
          <p className="text-xs font-bold text-app-secondary uppercase">Panier de</p>
          <h1 className="text-xl md:text-2xl font-black text-app-primary">{storeName}</h1>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        
        {/* ── Zone Liste des Produits ── */}
        <div className="flex-[2.5] w-full space-y-4">
          <div className="flex justify-between items-end mb-4 border-b border-app-secondary/20 pb-3">
            <h2 className="text-lg font-bold text-app-primary flex items-center gap-2">
              Articles <span className="bg-app-primary/10 text-app-primary text-xs px-2 py-0.5 rounded font-bold">{storeItems.length}</span>
            </h2>
            <button 
              onClick={() => setConfirmModal({ isOpen: true, type: 'cart' })}
              className="text-app-secondary hover:text-red-500 text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Vider le panier
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {storeItems.map((item) => {
              const unitPrice = item.inPromotion && item.pricePromo ? item.pricePromo : item.price;
              const subTotal = unitPrice * item.quantity;

              return (
                <div key={item.idPrice} className="bg-white rounded-xl p-3 md:p-4 flex flex-col md:flex-row md:items-center gap-4 shadow-sm border border-transparent hover:border-app-secondary/20 transition-colors">
                  
                  {/* Image Produit */}
                  <div className="relative w-full md:w-24 h-28 md:h-24 shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    <Image src={item.imageUrl || '/placeholder.png'} alt={item.productName} fill className="object-cover" />
                    {item.inPromotion && (
                      <div className="absolute top-1 left-1 bg-app-accent text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1">
                        <Zap className="w-3 h-3" /> PROMO
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-app-primary text-base md:text-lg line-clamp-2 leading-snug mb-1">{item.productName}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-app-secondary">{unitPrice.toLocaleString()} F / unité</span>
                      {item.inPromotion && <span className="text-xs text-app-secondary/50 line-through">{item.price} F</span>}
                    </div>
                  </div>

                  {/* Contrôles & Prix Total */}
                  <div className="flex items-center justify-between md:justify-end gap-6 md:gap-4 md:w-48">
                    <p className="text-lg font-black text-emerald-600 block md:hidden">{subTotal.toLocaleString()} F</p>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                      <div className="flex items-center bg-gray-50 rounded-lg p-0.5 border border-gray-200">
                        <button onClick={() => updateQuantity(item.idPrice, -1)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-white text-app-primary transition-colors cursor-pointer"><Minus className="w-4 h-4" /></button>
                        <span className="w-8 text-center font-bold text-app-primary text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.idPrice, 1)} className="w-8 h-8 flex items-center justify-center rounded hover:bg-white text-app-primary transition-colors cursor-pointer"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button 
                        onClick={() => setConfirmModal({ isOpen: true, type: 'item', targetId: item.idPrice })}
                        className="p-2 text-app-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Prix total (Desktop) */}
                  <div className="hidden md:block w-28 text-right">
                    <p className="text-xl font-black text-emerald-600">{subTotal.toLocaleString()} F</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Zone Devis ── */}
        <div className="w-full xl:w-[380px] xl:sticky xl:top-6">
          <div className="bg-white rounded-2xl border border-app-secondary/10 shadow-lg p-6">
            <h3 className="text-app-primary text-lg font-black mb-6 border-b border-gray-100 pb-4">
              Résumé de la commande
            </h3>
            
            <div className="space-y-4 text-sm font-medium text-app-secondary mb-6">
              <div className="flex justify-between items-end">
                <span>Articles ({totalQty})</span>
                <span className="text-app-primary font-bold">{totalAmount.toLocaleString()} F</span>
              </div>
              <div className="flex justify-between items-end">
                <span>Frais de livraison</span>
                <span className="text-app-accent font-bold text-xs bg-app-accent/10 px-2 py-1 rounded">À négocier</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="text-app-secondary font-bold uppercase text-xs">Total estimé</span>
                <span className="text-3xl font-black text-app-primary">{totalAmount.toLocaleString()} F</span>
              </div>
            </div>

            {/* Nouveau bouton lié au modal de paiement */}
            <button 
              onClick={openPaymentModal} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-base transition-colors flex justify-center items-center gap-2 shadow-md cursor-pointer mb-3"
            >
              <CreditCard className="w-5 h-5" />
              Débuter le paiement
            </button>
            
            <p className="text-center text-[11px] text-app-secondary mb-3 px-2">
              Les frais de livraison et autres détails seront négociés avec la quincaillerie.
            </p>
            
            <button 
              onClick={handleNegotiate} 
              className=" w-full bg-white border border-app-primary text-app-primary hover:bg-app-primary/5 py-3.5 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Négocier sur le Chat
            </button>
          </div>
        </div>

      </div>

      {/* ── MODAL DE PAIEMENT SIMULÉ (Brixel Pay) ── */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-app-primary/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header du Modal */}
            <div className="bg-gray-50 border-b border-gray-100 p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-app-primary rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-lg text-app-primary">Brixel Pay</span>
              </div>
              {paymentState !== 'processing' && paymentState !== 'success' && (
                <button onClick={() => setPaymentModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <XCircle className="w-6 h-6" />
                </button>
              )}
            </div>

            <div className="p-6 md:p-8">
              {/* ÉTAPE 1 : SAISIE (IDLE) */}
              {paymentState === 'idle' && (
                <form onSubmit={processSimulatedPayment} className="space-y-6">
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-black text-app-primary">{totalAmount.toLocaleString()} FCFA</h3>
                    <p className="text-sm text-app-secondary">Paiement Mobile Money (MTN / Orange)</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-app-secondary uppercase tracking-wider">Numéro de téléphone</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="tel" 
                        required
                        placeholder="Ex: 600000000"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl font-bold text-app-primary text-lg focus:outline-none focus:ring-2 focus:ring-app-primary/20 focus:border-app-primary transition-all"
                      />
                    </div>
                    <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-[11px] font-medium mt-3 border border-blue-100">
                      <strong>Astuces de test :</strong><br/>
                      • 600000001 = Échec (Fonds insuffisants)<br/>
                      • 600000002 = Échec (Annulation)<br/>
                      • Tout autre numéro = Succès
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md active:scale-95"
                  >
                    Confirmer et Payer
                  </button>
                </form>
              )}

              {/* ÉTAPE 2 : ATTENTE USSD (PROCESSING) */}
              {paymentState === 'processing' && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-app-primary/20 rounded-full animate-ping"></div>
                    <div className="relative bg-white p-4 rounded-full border-4 border-gray-50 shadow-sm">
                      <Loader2 className="w-12 h-12 text-app-primary animate-spin" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-app-primary mb-2">Validation en cours...</h3>
                    <p className="text-sm text-app-secondary max-w-[250px] mx-auto">
                      Veuillez consulter votre téléphone ({phoneNumber}) et entrer votre code PIN pour valider la transaction.
                    </p>
                  </div>
                </div>
              )}

              {/* ÉTAPE 3A : SUCCÈS (SUCCESS) */}
              {paymentState === 'success' && (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-app-primary mb-1">Paiement Réussi !</h3>
                    <p className="text-sm text-app-secondary">
                      Votre commande chez {storeName} a bien été payée.
                    </p>
                  </div>
                  <button 
                    onClick={handlePaymentSuccessClose}
                    className="w-full bg-app-primary hover:bg-app-primary/90 text-white py-4 rounded-xl font-bold text-base transition-colors mt-4"
                  >
                    Voir mes commandes
                  </button>
                </div>
              )}

              {/* ÉTAPE 3B : ERREUR (ERROR) */}
              {paymentState === 'error' && (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-6 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-2">
                    <XCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-app-primary mb-1">Paiement Échoué</h3>
                    <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                      {paymentErrorMsg}
                    </p>
                  </div>
                  <button 
                    onClick={() => setPaymentState('idle')}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-app-primary py-4 rounded-xl font-bold text-base transition-colors mt-4"
                  >
                    Réessayer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Modal de Confirmation Suppression (Inchangé) ── */}
      {confirmModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-app-primary mb-2">Confirmer la suppression</h3>
            <p className="text-app-secondary text-sm mb-6">
              {confirmModal.type === 'cart' 
                ? "Voulez-vous vraiment vider tout le panier de cette boutique ?"
                : "Voulez-vous retirer cet article de votre panier ?"}
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