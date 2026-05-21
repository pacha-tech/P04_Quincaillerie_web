"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Package, Clock, CheckCircle, Search, 
  AlertCircle, Store, X, ArrowLeft, Filter, ArrowUpDown, Download, Smartphone, Loader2,
  RefreshCw, Key, Truck, Star
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
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 uppercase tracking-wide">
          <Clock size={14} />  Attente Validation
        </span>
      );
    case StatutCommande.EN_ATTENTE_PAIEMENT:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200 uppercase tracking-wide">
          <Smartphone size={14} /> À Payer
        </span>
      );
    case StatutCommande.PAYEE:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 uppercase tracking-wide">
          <CheckCircle size={14} /> Payée
        </span>
      );
    case StatutCommande.LIVREE:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 uppercase tracking-wide">
          <Truck size={14} /> Livrée
        </span>
      );
    case StatutCommande.ANNULEE:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200 uppercase tracking-wide">
          <X size={14} /> Annulée
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 uppercase tracking-wide">
          <Package size={14} /> {status}
        </span>
      );
  }
};

// --- COMPOSANTS D'ÉTAT ET SKELETONS ---
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100 w-full px-4">
    <div className="bg-slate-50 p-5 rounded-full mb-5">
      <Package size={56} className="text-slate-300" />
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center">Aucune commande trouvée</h3>
    <p className="text-slate-500 text-base mb-8 text-center max-w-sm mt-2">
      Il semble que vous n'ayez pas encore passé de commande ou que le filtre soit trop restrictif.
    </p>
    <Link href="/client" className="px-8 py-3.5 bg-app-accent text-white rounded-full font-bold text-base hover:shadow-lg transition-all active:scale-95">
      Commencer mes achats
    </Link>
  </div>
);

const ErrorState = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 rounded-3xl border border-red-100 w-full px-4">
    <AlertCircle size={48} className="text-red-500 mb-5" />
    <h3 className="text-red-800 font-bold text-lg md:text-xl text-center">Oups ! Une erreur est survenue</h3>
    <p className="text-red-600/80 text-sm md:text-base mb-8 text-center max-w-md mt-2">{message}</p>
    <button 
      onClick={onRetry}
      className="flex items-center gap-2 px-8 py-3 bg-white border border-red-200 text-red-600 rounded-full font-bold text-base hover:bg-red-50 transition-all shadow-sm active:scale-95 cursor-pointer"
    >
      <Loader2 size={18} className="animate-spin-slow" /> Réessayer la connexion
    </button>
  </div>
);

const OrderListSkeleton = () => (
  <div className="space-y-4 w-full">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white border border-gray-100 rounded-3xl p-5 flex items-center justify-between gap-4 animate-pulse">
        <div className="flex items-center gap-4 w-full">
          <div className="h-14 w-14 rounded-2xl bg-gray-200 shrink-0" />
          <div className="space-y-3 w-full max-w-[200px]">
            <div className="h-5 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="h-5 w-20 bg-gray-200 rounded" />
          <div className="h-6 w-24 bg-gray-100 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const OrderDetailsSkeleton = () => (
  <div className="space-y-5">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0 animate-pulse">
        <div className="space-y-3 w-full max-w-[150px]">
          <div className="h-5 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>
        <div className="h-5 w-20 bg-gray-200 rounded" />
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

  // --- NOUVEL ÉTAT POUR LA REDIRECTION DE PAIEMENT ---
  const [isRedirecting, setIsRedirecting] = useState(false);

  // États pour l'OTP
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [otpData, setOtpData] = useState<{ code: string, expiredAt: string } | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  // États pour la notation
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
    setLines([]);
    setDetailsError(null);
    
    // Réinitialisation des états
    setOtpData(null);
    setOtpError(null);
    setTimeLeft('');
    setRating(0);
    setHoverRating(0);
    setIsRedirecting(false); // Réinitialiser l'état de chargement du paiement

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

  
  const handlePaymentRedirect = async () => {
    if (!selectedOrder) return;

    setIsRedirecting(true);
    try {
      
      const response = await paiementService.processPayment(selectedOrder.idCommande);

      if (response.success && response.urlTransaction) {
        
        window.location.href = response.urlTransaction;
      } else {
        toast.error(response.message || "Impossible d'initier le paiement.");
        setIsRedirecting(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur serveur. Veuillez réessayer.");
      setIsRedirecting(false);
    }
    
  };

  return (
    <div className="p-4 md:p-8 bg-app-surface min-h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      {/* --- EN-TÊTE --- */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-app-primary mb-2">Mes Commandes</h1>
        <p className="text-sm md:text-base text-app-secondary mb-6 font-medium">Historique et suivi de vos achats</p>

        {!isFetching && !error && commandes.length > 0 && (
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-3 md:p-4 rounded-2xl md:rounded-full border border-gray-100 shadow-sm w-full">
            
            {/* Filtres scrollables horizontalement sur mobile */}
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
              <Filter size={18} className="text-gray-400 mx-2 hidden lg:block shrink-0" />
              {[
                { id: 'ALL', label: 'Toutes' },
                { id: StatutCommande.EN_ATTENTE_VALIDATION, label: 'À Valider' },
                { id: StatutCommande.EN_ATTENTE_PAIEMENT, label: 'À Payer' },
                { id: StatutCommande.PAYEE, label: 'Payées' },
                { id: StatutCommande.LIVREE, label: 'Livrées' },
                { id: StatutCommande.ANNULEE, label: 'Annulées' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => { setFilterStatus(f.id); setSelectedOrder(null); }}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shrink-0 cursor-pointer ${
                    filterStatus === f.id ? 'bg-app-accent text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Tri */}
            <div className="flex items-center gap-2 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-gray-100 pt-3 lg:pt-0 lg:pl-4 shrink-0">
              <ArrowUpDown size={18} className="text-gray-400" />
              <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'DESC' | 'ASC')}
                className="bg-transparent text-sm md:text-base font-bold text-gray-700 outline-none cursor-pointer w-full lg:w-auto py-1"
              >
                <option value="DESC">Plus récentes</option>
                <option value="ASC">Plus anciennes</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {!isFetching && error && (
        <div className="mt-8">
          <ErrorState message={error} onRetry={refresh} />
        </div>
      )}

      {isFetching && !error && (
        <div className="flex flex-col lg:flex-row gap-6 items-start relative">
          <div className="w-full lg:w-3/5 xl:w-2/3">
            <OrderListSkeleton />
          </div>
        </div>
      )}

      {!isFetching && !error && (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative">
          
          {/* LISTE DES COMMANDES */}
          <div className={`w-full ${selectedOrder ? 'hidden lg:flex' : 'flex'} flex-col gap-4 lg:w-3/5 xl:w-2/3 max-h-[calc(100vh-220px)] overflow-y-auto pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
            {commandes.length === 0 || processedOrders.length === 0 ? (
               <EmptyState />
            ) : (
              processedOrders.map((order) => {
                const isSelected = selectedOrder?.idCommande === order.idCommande;
                return (
                  <div 
                    key={order.idCommande} 
                    onClick={() => handleSelectOrder(order)}
                    className={`bg-white border rounded-3xl p-4 md:p-5 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 
                      ${isSelected ? 'border-app-accent ring-2 ring-app-accent/20 bg-blue-50/10 shadow-md' : 'border-gray-100 hover:border-blue-200 hover:shadow-sm'}`}
                  >
                    <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto"> 
                      <div className={`h-14 w-14 md:h-16 md:w-16 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${isSelected ? 'bg-app-accent text-white border-app-accent shadow-inner' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        <Package size={28} />
                      </div>
                      <div className="truncate flex-1">
                        <h3 className="font-bold text-gray-900 text-base md:text-lg mb-1.5 truncate">Commande #{order.idCommande}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-gray-500 font-medium tracking-tight">
                          <span className="flex items-center gap-1.5"><Clock size={14} className="text-gray-400" /> {formatDate(order.dateCommande)}</span>
                          <span className="hidden sm:inline text-gray-300">•</span>
                          <span className="flex items-center gap-1.5 truncate"><Store size={14} className="text-gray-400" /> <span className="truncate">{order.nomQuincaillerie}</span></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                      <p className="font-black text-app-accent text-lg md:text-xl">{order.montantTotal.toLocaleString()} F</p>
                      {getStatusBadge(order.statut)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DÉTAILS DE LA COMMANDE */}
          {selectedOrder && (
            <div className="w-full lg:w-2/5 xl:w-1/3 bg-white rounded-3xl border border-gray-100 shadow-xl lg:sticky lg:top-8 max-h-[100vh] lg:max-h-[800px] flex flex-col overflow-hidden">
              
              {/* Header mobile (Retour) */}
              <div className="lg:hidden p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/80 backdrop-blur-sm">
                <button onClick={() => setSelectedOrder(null)} className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm active:scale-95 cursor-pointer">
                  <ArrowLeft size={20} />
                </button>
                <span className="font-black text-gray-800 text-sm uppercase tracking-widest">Retour aux commandes</span>
              </div>

              <div className="p-5 md:p-6 border-b border-gray-100 shrink-0">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-base md:text-lg font-black text-gray-900 uppercase tracking-tight">Détails de l'achat</h2>
                  {getStatusBadge(selectedOrder.statut)}
                </div>
                
                <div className="bg-gray-50 p-5 rounded-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border border-gray-100">
                  <div className="space-y-2.5">
                    <p className="text-sm md:text-base font-bold text-gray-800 flex items-center gap-2">
                      <Store size={18} className="text-app-accent"/> {selectedOrder.nomQuincaillerie}
                    </p>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <Clock size={14} /> Passée le {formatDate(selectedOrder.dateCommande)}
                    </p>
                  </div>

                  {selectedOrder.statut === StatutCommande.PAYEE && (
                    <div className="flex flex-col sm:items-end sm:border-l border-gray-200 sm:pl-5 sm:ml-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0">
                      {!otpData ? (
                        <button 
                          onClick={handleGenerateOtp}
                          disabled={isGeneratingOtp}
                          className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                        >
                          {isGeneratingOtp ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
                          {isGeneratingOtp ? 'Génération...' : 'Code Retrait'}
                        </button>
                      ) : (
                        <div className="text-center sm:text-right flex flex-col sm:items-end w-full">
                          <p className={`text-2xl md:text-3xl font-black tracking-widest transition-all ${timeLeft === 'Expiré' ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                            {otpData.code}
                          </p>
                          <p className={`text-xs font-bold mt-1 ${timeLeft === 'Expiré' ? 'text-red-500' : 'text-app-accent'}`}>
                            {timeLeft === 'Expiré' ? 'Code expiré' : `Expire dans ${timeLeft}`}
                          </p>
                          {timeLeft === 'Expiré' && (
                            <button 
                              onClick={handleGenerateOtp}
                              disabled={isGeneratingOtp}
                              className="mt-2 mx-auto sm:mx-0 flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-100 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <RefreshCw size={14} className={isGeneratingOtp ? "animate-spin" : ""} />
                              {isGeneratingOtp ? 'Patientez...' : 'Régénérer le code'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {otpError && (
                <div className="mx-5 md:mx-6 mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm font-medium">
                  <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
                  <p>{otpError}</p>
                </div>
              )}

              <div className="p-5 md:p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-24 lg:pb-6">
                <h3 className="text-xs font-black text-gray-400 mb-5 uppercase tracking-widest flex items-center gap-2">
                  <Package size={16} /> Articles ({selectedOrder.nombreArticles})
                </h3>
                
                {isDetailsLoading ? (
                   <div className="py-2"><OrderDetailsSkeleton /></div>
                ) : detailsError ? (
                   <div className="py-4">
                     <ErrorState message={detailsError} onRetry={() => handleSelectOrder(selectedOrder)} />
                   </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="space-y-4 md:space-y-5">
                      {lines.map((l, i) => (
                        <div key={i} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 group">
                          <div className="pr-4">
                            <p className="font-bold text-gray-900 text-sm md:text-base mb-1 group-hover:text-app-accent transition-colors">{l.nameProduct}</p>
                            <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-semibold border border-gray-100">
                              {l.quantity} x {l.price.toLocaleString()} F
                            </span>
                          </div>
                          <p className="font-black text-gray-900 text-base shrink-0 mt-1">{(l.price * l.quantity).toLocaleString()} F</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 space-y-6 bg-white">
                      <div className="flex justify-between items-end mb-2 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <span className="font-black text-gray-500 uppercase text-xs tracking-widest">Total Net</span>
                        <span className="font-black text-2xl md:text-3xl text-app-accent">{selectedOrder.montantTotal.toLocaleString()} <span className="text-lg md:text-xl text-gray-400">Fcfa</span></span>
                      </div>

                      {selectedOrder.statut === StatutCommande.EN_ATTENTE_VALIDATION && (
                        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-sm md:text-base font-medium flex gap-3 shadow-sm">
                          <Clock size={24} className="shrink-0 text-amber-500" />
                          <p>La quincaillerie vérifie la disponibilité de vos articles. Le paiement sera possible dès confirmation.</p>
                        </div>
                      )}

                      {/* --- BOUTON DE PAIEMENT --- */}
                      {selectedOrder.statut === StatutCommande.EN_ATTENTE_PAIEMENT && (
                        <button 
                          onClick={handlePaymentRedirect}
                          disabled={isRedirecting}
                          className="w-full py-4 md:py-5 rounded-2xl bg-app-accent text-white font-black text-base md:text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-75 disabled:cursor-wait disabled:hover:translate-y-0 cursor-pointer"
                        >
                          {isRedirecting ? (
                            <>
                              <Loader2 size={24} className="animate-spin" />
                              Redirection vers le paiement...
                            </>
                          ) : (
                            <>
                              Payer maintenant <Smartphone size={24}/>
                            </>
                          )}
                        </button>
                      )}

                      {selectedOrder.statut === StatutCommande.PAYEE && selectedOrder.factureUrl && (
                        <div className="space-y-4">
                          <a href={selectedOrder.factureUrl} target="_blank" className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md active:scale-95">
                            <Download size={18} /> Télécharger la Facture
                          </a>
                          <div className="w-full h-56 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 relative">
                            <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedOrder.factureUrl)}&embedded=true`} className="w-full h-full border-0" />
                          </div>
                        </div>
                      )}

                      {selectedOrder.statut === StatutCommande.LIVREE && (
                        <div className="space-y-5">
                          {selectedOrder.factureUrl && (
                            <a href={selectedOrder.factureUrl} target="_blank" className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 hover:bg-black transition-all shadow-md active:scale-95">
                              <Download size={18} /> Télécharger la Facture
                            </a>
                          )}
                          
                          <div className="p-6 bg-white border border-gray-200 rounded-3xl flex flex-col items-center text-center gap-2 shadow-sm">
                            <span className="font-black text-gray-900 text-base md:text-lg">Comment s'est passée votre expérience ?</span>
                            <span className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Notez le service de la quincaillerie</span>
                            
                            <div className="flex gap-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="p-2 transition-transform hover:scale-110 cursor-pointer"
                                >
                                  <Star 
                                    size={32}
                                    className={`${
                                      (hoverRating || rating) >= star 
                                        ? 'fill-amber-400 text-amber-400 drop-shadow-sm' 
                                        : 'fill-gray-100 text-gray-200'
                                    } transition-colors duration-150`} 
                                  />
                                </button>
                              ))}
                            </div>

                            {rating > 0 && (
                              <button 
                                onClick={() => toast.success("Merci pour votre avis ! (À lier au backend)")}
                                className="mt-6 px-8 py-3.5 bg-app-accent text-white rounded-full text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all animate-in fade-in zoom-in duration-200 active:scale-95 cursor-pointer"
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
    </div>
  );
}