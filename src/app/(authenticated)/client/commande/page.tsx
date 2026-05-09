"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Package, Clock, CheckCircle, Search, 
  AlertCircle, Store, X, ArrowLeft, Filter, ArrowUpDown, Download, Smartphone, CreditCard, Loader2,
  RefreshCw, Key, Truck, Star // <-- Ajout de Star ici
} from 'lucide-react';
import { commandeService } from '@/src/services/CommandeService';
import { Commande } from '@/src/types/Commande';
import { CommandeDetail } from '@/src/types/CommandeDetail';
import { useCommande } from '@/src/hooks/CommandeContext';
import { StatutCommande } from '@/src/utils/StatutCommande';
import { paiementService } from '@/src/services/PaiementService';
import toast from 'react-hot-toast';
import { otpService } from '@/src/services/OtpService';

const formatDate = (dateString: string) => {
  if (!dateString) return "Date inconnue";
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case StatutCommande.EN_ATTENTE_VALIDATION:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 uppercase">
          <Clock size={12} /> À Valider
        </span>
      );
    case StatutCommande.EN_ATTENTE_PAIEMENT:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold border border-orange-200 uppercase">
          <Smartphone size={12} /> À Payer
        </span>
      );
    case StatutCommande.PAYEE:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold border border-blue-200 uppercase">
          <CheckCircle size={12} /> Payée
        </span>
      );
    case StatutCommande.LIVREE:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200 uppercase">
          <Truck size={12} /> Livrée
        </span>
      );
    case StatutCommande.ANNULEE:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-bold border border-red-200 uppercase">
          <X size={12} /> Annulée
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold border border-gray-200 uppercase">
          <Package size={12} /> {status}
        </span>
      );
  }
};

// --- COMPOSANTS D'ÉTAT ET SKELETONS ---

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 w-full">
    <div className="bg-slate-50 p-4 rounded-full mb-4">
      <Package size={48} className="text-slate-300" />
    </div>
    <h3 className="text-lg font-bold text-slate-800">Aucune commande trouvée</h3>
    <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">
      Il semble que vous n'ayez pas encore passé de commande ou que le filtre soit trop restrictif.
    </p>
    <Link href="/client" className="px-6 py-2.5 bg-app-accent text-white rounded-full font-bold text-sm hover:shadow-lg transition-all">
      Commencer mes achats
    </Link>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 rounded-3xl border border-red-100 w-full">
    <AlertCircle size={40} className="text-red-500 mb-4" />
    <h3 className="text-red-800 font-bold">Oups ! Une erreur est survenue</h3>
    <p className="text-red-600/70 text-xs mb-6 text-center px-4">{message}</p>
    <button 
      onClick={onRetry}
      className="flex items-center gap-2 px-6 py-2 bg-white border border-red-200 text-red-600 rounded-full font-bold text-sm hover:bg-red-50 transition-all shadow-sm"
    >
      <Loader2 size={16} className="animate-spin-slow" /> Réessayer la connexion
    </button>
  </div>
);

const OrderListSkeleton = () => (
  <div className="space-y-4 w-full">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between gap-4 animate-pulse">
        <div className="flex items-center gap-4 w-full">
          <div className="h-12 w-12 rounded-xl bg-gray-200 shrink-0" />
          <div className="space-y-2 w-full max-w-[200px]">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-full" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const OrderDetailsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex justify-between items-start pb-3 border-b border-gray-50 last:border-0 animate-pulse">
        <div className="space-y-2 w-full max-w-[150px]">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-2/3" />
        </div>
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

// --- COMPOSANT PRINCIPAL ---

export default function MyOrdersPage() {
  const { commandes, isFetching, refresh, error } = useCommande();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'DESC' | 'ASC'>('DESC'); 

  const [selectedOrder, setSelectedOrder] = useState<Commande | null>(null);
  const [lines, setLines] = useState<CommandeDetail[]>([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  // États pour le paiement
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [operator, setOperator] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // États pour l'OTP
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [otpData, setOtpData] = useState<{ code: string, expiredAt: string } | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // Nouveaux états pour la notation (Avis)
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const processedOrders = useMemo(() => {
    let result = [...commandes];
    if (filterStatus !== 'ALL') {
      result = result.filter(order => order.statut === filterStatus);
    }
    result.sort((a, b) => {
      const dateA = new Date(a.dateCommande).getTime();
      const dateB = new Date(b.dateCommande).getTime();
      return sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [commandes, filterStatus, sortOrder]);

  useEffect(() => { refresh(); }, []);

  // GESTION DU MINUTEUR OTP
  useEffect(() => {
    if (!otpData?.expiredAt) return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiration = new Date(otpData.expiredAt).getTime();
      const distance = expiration - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft('Expiré');
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [otpData]);

  const handleSelectOrder = async (order: Commande) => {
    setSelectedOrder(order);
    setPaymentAmount(order.montantTotal.toString());
    setLines([]);
    setDetailsError(null);
    
    // Réinitialisation des états annexes lors du changement de commande
    setOtpData(null);
    setOtpError(null);
    setTimeLeft('');
    setRating(0);
    setHoverRating(0);

    setIsDetailsLoading(true);
    try {
      const data = await commandeService.getDetailCommande(order.idCommande);
      setLines(data);
    } catch (err: any) {
      setDetailsError(err.message || "Erreur chargement articles.");
    } finally {
      setIsDetailsLoading(false);
    }
  };

  // FONCTION DE GÉNÉRATION OTP
  const handleGenerateOtp = async () => {
    if (!selectedOrder) return;
    setIsGeneratingOtp(true);
    setOtpError(null);
    try {
      const data = await otpService.getCodeOtp(selectedOrder.idCommande);
      setOtpData(data);
    } catch (error: any) {
      setOtpError(error.message || "Erreur lors de la génération du code.");
    } finally {
      setIsGeneratingOtp(false);
    }
  };

  const processPayment = async () => {
    if (!selectedOrder || !operator || !phoneNumber) return;

    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      const payload = {
        commandeId: selectedOrder.idCommande,
        phoneNumber: phoneNumber,
        paymentMethod: operator
      };

      const response = await paiementService.processPayment(payload);

      if (response.success) {
        setShowPaymentModal(false);
        setPhoneNumber('');
        setOperator('');
        refresh(); 
        toast.success("Paiement reussi");
      } else {
        setPaymentError(response.message || "Le paiement a été refusé par l'opérateur.");
      }

    } catch (error: any) {
      setPaymentError(error.message || "Une erreur est survenue lors de la communication avec le serveur.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const isPhoneValid = /^6\d{8}$/.test(phoneNumber);
  const showPhoneError = phoneNumber.length > 0 && !isPhoneValid;

  return (
    <div className="p-5 md:p-8 bg-app-surface min-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* --- EN-TÊTE --- */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-app-primary mb-1">Mes Commandes</h1>
        <p className="text-xs md:text-sm text-app-secondary mb-6 font-medium">Historique et suivi de vos achats</p>

        {!isFetching && !error && commandes.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 rounded-2xl border border-app-surface shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Filter size={16} className="text-gray-400 mr-1 hidden sm:block" />
              {[
                { id: 'ALL', label: 'Toutes' },
                { id: StatutCommande.EN_ATTENTE_VALIDATION, label: 'À Valider' },
                { id: StatutCommande.EN_ATTENTE_PAIEMENT, label: 'À Payer' },
                { id: StatutCommande.PAYEE, label: 'Payées' },
                { id: StatutCommande.LIVREE, label: 'Livrées' }, // <-- J'ai ajouté le filtre Livrée ici
                { id: StatutCommande.ANNULEE, label: 'Annulées' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFilterStatus(f.id); setSelectedOrder(null); }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filterStatus === f.id ? 'bg-app-accent text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-3">
              <ArrowUpDown size={16} className="text-gray-400" />
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'DESC' | 'ASC')}
                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer w-full sm:w-auto"
              >
                <option value="DESC">Plus récentes</option>
                <option value="ASC">Plus anciennes</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* --- GESTION DES ERREURS GLOBALES --- */}
      {!isFetching && error && (
        <div className="mt-8">
          <ErrorState message={error} onRetry={refresh} />
        </div>
      )}

      {/* --- SKELETON GLOBAL LORS DU CHARGEMENT INITIAL --- */}
      {isFetching && !error && (
        <div className="flex flex-col lg:flex-row gap-6 items-start relative">
          <div className="w-full lg:w-3/5 xl:w-2/3">
            <OrderListSkeleton />
          </div>
        </div>
      )}

      {/* --- LISTE ET DÉTAILS --- */}
      {!isFetching && !error && (
        <div className="flex flex-col lg:flex-row gap-6 items-start relative">
          
          {/* COLONNE GAUCHE */}
          <div className={`w-full ${selectedOrder ? 'hidden lg:flex' : 'flex'} flex-col gap-4 lg:w-3/5 xl:w-2/3 max-h-[calc(100vh-220px)] overflow-y-auto pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
            {commandes.length === 0 ? (
               <EmptyState />
            ) : processedOrders.length === 0 ? (
               <EmptyState />
            ) : (
              processedOrders.map((order) => {
                const isSelected = selectedOrder?.idCommande === order.idCommande;
                return (
                  <div 
                    key={order.idCommande} 
                    onClick={() => handleSelectOrder(order)}
                    className={`bg-white border rounded-2xl p-4 transition-all cursor-pointer flex items-center justify-between gap-4 
                      ${isSelected ? 'border-app-accent ring-1 ring-app-accent bg-blue-50/20 shadow-md' : 'border-gray-100 hover:border-blue-200'}`}
                  >
                    <div className="flex items-center gap-4 min-w-0"> 
                      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 border ${isSelected ? 'bg-app-accent text-white border-app-accent' : 'bg-gray-50 text-gray-400'}`}>
                        <Package size={24} />
                      </div>
                      <div className="truncate">
                        <h3 className="font-bold text-gray-800 text-sm mb-1 truncate">Commande #{order.idCommande}</h3>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                          <span className="flex items-center gap-1"><Clock size={12} /> {formatDate(order.dateCommande)}</span>
                          <span className="flex items-center gap-1 truncate"><Store size={12} /> {order.nomQuincaillerie}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="font-bold text-app-accent text-sm">{order.montantTotal.toLocaleString()} F</p>
                      {getStatusBadge(order.statut)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* COLONNE DROITE */}
          {selectedOrder && (
            <div className="w-full lg:w-2/5 xl:w-1/3 bg-white rounded-2xl border border-gray-100 shadow-lg lg:sticky lg:top-8 max-h-[700px] overflow-y-auto flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="lg:hidden p-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full bg-white border border-gray-200 text-gray-600"><ArrowLeft size={18} /></button>
                <span className="font-bold text-gray-800 text-xs uppercase tracking-widest">Retour</span>
              </div>

              <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-sm font-bold text-gray-800 uppercase tracking-tighter">Détails de l'achat</h2>
                  {getStatusBadge(selectedOrder.statut)}
                </div>
                
                {/* --- BLOC QUINCAILLERIE ET BOUTON OTP --- */}
                <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-gray-700 flex items-center gap-2"><Store size={14} className="text-app-accent"/> {selectedOrder.nomQuincaillerie}</p>
                    <p className="text-[11px] text-gray-400 font-medium">Passée le {formatDate(selectedOrder.dateCommande)}</p>
                  </div>

                  {/* Section OTP affichée uniquement si la commande est payée (et non livrée) */}
                  {selectedOrder.statut === StatutCommande.PAYEE && (
                    <div className="flex flex-col items-end border-l border-gray-200 pl-4 ml-4 shrink-0">
                      {!otpData ? (
                        <button 
                          onClick={handleGenerateOtp}
                          disabled={isGeneratingOtp}
                          className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all disabled:opacity-50"
                        >
                          {isGeneratingOtp ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                          {isGeneratingOtp ? 'Génération...' : 'Code Retrait'}
                        </button>
                      ) : (
                        <div className="text-right flex flex-col items-end">
                          <p className={`text-lg font-black tracking-widest transition-all ${timeLeft === 'Expiré' ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                            {otpData.code}
                          </p>
                          
                          <p className={`text-[10px] font-bold ${timeLeft === 'Expiré' ? 'text-red-500' : 'text-app-accent'}`}>
                            {timeLeft === 'Expiré' ? 'Code expiré' : `Expire dans ${timeLeft}`}
                          </p>

                          {timeLeft === 'Expiré' && (
                            <button 
                              onClick={handleGenerateOtp}
                              disabled={isGeneratingOtp}
                              className="mt-1 flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
                            >
                              <RefreshCw size={10} className={isGeneratingOtp ? "animate-spin" : ""} />
                              {isGeneratingOtp ? 'Génération...' : 'Régénérer'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* --- ERREUR DE GÉNÉRATION OTP --- */}
              {otpError && (
                <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium">
                  <AlertCircle size={14} className="shrink-0" />
                  {otpError}
                </div>
              )}

              <div className="p-5 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <h3 className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest mt-2">Articles ({selectedOrder.nombreArticles})</h3>
                
                {isDetailsLoading ? (
                   <div className="py-2"><OrderDetailsSkeleton /></div>
                ) : detailsError ? (
                   <div className="py-4">
                     <ErrorState message={detailsError} onRetry={() => handleSelectOrder(selectedOrder)} />
                   </div>
                ) : (
                  <div>
                    <div className="space-y-4">
                      {lines.map((l, i) => (
                        <div key={i} className="flex justify-between items-start text-sm pb-3 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="font-bold text-gray-800">{l.nameProduct}</p>
                            <p className="text-xs text-gray-500">{l.quantity}x -- {l.price.toLocaleString()} F</p>
                          </div>
                          <p className="font-bold text-gray-900">{(l.price * l.quantity).toLocaleString()} F</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-5 bg-gray-50 border-t border-gray-100 mt-5 space-y-5">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-500 uppercase text-xs">Total Net</span>
                        <span className="font-black text-xl text-app-accent">{selectedOrder.montantTotal.toLocaleString()} Fcfa</span>
                      </div>

                      {/* --- STATUT : ATTENTE VALIDATION --- */}
                      {selectedOrder.statut === StatutCommande.EN_ATTENTE_VALIDATION && (
                        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-700 text-xs font-medium flex gap-2">
                          <Clock size={16} className="shrink-0" />
                          La quincaillerie vérifie la disponibilité de vos articles. Le paiement sera possible dès confirmation.
                        </div>
                      )}

                      {/* --- STATUT : ATTENTE PAIEMENT --- */}
                      {selectedOrder.statut === StatutCommande.EN_ATTENTE_PAIEMENT && (
                        <button 
                          onClick={() => setShowPaymentModal(true)}
                          className="w-full py-4 rounded-xl bg-app-accent text-white font-bold text-sm shadow-lg shadow-blue-100 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                        >
                          Payer maintenant <Smartphone size={18}/>
                        </button>
                      )}

                      {/* --- STATUT : PAYÉE --- */}
                      {selectedOrder.statut === StatutCommande.PAYEE && selectedOrder.factureUrl && (
                        <div className="space-y-3">
                          <a href={selectedOrder.factureUrl} target="_blank" className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-all">
                            <Download size={14} /> Télécharger la Facture
                          </a>
                          <div className="w-full h-48 border border-gray-200 rounded-xl overflow-hidden bg-white relative">
                            <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedOrder.factureUrl)}&embedded=true`} className="w-full h-full border-0" />
                          </div>
                        </div>
                      )}

                      {/* --- STATUT : LIVRÉE --- */}
                      {selectedOrder.statut === StatutCommande.LIVREE && (
                        <div className="space-y-4">
                          {/* Bouton de facture sans le lecteur iframe */}
                          {selectedOrder.factureUrl && (
                            <a href={selectedOrder.factureUrl} target="_blank" className="w-full py-3 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-all">
                              <Download size={14} /> Télécharger la Facture
                            </a>
                          )}
                          
                          {/* Section de Notation (Avis) */}
                          <div className="p-5 bg-white border border-gray-200 rounded-xl flex flex-col items-center text-center gap-1 shadow-sm">
                            <span className="font-bold text-gray-800 text-sm">Comment s'est passée votre expérience ?</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Notez le service de la quincaillerie</span>
                            
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="p-1 transition-transform hover:scale-110"
                                >
                                  <Star 
                                    size={24} 
                                    className={`${
                                      (hoverRating || rating) >= star 
                                        ? 'fill-amber-400 text-amber-400' 
                                        : 'fill-gray-100 text-gray-200'
                                    } transition-colors duration-150`} 
                                  />
                                </button>
                              ))}
                            </div>

                            {rating > 0 && (
                              <button 
                                onClick={() => toast.success("Merci pour votre avis !")}
                                className="mt-4 px-6 py-2 bg-app-accent text-white rounded-full text-xs font-bold shadow-md hover:bg-opacity-90 transition-all animate-in fade-in zoom-in duration-200"
                              >
                                Soumettre la note
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- MODALE DE PAIEMENT (Inchangée) --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Finaliser le paiement</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-widest">Montant à régler (Fcfa)</label>
                <div className="w-full p-4 bg-gray-100 border border-gray-200 rounded-2xl font-black text-xl text-gray-500 cursor-not-allowed">
                  {Number(paymentAmount).toLocaleString('fr-FR')}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-3 block tracking-widest">Choisir l'opérateur</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'OM', label: 'Orange Money', color: 'bg-orange-500' },
                    { id: 'MOMO', label: 'MTN MoMo', color: 'bg-yellow-400' }
                  ].map(op => (
                    <button 
                      key={op.id}
                      onClick={() => setOperator(op.id)}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${operator === op.id ? 'border-app-accent bg-blue-50' : 'border-gray-50 hover:bg-gray-100'}`}
                    >
                      <div className={`h-8 w-8 rounded-full ${op.color}`} />
                      <span className="text-xs font-bold text-gray-700">{op.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block tracking-widest">Numéro de téléphone</label>
                <input 
                  type="tel" 
                  placeholder="Ex: 6XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  maxLength={9}
                  className={`w-full p-4 bg-gray-50 border rounded-2xl font-bold text-gray-800 focus:ring-2 outline-none transition-all placeholder:text-gray-300 placeholder:font-normal
                    ${showPhoneError ? 'border-red-400 focus:ring-red-400' : 'border-gray-100 focus:ring-app-accent'}
                  `}
                />
              </div>
              {showPhoneError && (
                <p className="text-[10px] text-red-500 font-bold mt-2 ml-1">
                  Le numéro doit commencer par 6 et contenir 9 chiffres au total.
                </p>
              )}
              <button 
                disabled={!operator || !phoneNumber}
                onClick={processPayment}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${operator && phoneNumber ? 'bg-app-accent hover:opacity-90' : 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none'}`}
              >
                Confirmer le paiement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}