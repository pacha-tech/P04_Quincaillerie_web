"use client";

{/*
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<'Orange_Cameroon' | 'MTN_Cameroon' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('237');

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
    setSelectedOperator(null);
    setIsPaymentModalOpen(false);
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

  
  const handlePaymentRedirect = async (operator: string , phone: string) => {
    if (!selectedOrder) return;

    setIsRedirecting(true);
    try {
      
      const response = await paiementService.processPayment(selectedOrder.idCommande, operator , phone);

      if (response.success) {
        setIsPaymentModalOpen(false);
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
      
     
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-app-primary mb-2">Mes Commandes</h1>
        <p className="text-sm md:text-base text-app-secondary mb-6 font-medium">Historique et suivi de vos achats</p>

        {!isFetching && !error && commandes.length > 0 && (
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-3 md:p-4 rounded-2xl md:rounded-full border border-gray-100 shadow-sm w-full">
            
           
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

            {selectedOrder && (
              <div className="w-full lg:w-2/5 xl:w-1/3 bg-white rounded-2xl border border-gray-100 shadow-xl lg:sticky lg:top-8 max-h-[100vh] lg:max-h-[800px] flex flex-col overflow-hidden">
                
               
                <div className="lg:hidden p-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50/80 backdrop-blur-sm">
                  <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm active:scale-95 cursor-pointer">
                    <ArrowLeft size={18} />
                  </button>
                  <span className="font-black text-gray-800 text-xs uppercase tracking-widest">Retour</span>
                </div>

              
                <div className="p-4 border-b border-gray-100 shrink-0">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-tight">Détails de l'achat</h2>
                    {getStatusBadge(selectedOrder.statut)}
                  </div>
                  
       
                  <div className="bg-gray-50 p-3 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border border-gray-100">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                        <Store size={16} className="text-app-accent"/> {selectedOrder.nomQuincaillerie}
                      </p>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Clock size={12} /> Passée le {formatDate(selectedOrder.dateCommande)}
                      </p>
                    </div>

                    {selectedOrder.statut === StatutCommande.PAYEE && (
                      <div className="flex flex-col sm:items-end sm:border-l border-gray-200 sm:pl-3 sm:ml-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                        {!otpData ? (
                          <button 
                            onClick={handleGenerateOtp}
                            disabled={isGeneratingOtp}
                            className="flex items-center justify-center sm:justify-start gap-1.5 w-full sm:w-auto px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                          >
                            {isGeneratingOtp ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                            {isGeneratingOtp ? 'Génération...' : 'Code Retrait'}
                          </button>
                        ) : (
                          <div className="text-center sm:text-right flex flex-col sm:items-end w-full">
                            <p className={`text-xl font-black tracking-widest transition-all ${timeLeft === 'Expiré' ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                              {otpData.code}
                            </p>
                            <p className={`text-[10px] font-bold ${timeLeft === 'Expiré' ? 'text-red-500' : 'text-app-accent'}`}>
                               {timeLeft === 'Expiré' ? 'Expiré' : timeLeft}
                            </p>
                            {timeLeft === 'Expiré' && (
                              <button 
                                onClick={handleGenerateOtp}
                                disabled={isGeneratingOtp}
                                className="mt-1 flex items-center justify-center gap-1 px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                <RefreshCw size={12} className={isGeneratingOtp ? "animate-spin" : ""} />
                                Régénérer
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

             
                {otpError && (
                  <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-700 text-xs font-medium">
                    <AlertCircle size={16} className="shrink-0 text-red-500" />
                    <p>{otpError}</p>
                  </div>
                )}

        
                <div className="p-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-20 lg:pb-4">
                  <h3 className="text-[11px] font-black text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-1.5">
                    <Package size={14} /> Articles ({selectedOrder.nombreArticles})
                  </h3>
                  
                  {isDetailsLoading ? (
                      <div className="py-2"><OrderDetailsSkeleton /></div>
                  ) : detailsError ? (
                      <div className="py-2">
                        <ErrorState message={detailsError} onRetry={() => handleSelectOrder(selectedOrder)} />
                      </div>
                  ) : (
                    <div className="flex flex-col h-full">
                
                      <div className="space-y-3">
                        {lines.map((l, i) => (
                          <div key={i} className="flex justify-between items-start pb-2 border-b border-gray-50 last:border-0 group">
                            <div className="pr-3">
                              <p className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-app-accent transition-colors leading-tight">{l.nameProduct}</p>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-[11px] font-semibold border border-gray-100">
                                {l.quantity} x {l.price.toLocaleString()} F
                              </span>
                            </div>
                            <p className="font-black text-gray-900 text-sm shrink-0 mt-0.5">{(l.price * l.quantity).toLocaleString()} F</p>
                          </div>
                        ))}
                      </div>

                 
                      <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-4 bg-white">
                        <div className="flex justify-between items-end bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <span className="font-black text-gray-500 uppercase text-[11px] tracking-widest">Total Net</span>
                          <span className="font-black text-xl text-app-accent">{selectedOrder.montantTotal.toLocaleString()} <span className="text-sm text-gray-400">Fcfa</span></span>
                        </div>

                        {selectedOrder.statut === StatutCommande.EN_ATTENTE_VALIDATION && (
                          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs font-medium flex gap-2">
                            <Clock size={18} className="shrink-0 text-amber-500" />
                            <p className="leading-tight">Vérification de la disponibilité par la quincaillerie en cours.</p>
                          </div>
                        )}

                        {selectedOrder.statut === StatutCommande.EN_ATTENTE_PAIEMENT && (
                          <button 
                            onClick={() => setIsPaymentModalOpen(true)}
                            disabled={isRedirecting}
                            className="w-full py-3 rounded-xl bg-app-accent text-white font-black text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                          >
                            {isRedirecting ? (
                              <><Loader2 size={18} className="animate-spin" /> Redirection...</>
                            ) : (
                              <>Payer maintenant <Smartphone size={18}/></>
                            )}
                          </button>
                        )}

                        {selectedOrder.statut === StatutCommande.PAYEE && selectedOrder.factureUrl && (
                          <div className="space-y-3">
                            <a href={selectedOrder.factureUrl} target="_blank" className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-sm active:scale-95">
                              <Download size={14} /> Télécharger la Facture
                            </a>
                     
                            <div className="w-full h-40 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 relative">
                              <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedOrder.factureUrl)}&embedded=true`} className="w-full h-full border-0" />
                            </div>
                          </div>
                        )}

                        {selectedOrder.statut === StatutCommande.LIVREE && (
                          <div className="space-y-3">
                            {selectedOrder.factureUrl && (
                              <a href={selectedOrder.factureUrl} target="_blank" className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-sm active:scale-95">
                                <Download size={14} /> Télécharger la Facture
                              </a>
                            )}
                            
                            <div className="p-4 bg-white border border-gray-200 rounded-2xl flex flex-col items-center text-center gap-1">
                              <span className="font-black text-gray-900 text-sm">Votre expérience ?</span>
                              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Notez la quincaillerie</span>
                              
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="p-1 transition-transform hover:scale-110 cursor-pointer"
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
                                  onClick={() => toast.success("Merci pour votre avis ! (À lier au backend)")}
                                  className="mt-3 px-6 py-2 bg-app-accent text-white rounded-full text-xs font-bold shadow-md hover:bg-blue-700 transition-all cursor-pointer"
                                >
                                  Soumettre
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
     
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
           
            <button 
              onClick={() => {
                setIsPaymentModalOpen(false);
                setSelectedOperator(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-black text-gray-900 mb-1">Paiement Mobile</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Choisissez votre opérateur pour continuer</p>

           
            <div className="grid grid-cols-2 gap-4 mb-6">
          
              <div 
                onClick={() => setSelectedOperator('Orange_Cameroon')}
                className={`cursor-pointer rounded-2xl p-5 flex flex-col items-center justify-center gap-3 border-2 transition-all ${
                  selectedOperator === 'Orange_Cameroon' 
                    ? 'border-orange-500 bg-orange-50 shadow-md ring-4 ring-orange-500/10' 
                    : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 bg-white'
                }`}
              >
              
                <img 
                  src="/logos/orange1.png" 
                  alt="Orange Money" 
                  className="w-16 h-16 object-contain drop-shadow-sm"
                />
                <span className={`text-sm font-bold ${selectedOperator === 'Orange_Cameroon' ? 'text-orange-700' : 'text-gray-600'}`}>Orange</span>
              </div>

        
              <div 
                onClick={() => setSelectedOperator('MTN_Cameroon')}
                className={`cursor-pointer rounded-2xl p-5 flex flex-col items-center justify-center gap-3 border-2 transition-all ${
                  selectedOperator === 'MTN_Cameroon' 
                    ? 'border-yellow-400 bg-yellow-50 shadow-md ring-4 ring-yellow-400/10' 
                    : 'border-gray-100 hover:border-yellow-200 hover:bg-yellow-50/30 bg-white'
                }`}
              >
                <img 
                  src="/logos/mtn1.png" 
                  alt="MTN Mobile Money" 
                  className="w-16 h-16 object-contain drop-shadow-sm"
                />
                <span className={`text-sm font-bold ${selectedOperator === 'MTN_Cameroon' ? 'text-yellow-800' : 'text-gray-600'}`}>MTN</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ''); // Bloque les lettres, uniquement des chiffres
                    
                    // Empêche l'utilisateur d'effacer le 237
                    if (val.length < 3 || !val.startsWith('237')) {
                      setPhoneNumber('237');
                    } 

                    if (val.length >= 4 && val[3] !== '6') {
                      return; // On ignore la saisie si ce n'est pas un 6
                    }
                    // Limite strictement à 12 caractères
                    else if (val.length <= 12) {
                      setPhoneNumber(val);
                    }
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 font-bold focus:outline-none transition-all ${
                    phoneNumber.length === 12 
                      ? 'border-green-400 focus:ring-2 focus:ring-green-400/50' 
                      : 'border-gray-200 focus:ring-2 focus:ring-app-accent/50 focus:border-app-accent'
                  }`}
                  placeholder="2376XXXXXXXX"
                />
                
     
                {phoneNumber.length === 12 && (
                  <CheckCircle size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              
            
              {phoneNumber.length > 3 && phoneNumber.length < 12 && (
                <p className="text-xs text-orange-500 mt-1.5 font-medium flex items-center gap-1">
                  <AlertCircle size={12} /> Il manque {12 - phoneNumber.length} chiffre(s).
                </p>
              )}
            </div>

       
            <button 
              onClick={() => selectedOperator && handlePaymentRedirect(selectedOperator, phoneNumber)}
              disabled={!selectedOperator || phoneNumber.length !== 12 || isRedirecting}
              className="w-full py-3.5 bg-app-accent text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
            >
              {isRedirecting ? (
                <><Loader2 size={18} className="animate-spin" /> Initiation...</>
              ) : (
                <>Confirmer le paiement</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
  */}



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
import UssdPaymentModal from '@/src/components/ui/client/UssdPaymentModal';


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

  const [isRedirecting, setIsRedirecting] = useState(false);
  // 🌟 NOUVEL ÉTAT POUR ENREGISTRER L'ID DE TRANSACTION REÇU DE L'API POUR LE SSE
  const [trackingId, setTrackingId] = useState<string | null>(null); 

  // États pour l'OTP
  const [isGeneratingOtp, setIsGeneratingOtp] = useState(false);
  const [otpData, setOtpData] = useState<{ code: string, expiredAt: string } | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<'Orange_Cameroon' | 'MTN_Cameroon' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>('237');

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
    setIsRedirecting(false); 
    setTrackingId(null); // Réinitialiser le suivi de paiement
    setSelectedOperator(null);
    setIsPaymentModalOpen(false);
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

  // 🌟 ADAPTATION DU PAIEMENT DIRECT : PLUS DE REDIRECTION INTERNE/EXTERNE, ON PASSE L'ID AU SSE
  const handlePaymentRedirect = async (operator: string , phone: string) => {
    if (!selectedOrder) return;

    setIsRedirecting(true);
    try {
      const response = await paiementService.processPayment(selectedOrder.idCommande, operator , phone);

      if (response.success) {
        setIsPaymentModalOpen(false); // Ferme l'écran de sélection de l'opérateur
        setTrackingId(response.transactionId); // Déclenche le modal d'attente USSD / Flux SSE !
      } else {
        toast.error(response.message || "Impossible d'initier le paiement.");
      }
    } catch (error: any) {
      toast.error(error.message || "Erreur serveur. Veuillez réessayer.");
    } finally {
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

          {selectedOrder && (
            <div className="w-full lg:w-2/5 xl:w-1/3 bg-white rounded-2xl border border-gray-100 shadow-xl lg:sticky lg:top-8 max-h-[100vh] lg:max-h-[800px] flex flex-col overflow-hidden">
              
              {/* Header mobile (Retour) */}
              <div className="lg:hidden p-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50/80 backdrop-blur-sm">
                <button onClick={() => setSelectedOrder(null)} className="p-2 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm active:scale-95 cursor-pointer">
                  <ArrowLeft size={18} />
                </button>
                <span className="font-black text-gray-800 text-xs uppercase tracking-widest">Retour</span>
              </div>

              {/* En-tête des détails (Quincaillerie, Date, Statut, OTP) */}
              <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm md:text-base font-black text-gray-900 uppercase tracking-tight">Détails de l'achat</h2>
                  {getStatusBadge(selectedOrder.statut)}
                </div>
                
                {/* Box grise plus compacte */}
                <div className="bg-gray-50 p-3 rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Store size={16} className="text-app-accent"/> {selectedOrder.nomQuincaillerie}
                    </p>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                      <Clock size={12} /> Passée le {formatDate(selectedOrder.dateCommande)}
                    </p>
                  </div>

                  {selectedOrder.statut === StatutCommande.PAYEE && (
                    <div className="flex flex-col sm:items-end sm:border-l border-gray-200 sm:pl-3 sm:ml-1 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                      {!otpData ? (
                        <button 
                          onClick={handleGenerateOtp}
                          disabled={isGeneratingOtp}
                          className="flex items-center justify-center sm:justify-start gap-1.5 w-full sm:w-auto px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-all disabled:opacity-50 cursor-pointer active:scale-95"
                        >
                          {isGeneratingOtp ? <Loader2 size={14} className="animate-spin" /> : <Key size={14} />}
                          {isGeneratingOtp ? 'Génération...' : 'Code Retrait'}
                        </button>
                      ) : (
                        <div className="text-center sm:text-right flex flex-col sm:items-end w-full">
                          <p className={`text-xl font-black tracking-widest transition-all ${timeLeft === 'Expiré' ? 'text-gray-300 line-through' : 'text-gray-900'}`}>
                            {otpData.code}
                          </p>
                          <p className={`text-[10px] font-bold ${timeLeft === 'Expiré' ? 'text-red-500' : 'text-app-accent'}`}>
                             {timeLeft === 'Expiré' ? 'Expiré' : timeLeft}
                          </p>
                          {timeLeft === 'Expiré' && (
                            <button 
                              onClick={handleGenerateOtp}
                              disabled={isGeneratingOtp}
                              className="mt-1 flex items-center justify-center gap-1 px-2 py-1 bg-gray-100 rounded text-[10px] font-bold text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
                            >
                              <RefreshCw size={12} className={isGeneratingOtp ? "animate-spin" : ""} />
                              Régénérer
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Message d'erreur plus petit */}
              {otpError && (
                <div className="mx-4 mt-3 p-2.5 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-700 text-xs font-medium">
                  <AlertCircle size={16} className="shrink-0 text-red-500" />
                  <p>{otpError}</p>
                </div>
              )}

              {/* Liste des articles et totaux */}
              <div className="p-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden pb-20 lg:pb-4">
                <h3 className="text-[11px] font-black text-gray-400 mb-3 uppercase tracking-widest flex items-center gap-1.5">
                  <Package size={14} /> Articles ({selectedOrder.nombreArticles})
                </h3>
                
                {isDetailsLoading ? (
                    <div className="py-2"><OrderDetailsSkeleton /></div>
                ) : detailsError ? (
                    <div className="py-2">
                      <ErrorState message={detailsError} onRetry={() => handleSelectOrder(selectedOrder)} />
                    </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* Espacement des articles réduit */}
                    <div className="space-y-3">
                      {lines.map((l, i) => (
                        <div key={i} className="flex justify-between items-start pb-2 border-b border-gray-50 last:border-0 group">
                          <div className="pr-3">
                            <p className="font-bold text-gray-900 text-sm mb-0.5 group-hover:text-app-accent transition-colors leading-tight">{l.nameProduct}</p>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-[11px] font-semibold border border-gray-100">
                              {l.quantity} x {l.price.toLocaleString()} F
                            </span>
                          </div>
                          <p className="font-black text-gray-900 text-sm shrink-0 mt-0.5">{(l.price * l.quantity).toLocaleString()} F</p>
                        </div>
                      ))}
                    </div>

                    {/* Section bas (Total et Actions) plus condensée */}
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200 space-y-4 bg-white">
                      <div className="flex justify-between items-end bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="font-black text-gray-500 uppercase text-[11px] tracking-widest">Total Net</span>
                        <span className="font-black text-xl text-app-accent">{selectedOrder.montantTotal.toLocaleString()} <span className="text-sm text-gray-400">Fcfa</span></span>
                      </div>

                      {selectedOrder.statut === StatutCommande.EN_ATTENTE_VALIDATION && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs font-medium flex gap-2">
                          <Clock size={18} className="shrink-0 text-amber-500" />
                          <p className="leading-tight">Vérification de la disponibilité par la quincaillerie en cours.</p>
                        </div>
                      )}

                      {selectedOrder.statut === StatutCommande.EN_ATTENTE_PAIEMENT && (
                        <button 
                          onClick={() => setIsPaymentModalOpen(true)}
                          disabled={isRedirecting}
                          className="w-full py-3 rounded-xl bg-app-accent text-white font-black text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                        >
                          {isRedirecting ? (
                            <><Loader2 size={18} className="animate-spin" /> Initiation...</>
                          ) : (
                            <>Payer maintenant <Smartphone size={18}/></>
                          )}
                        </button>
                      )}

                      {selectedOrder.statut === StatutCommande.PAYEE && selectedOrder.factureUrl && (
                        <div className="space-y-3">
                          <a href={selectedOrder.factureUrl} target="_blank" className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-sm active:scale-95">
                            <Download size={14} /> Télécharger la Facture
                          </a>
                          {/* Hauteur de l'Iframe réduite */}
                          <div className="w-full h-40 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 relative">
                            <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedOrder.factureUrl)}&embedded=true`} className="w-full h-full border-0" />
                          </div>
                        </div>
                      )}

                      {selectedOrder.statut === StatutCommande.LIVREE && (
                        <div className="space-y-3">
                          {selectedOrder.factureUrl && (
                            <a href={selectedOrder.factureUrl} target="_blank" className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-all shadow-sm active:scale-95">
                              <Download size={14} /> Télécharger la Facture
                            </a>
                          )}
                          
                          <div className="p-4 bg-white border border-gray-200 rounded-2xl flex flex-col items-center text-center gap-1">
                            <span className="font-black text-gray-900 text-sm">Votre expérience ?</span>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Notez la quincaillerie</span>
                            
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
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
                                onClick={() => toast.success("Merci pour votre avis ! (À lier au backend)")}
                                className="mt-3 px-6 py-2 bg-app-accent text-white rounded-full text-xs font-bold shadow-md hover:bg-blue-700 transition-all cursor-pointer"
                              >
                                Soumettre
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

      {/* --- POPUP / MODAL DE CHOIX D'OPÉRATEUR --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            {/* Bouton Fermer */}
            <button 
              onClick={() => {
                setIsPaymentModalOpen(false);
                setSelectedOperator(null);
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-full p-1.5 transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-black text-gray-900 mb-1">Paiement Mobile</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Choisissez votre opérateur pour continuer</p>

            {/* Les deux carrés de sélection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Option Orange Money */}
              <div 
                onClick={() => setSelectedOperator('Orange_Cameroon')}
                className={`cursor-pointer rounded-2xl p-5 flex flex-col items-center justify-center gap-3 border-2 transition-all ${
                  selectedOperator === 'Orange_Cameroon' 
                    ? 'border-orange-500 bg-orange-50 shadow-md ring-4 ring-orange-500/10' 
                    : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 bg-white'
                }`}
              >
                <img 
                  src="/logos/orange1.png" 
                  alt="Orange Money" 
                  className="w-16 h-16 object-contain drop-shadow-sm"
                />
                <span className={`text-sm font-bold ${selectedOperator === 'Orange_Cameroon' ? 'text-orange-700' : 'text-gray-600'}`}>Orange</span>
              </div>

              {/* Option MTN Mobile Money */}
              <div 
                onClick={() => setSelectedOperator('MTN_Cameroon')}
                className={`cursor-pointer rounded-2xl p-5 flex flex-col items-center justify-center gap-3 border-2 transition-all ${
                  selectedOperator === 'MTN_Cameroon' 
                    ? 'border-yellow-400 bg-yellow-50 shadow-md ring-4 ring-yellow-400/10' 
                    : 'border-gray-100 hover:border-yellow-200 hover:bg-yellow-50/30 bg-white'
                }`}
              >
                <img 
                  src="/logos/mtn1.png" 
                  alt="MTN Mobile Money" 
                  className="w-16 h-16 object-contain drop-shadow-sm"
                />
                <span className={`text-sm font-bold ${selectedOperator === 'MTN_Cameroon' ? 'text-yellow-800' : 'text-gray-600'}`}>MTN</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Numéro de téléphone
              </label>
              <div className="relative">
                <input 
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ''); 
                    
                    if (val.length < 3 || !val.startsWith('237')) {
                      setPhoneNumber('237');
                    } 

                    if (val.length >= 4 && val[3] !== '6') {
                      return; 
                    }
                    else if (val.length <= 12) {
                      setPhoneNumber(val);
                    }
                  }}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 font-bold focus:outline-none transition-all ${
                    phoneNumber.length === 12 
                      ? 'border-green-400 focus:ring-2 focus:ring-green-400/50' 
                      : 'border-gray-200 focus:ring-2 focus:ring-app-accent/50 focus:border-app-accent'
                  }`}
                  placeholder="2376XXXXXXXX"
                />
                
                {phoneNumber.length === 12 && (
                  <CheckCircle size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
              
              {phoneNumber.length > 3 && phoneNumber.length < 12 && (
                <p className="text-xs text-orange-500 mt-1.5 font-medium flex items-center gap-1">
                  <AlertCircle size={12} /> Il manque {12 - phoneNumber.length} chiffre(s).
                </p>
              )}
            </div>

            {/* Bouton de confirmation */}
            <button 
              onClick={() => selectedOperator && handlePaymentRedirect(selectedOperator, phoneNumber)}
              disabled={!selectedOperator || phoneNumber.length !== 12 || isRedirecting}
              className="w-full py-3.5 bg-app-accent text-white rounded-xl font-black text-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
            >
              {isRedirecting ? (
                <><Loader2 size={18} className="animate-spin" /> Initiation...</>
              ) : (
                <>Confirmer le paiement</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 🌟 OVERLAY / MODAL DE TEMPS RÉEL (SSE) APPRÈS INITIATION DU PAIEMENT DIRECT */}
      {trackingId && (
        <UssdPaymentModal 
          transactionId={trackingId} 
          onClose={() => {
            setTrackingId(null);
            refresh(); // Rafraîchit les commandes pour refléter un éventuel changement de statut en base
          }} 
        />
      )}
    </div>
  );
}