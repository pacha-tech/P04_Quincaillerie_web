"use client";

import { useEffect, useState, useMemo } from 'react';
import { 
  Package, Clock, CheckCircle, Search, 
  AlertCircle, User, X, ArrowLeft, Filter, ArrowUpDown,
  FileText, CheckCircle2, Loader2, AlertTriangle, ExternalLink, Calendar, Key,
  Truck
} from 'lucide-react';
import { useCommande } from '@/src/hooks/CommandeContext';
import { commandeService } from '@/src/services/CommandeService';
import { Commande } from '@/src/types/Commande';
import { CommandeDetail } from '@/src/types/CommandeDetail';
import { StatutCommande } from '@/src/utils/StatutCommande';
import toast from 'react-hot-toast';
import { otpService } from '@/src/services/OtpService';
import { ValidationRetraitDTO } from '@/src/types/DTO/ValidationRetraitDTO';

const formatFullDate = (dateString: string) => {
  if (!dateString) return "Date inconnue";
  const date = new Date(dateString);
  
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case StatutCommande.EN_ATTENTE_VALIDATION:
      return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black uppercase border border-slate-200"><Clock size={14} /> À Valider</span>;
    case StatutCommande.EN_ATTENTE_PAIEMENT:
      return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black uppercase border border-orange-200"><Clock size={14} /> Attente Paiement</span>;
    case StatutCommande.PAYEE:
      return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black uppercase border border-blue-200"><CheckCircle size={14} /> Payée</span>;
    case StatutCommande.LIVREE:
      return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase border border-emerald-200"><Truck size={14} /> Livrée</span>;
    case StatutCommande.ANNULEE:
      return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase border border-red-200"><X size={14} /> Annulée</span>;
    default:
      return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-black uppercase border border-gray-200">{status}</span>;
  }
};

const OrderDetailsSkeleton = () => (
  <div className="space-y-5">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0 animate-pulse">
        <div className="space-y-3 w-full max-w-[180px]">
          <div className="h-5 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-2/3" />
        </div>
        <div className="h-5 w-20 bg-gray-200 rounded" />
      </div>
    ))}
  </div>
);

const OrderListSkeleton = () => (
  <div className="space-y-4 w-full">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center justify-between gap-4 animate-pulse">
        <div className="flex items-center gap-5 w-full">
          <div className="h-14 w-14 rounded-xl bg-gray-200 shrink-0" />
          <div className="space-y-3 w-full max-w-[250px]">
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

const ErrorState = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 bg-red-50/50 rounded-3xl border border-red-100 w-full">
    <AlertCircle size={48} className="text-red-500 mb-4" />
    <h3 className="text-red-800 font-bold text-lg">Oups ! Une erreur est survenue</h3>
    <p className="text-red-600/70 text-sm mb-6 text-center px-4 max-w-md">{message}</p>
    <button 
      onClick={onRetry}
      className="flex items-center gap-2 px-8 py-3 bg-white border border-red-200 text-red-600 rounded-full font-bold text-sm hover:bg-red-50 transition-all shadow-sm cursor-pointer"
    >
      <Loader2 size={18} className="animate-spin-slow" /> Réessayer la connexion
    </button>
  </div>
);

export default function VendeurOrdersPage() {
  const { commandes, isFetching, refresh, error } = useCommande();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'DESC' | 'ASC'>('DESC');
  const [selectedOrder, setSelectedOrder] = useState<Commande | null>(null);
  const [lines, setLines] = useState<CommandeDetail[]>([]);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [detailError , setDetailError] = useState<string | null >(null);

  // Modaux existants
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPolicyChecked, setIsPolicyChecked] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // NOUVEAUX ÉTATS POUR LA VALIDATION OTP CÔTÉ VENDEUR
  const [otpCode, setOtpCode] = useState<string>("");
  const [isValidatingOtp, setIsValidatingOtp] = useState<boolean>(false);
  const [otpMessage, setOtpMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);

  // Logique de filtrage et tri
  const processedOrders = useMemo(() => {
    let result = [...commandes];
    if (filterStatus !== 'ALL') {
      result = result.filter(order => order.statut === filterStatus);
    }
    result.sort((a, b) => {
      const timeA = new Date(a.dateCommande).getTime();
      const timeB = new Date(b.dateCommande).getTime();
      return sortOrder === 'DESC' ? timeB - timeA : timeA - timeB;
    });
    return result;
  }, [commandes, filterStatus, sortOrder]);

  const confirmCancellation = async () => {
    if (!selectedOrder || !cancelReason) return;
    setIsSubmitting(true);
    try {
        await commandeService.annulationCommandeByquincaillerie(selectedOrder.idCommande);
        setShowCancelModal(false);
        setCancelReason("");
        setSelectedOrder(null);
        await refresh();
        toast.success("Commande annulée avec succès");
    } catch (err: any) {
        toast.error("Erreur lors de l'annulation de la commande");
        console.error("Erreur lors de l'annulation :", err);
    } finally {
        setIsSubmitting(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const confirmValidation = async () => {
    if (!selectedOrder || !isPolicyChecked) return;
    setIsSubmitting(true);
    try {
        await commandeService.validateCommandeByquincaillerie(selectedOrder.idCommande);
        setShowValidateModal(false);
        setIsPolicyChecked(false);
        setSelectedOrder(null);
        await refresh();
        await handleSelectOrder(selectedOrder);
        toast.success("Commande validée avec succès");
    } catch (err: any) {
        toast.error("Erreur lors de la validation de la commande");
        console.error("Erreur lors de la validation :", err);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleSelectOrder = async (order: Commande) => {
    setSelectedOrder(order);
    setLines([]);
    setIsDetailsLoading(true);
    setDetailError(null);
    
    // Réinitialiser les états OTP
    setOtpCode("");
    setOtpMessage(null);

    try {
      const data = await commandeService.getDetailCommande(order.idCommande);
      setLines(data);
    } catch (err: any) {
      setDetailError(err.message || "Erreur lors du chargement des détails");
      console.error(err); 
    } 
    finally { setIsDetailsLoading(false); }
  };

  // FONCTION DE VALIDATION OTP CÔTÉ VENDEUR
  const handleValidateOtp = async () => {
    if (!selectedOrder || !otpCode) return;
    setIsValidatingOtp(true);
    setOtpMessage(null);
    const otp : ValidationRetraitDTO = {
      idCommande:selectedOrder.idCommande,
      codeSaisi: otpCode
    }

    try {
      await otpService.validateOtp(otp);
      setOtpMessage({ type: 'success', text: 'Code de retrait validé avec succès. Les articles peuvent être remis au client.' });
      toast.success("Code valide !");
      await refresh();
      await handleSelectOrder(selectedOrder);
    } catch (error: any) {
      setOtpMessage({ type: 'error', text: error.message || "Code de retrait invalide ou expiré." });
    } finally {
      setIsValidatingOtp(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="max-w-full mx-auto mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Espace Vendeur Brixel</h1>
        <p className="text-base text-slate-500 mb-6 font-medium">Suivi et validation des commandes quincaillerie</p>

        {/* BARRE DE FILTRES ET TRI */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'Toutes' },
              { id: StatutCommande.EN_ATTENTE_VALIDATION, label: 'À Valider' },
              { id: StatutCommande.EN_ATTENTE_PAIEMENT, label: 'En attente paiement' },
              { id: StatutCommande.PAYEE, label: 'Payées' },
              { id: StatutCommande.LIVREE, label: 'Livrées' },
              { id: StatutCommande.ANNULEE, label: 'Annulées' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => { setFilterStatus(f.id); setSelectedOrder(null); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                  filterStatus === f.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 pl-3 md:border-l border-slate-100 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0">
             <ArrowUpDown size={18} className="text-slate-400" />
             <select 
               className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer uppercase tracking-wider"
               value={sortOrder}
               onChange={(e) => setSortOrder(e.target.value as 'DESC' | 'ASC')}
             >
                <option value="DESC">Plus Récent</option>
                <option value="ASC">Plus Ancien</option>
             </select>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto">
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

        {!isFetching && !error && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            
            {/* LISTE DES COMMANDES */}
            <div className={`w-full ${selectedOrder ? 'hidden lg:flex' : 'flex'} flex-col gap-4 lg:w-3/5 xl:w-2/3`}>
              {processedOrders.length === 0 ? (
                <div className="py-24 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Package className="text-slate-300" size={40} />
                  </div>
                  <h3 className="text-slate-900 font-black mb-2 text-lg">Aucune commande ici</h3>
                  <p className="text-slate-500 text-base font-medium">Les commandes filtrées s'afficheront ici.</p>
                </div>
              ) : (
                processedOrders.map((order) => {
                  const isSelected = selectedOrder?.idCommande === order.idCommande;
                  return (
                    <div 
                      key={order.idCommande} 
                      onClick={() => handleSelectOrder(order)}
                      className={`bg-white border rounded-2xl p-5 md:p-6 cursor-pointer transition-all ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-50 shadow-xl' : 'border-slate-200 hover:border-indigo-200'}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="flex items-start gap-5">
                          <div className={`h-14 w-14 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <Package size={28} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-black text-slate-900 text-base md:text-lg mb-1.5 tracking-tight">#{order.idCommande}</h3>
                            <div className="flex flex-row gap-6">
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                                <Calendar size={14} className="shrink-0" />
                                <span>{formatFullDate(order.dateCommande)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                                <User size={16} className="shrink-0" />
                                <span className="truncate">{order.clientName || "Client Particulier"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-3 border-t md:border-0 pt-4 md:pt-0">
                          <p className="text-xl font-black text-slate-900">{order.montantTotal.toLocaleString()} F</p>
                          {getStatusBadge(order.statut)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* DÉTAILS DE LA COMMANDE */}
            {selectedOrder && (
              <div className="w-full lg:w-2/5 xl:w-1/3 bg-white rounded-3xl border border-slate-200 shadow-2xl lg:sticky lg:top-8 overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* FLÈCHE DE RETOUR SUR MOBILE */}
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="lg:hidden p-2.5 -ml-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all cursor-pointer shadow-sm"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1.5">Fiche Commande</p>
                      <h2 className="text-base md:text-lg font-black text-slate-900">#{selectedOrder.idCommande}</h2>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(selectedOrder.statut)}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {/* Info Client ET Saisie OTP */}
                  <div className="mb-8 flex flex-col xl:flex-row xl:items-center justify-between gap-5 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-50">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-sm uppercase shrink-0">
                        {selectedOrder.clientName?.charAt(0) || "C"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 mb-0.5">{selectedOrder.clientName || "Client Particulier"}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{formatFullDate(selectedOrder.dateCommande)}</p>
                      </div>
                    </div>

                    {/* Bloc validation OTP visible uniquement si la commande est payée */}
                    {selectedOrder.statut === StatutCommande.PAYEE && (
                      <div className="flex items-center gap-3 border-t xl:border-t-0 xl:border-l border-indigo-100 pt-4 xl:pt-0 xl:pl-5 w-full xl:w-auto">
                        <input
                          type="text"
                          placeholder="Code (6 ch.)"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                          className="w-full xl:w-32 px-4 py-2.5 text-sm font-black text-slate-900 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 tracking-widest text-center placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-400"
                        />
                        <button
                          onClick={handleValidateOtp}
                          disabled={isValidatingOtp || otpCode.length < 6}
                          className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-black hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center gap-2 shadow-md shadow-indigo-100 cursor-pointer"
                        >
                          {isValidatingOtp ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
                          Valider
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Zone de retour d'erreur/succès pour l'OTP */}
                  {otpMessage && (
                    <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-sm font-bold ${
                      otpMessage.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                    }`}>
                      {otpMessage.type === 'error' ? <AlertCircle size={20} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={20} className="shrink-0 mt-0.5" />}
                      <span className="leading-relaxed">{otpMessage.text}</span>
                    </div>
                  )}

                  {/* Liste Articles */}
                  {isDetailsLoading ? (
                    <div className="py-4">
                      <OrderDetailsSkeleton />
                    </div>
                    ): detailError ? (
                      <div><ErrorState message={detailError} onRetry={() =>handleSelectOrder(selectedOrder)}/></div>
                    ):(
                      <div>
                        <div className="space-y-5 mb-8">
                          <p className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5">Panier Client</p>
                          {isDetailsLoading ? (
                            <div className="py-6 text-center"><Loader2 className="animate-spin mx-auto text-indigo-400" size={32} /></div>
                          ) : (
                            lines.map((l, i) => (
                              <div key={i} className="flex justify-between items-start group">
                                <div className="pr-4">
                                  <p className="text-base font-black text-slate-800 mb-1">{l.nameProduct}</p>
                                  <p className="text-sm font-bold text-slate-500">{l.quantity}× -- {l.price.toLocaleString()} F</p>
                                </div>
                                <p className="text-base font-black text-slate-900 shrink-0">{(l.price * l.quantity).toLocaleString()} F</p>
                              </div>
                            ))
                          )}
                          <div className="pt-6 border-t-2 border-dashed border-slate-200 flex justify-between items-center mt-6">
                            <span className="text-base font-black text-slate-500 uppercase">Total Net</span>
                            <span className="text-3xl font-black text-indigo-600 tracking-tighter">{selectedOrder.montantTotal.toLocaleString()} Fcfa</span>
                          </div>
                        </div>

                        {/* Actions */}
                        {selectedOrder.statut === StatutCommande.EN_ATTENTE_VALIDATION && (
                          <div className="grid grid-cols-2 gap-4 mt-8">
                            <button onClick={() => setShowCancelModal(true)} className="py-4 rounded-2xl border-2 border-red-100 text-red-500 font-black text-xs md:text-sm uppercase tracking-widest hover:bg-red-50 transition-colors cursor-pointer">Annuler</button>
                            <button onClick={() => setShowValidateModal(true)} className="py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 cursor-pointer">Valider</button>
                          </div>
                        )}

                        {/* Message "Déjà livrée" */}
                        {selectedOrder.statut === StatutCommande.LIVREE && (
                          <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                            <p className="text-sm font-black text-emerald-700 uppercase tracking-widest flex items-center justify-center gap-2">
                               <Truck size={20} /> Commande déjà livrée
                            </p>
                          </div>
                        )}

                        {selectedOrder.statut === StatutCommande.PAYEE && selectedOrder.factureUrl && (
                          <div className="mt-8 pt-8 border-t border-slate-100">
                            <p className="text-xs font-black text-slate-500 uppercase mb-4 flex items-center gap-2"><FileText size={16}/> Visualisation Facture</p>
                            <iframe src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedOrder.factureUrl)}&embedded=true`} className="w-full h-72 rounded-2xl border border-slate-200 bg-slate-50 shadow-inner" />
                          </div>
                        )}
                      </div>
                    )
                  }
                  
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showValidateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
              <div className="flex items-center gap-3 text-indigo-600">
                <CheckCircle2 size={28} />
                <h3 className="font-black text-xl">Validation de stock</h3>
              </div>
              <button onClick={() => setShowValidateModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={24}/></button>
            </div>
            
            <div className="p-8">
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-6 flex gap-4 items-start">
                <AlertTriangle className="text-indigo-600 shrink-0" size={28} />
                <div className="text-base leading-relaxed text-indigo-900">
                  <p className="font-black mb-2 uppercase text-xs tracking-wider">Engagement Brixel :</p>
                  En validant cette commande, vous vous engagez à <strong className="font-black">bloquer ce stock pendant 24h</strong> (délai de paiement accordé au client).
                </div>
              </div>

              <div className="space-y-4 mb-8 text-base text-slate-600 leading-relaxed">
                <p>⚠️ Toute vente du stock réservé durant ce délai constitue une violation grave. Brixel se réserve le droit de <strong className="text-slate-900">suspendre ou supprimer définitivement votre boutique</strong> en cas de non-respect répétitif.</p>
                <a href="#" className="text-indigo-600 font-bold flex items-center gap-1.5 hover:underline mt-4">
                  Plus d'infos sur la politique de confidentialité <ExternalLink size={16} />
                </a>
              </div>

              <label className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer group transition-all hover:bg-slate-100 mb-8">
                <input 
                  type="checkbox" 
                  checked={isPolicyChecked}
                  onChange={(e) => setIsPolicyChecked(e.target.checked)}
                  className="mt-1 w-6 h-6 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-base font-bold text-slate-800 group-hover:text-slate-900 leading-snug">
                  Oui, j'ai compris et j'accepte de geler le stock pour 24h.
                </span>
              </label>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowValidateModal(false)} className="flex-1 py-4 font-black text-sm uppercase text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">Annuler</button>
                <button 
                  disabled={!isPolicyChecked || isSubmitting}
                  onClick={confirmValidation}
                  className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-lg cursor-pointer ${isPolicyChecked ? 'bg-indigo-600 text-white shadow-indigo-200 hover:scale-[1.02]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Confirmer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 flex justify-between items-center border-b border-slate-50">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle size={28} />
                <h3 className="font-black text-xl">Annuler la commande</h3>
              </div>
              <button onClick={() => setShowCancelModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={24}/></button>
            </div>

            <div className="p-8">
              <p className="text-base text-slate-600 font-bold mb-6 italic">Pourquoi souhaitez-vous annuler cette commande ?</p>
              
              <div className="space-y-4 mb-8">
                {["Rupture de stock (Manque de stock)", "Prix non à jour", "Pas confiance à Brixel", "Autre raison"].map((reason) => (
                  <label key={reason} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${cancelReason === reason ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                    <input 
                      type="radio" 
                      name="cancel" 
                      value={reason} 
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-5 h-5 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span className={`text-base font-black ${cancelReason === reason ? 'text-red-700' : 'text-slate-700'}`}>{reason}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-4 font-black text-sm uppercase text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">Retour</button>
                <button 
                  disabled={!cancelReason || isSubmitting}
                  onClick={confirmCancellation}
                  className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase transition-all shadow-lg cursor-pointer ${cancelReason ? 'bg-red-600 text-white shadow-red-200 hover:scale-[1.02]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Annuler la commande"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}