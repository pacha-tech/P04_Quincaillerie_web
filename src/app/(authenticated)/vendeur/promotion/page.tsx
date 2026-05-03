

'use client';

import { 
  Tag, Plus, Calendar, Clock, MoreVertical, 
  AlertCircle, Search, CheckCircle, Edit3, Trash2, Eye, Hourglass, CalendarDays
} from 'lucide-react';
import Link from 'next/link';
import { promotionService } from '@/src/services/PromotionService';
import { useState, useEffect, useRef } from 'react';
import { Promotion } from '@/src/types/Promotion';

export default function PromotionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [selectedStatut, setSelectedStatut] = useState<string | 'Tous'>('Tous');
  
  const menuRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeMenu !== null && !Object.values(menuRefs.current).some(ref => ref && ref.contains(event.target as Node))) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu]);

  // Extraction de la fonction pour pouvoir l'appeler au chargement ET via le bouton "Réessayer"
  const fetchPromotions = async () => {
    try {
      setIsLoading(true);
      setError(null); // On réinitialise l'erreur au cas où c'est une nouvelle tentative

      const response = await promotionService.getAllPromotion();

      const promotions: Promotion[] = response.map(item => ({
        name: item.name,
        taux: item.taux,
        dateDebut: item.dateDebut,
        dateFin: item.dateFin,
        estActif: item.estActif,
        nbreProduits: item.nbreProduits,
      }));
      
      setPromotions(promotions);
    } catch (err: any) {
      setError("Impossible de charger les promotions. Veuillez vérifier votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const getStatutPromotion = (promo: Promotion) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(promo.dateDebut.replace(/-/g, '/'));
    const end = new Date(promo.dateFin.replace(/-/g, '/'));

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (!promo.estActif) {
      return 'Terminée';
    }

    if (today >= start && today <= end) {
      return 'En cours';
    } else if (today < start) {
      return 'Programmée';
    } else {
      return 'Terminée';
    }
  };

  const filteredPromotions = promotions.filter(promo => {
    const nomPromotion = promo.name || "";
    const matchesSearch = nomPromotion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const promoStatut = getStatutPromotion(promo);
    const matchesStatut = selectedStatut === 'Tous' || promoStatut === selectedStatut;

    return matchesSearch && matchesStatut;
  });

  const total = promotions.length;
  const enCours = promotions.filter(p => getStatutPromotion(p) === 'En cours').length;
  const programmees = promotions.filter(p => getStatutPromotion(p) === 'Programmée').length;
  const terminees = promotions.filter(p => getStatutPromotion(p) === 'Terminée').length;

  return (
    <div className="p-4 md:p-8 bg-app-surface min-h-[calc(100vh-4rem)] flex flex-col h-full overflow-y-hidden">
      
      {/* ── EN-TÊTE ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-app-primary tracking-tight flex items-center gap-2">
            <Tag className="w-7 h-7 md:w-8 md:h-8 text-app-accent" />
            Promotions
          </h1>
          <p className="text-xs md:text-sm text-app-secondary mt-0.5">Gérez vos réductions globales et offres spéciales</p>
        </div>

        <Link 
          href="/vendeur/promotion/addPromotion" 
          className="hidden md:flex fixed right-10 items-center justify-center gap-2 px-5 py-2.5 bg-app-accent text-white font-bold rounded-xl hover:bg-app-accent/90 transition-all active:scale-95 shadow-sm shadow-app-accent/20"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Promotion
        </Link>
      </div>

      {/* ── STATISTIQUES RAPIDES ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8 shrink-0">
        <button 
          onClick={() => setSelectedStatut('Tous')}
          className={`p-3 md:p-5 text-left rounded-2xl shadow-sm border transition-all cursor-pointer ${
            selectedStatut === 'Tous' 
              ? 'bg-app-card border-app-accent shadow-app-accent/10' 
              : 'bg-app-card border-app-secondary/10 hover:-translate-y-1'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs font-semibold text-app-secondary uppercase tracking-wider mb-0.5">Total</p>
              <p className="text-lg md:text-2xl font-black text-app-primary">{total}</p>
            </div>
            <div className="p-2 md:p-3 bg-app-surface rounded-xl text-app-secondary hidden md:block">
              <Tag className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </button>

        <button 
          onClick={() => setSelectedStatut('En cours')}
          className={`p-3 md:p-5 text-left rounded-2xl shadow-sm border transition-all cursor-pointer ${
            selectedStatut === 'En cours' 
              ? 'bg-app-card border-red-500 shadow-red-500/10' 
              : 'bg-app-card border-app-secondary/10 hover:-translate-y-1'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs font-semibold text-app-secondary uppercase tracking-wider mb-0.5">En cours</p>
              <p className="text-lg md:text-2xl font-black text-app-accent">{enCours}</p>
            </div>
            <div className="p-2 md:p-3 bg-red-50 rounded-xl text-red-600 hidden md:block">
              <Hourglass className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </button>

        <button 
          onClick={() => setSelectedStatut('Programmée')}
          className={`p-3 md:p-5 text-left rounded-2xl shadow-sm border transition-all cursor-pointer ${
            selectedStatut === 'Programmée' 
              ? 'bg-app-card border-blue-500 shadow-blue-500/10' 
              : 'bg-app-card border-app-secondary/10 hover:-translate-y-1'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs font-semibold text-app-secondary uppercase tracking-wider mb-0.5">Programmées</p>
              <p className="text-lg md:text-2xl font-black text-blue-600">{programmees}</p>
            </div>
            <div className="p-2 md:p-3 bg-blue-50 rounded-xl text-blue-600 hidden md:block">
              <CalendarDays className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </button>

        <button 
          onClick={() => setSelectedStatut('Terminée')}
          className={`p-3 md:p-5 text-left rounded-2xl shadow-sm border transition-all cursor-pointer ${
            selectedStatut === 'Terminée' 
              ? 'bg-app-card border-gray-500 shadow-gray-500/10' 
              : 'bg-app-card border-app-secondary/10 hover:-translate-y-1'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] md:text-xs font-semibold text-app-secondary uppercase tracking-wider mb-0.5">Terminées</p>
              <p className="text-lg md:text-2xl font-black text-app-secondary">{terminees}</p>
            </div>
            <div className="p-2 md:p-3 bg-gray-50 rounded-xl text-gray-500 hidden md:block">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        </button>
      </div>

      {/* ── LISTE DES PROMOTIONS AVEC DÉFILEMENT INDÉPENDANT ── */}
      <div className="bg-app-card rounded-3xl shadow-sm border border-app-secondary/10 flex flex-col h-170 overflow-hidden">
        
        <div className="p-4 border-b border-app-surface flex items-center justify-between shrink-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-secondary" />
            <input 
              type="text" 
              placeholder="Rechercher une promotion..." 
              className="w-full pl-10 pr-4 py-2 bg-app-surface border-none rounded-xl text-sm focus:ring-2 focus:ring-app-accent outline-none text-app-primary font-medium placeholder:font-normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error ? (
          /* GESTION DU CAS D'ERREUR */
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-app-surface/20">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-app-primary">Oups, une erreur est survenue</h3>
            <p className="text-sm text-app-secondary max-w-sm mt-1 mb-6">{error}</p>
            <button 
              onClick={fetchPromotions}
              className="px-6 py-2.5 bg-app-accent text-white font-bold rounded-xl hover:bg-app-accent/90 transition shadow-sm active:scale-95"
            >
              Réessayer
            </button>
          </div>
        ) : isLoading ? (
          <div className="p-12 text-center text-app-secondary flex-1 flex items-center justify-center">Chargement en cours...</div>
        ) : (
          <div className="overflow-y-scroll flex-1 scrollbar-hide">
            <table className="w-full text-left border-collapse">
              <thead className="bg-app-surface text-xs text-app-secondary uppercase tracking-wider sticky top-0 z-10">
                <tr>
                  <th className="p-4 font-bold">Nom de la promotion</th>
                  <th className="p-4 font-bold">Taux</th>
                  <th className="p-4 font-bold">Période (Détails)</th>
                  <th className="p-4 font-bold">Produits concernés</th>
                  <th className="p-4 font-bold">Statut</th>
                  <th className="p-4 font-bold text-center">Voir plus</th>
                  <th className="p-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-surface text-sm">
                {filteredPromotions.length > 0 ? (
                  filteredPromotions.map((promo, index) => {
                    const statutDynamique = getStatutPromotion(promo);

                    return (
                      <tr key={index} className="hover:bg-app-surface/30 transition-colors group">
                        <td className="p-4 font-bold text-app-primary">{promo.name}</td>
                        
                        <td className="p-4">
                          <span className="px-2 py-1 bg-app-accent/10 text-app-accent font-black rounded-lg">
                            {promo.taux}%
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col gap-1 text-xs text-app-secondary">
                            <span className="flex items-center gap-1.5 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-app-secondary" /> <span className="hidden md:block font-bold">Début :</span> {promo.dateDebut}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /><span className="hidden md:block font-bold">Fin :</span> {promo.dateFin}
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-app-primary font-semibold">
                          {promo.nbreProduits ?? 0} article{(promo.nbreProduits ?? 0) > 1 ? 's':''}
                        </td>

                        <td className="p-4">
                          {statutDynamique === 'En cours' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 border border-red-200 text-red-700 font-bold rounded-full text-xs">
                              {statutDynamique}
                            </span>
                          )}
                          {statutDynamique === 'Programmée' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-full text-xs">
                              {statutDynamique}
                            </span>
                          )}
                          {statutDynamique === 'Terminée' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 border border-gray-200 text-gray-500 font-bold rounded-full text-xs">
                              {statutDynamique}
                            </span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <button className="p-2 text-app-accent bg-app-accent/10 hover:bg-app-accent/20 rounded-xl transition cursor-pointer mx-auto flex items-center justify-center">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>

                        <td className="p-4 text-center relative">
                          <div ref={(el) => { menuRefs.current[index] = el; }} className="relative inline-block">
                            <button 
                              onClick={() => setActiveMenu(activeMenu === index ? null : index)}
                              className="p-2 text-app-secondary hover:text-app-primary hover:bg-app-surface rounded-lg transition-colors cursor-pointer"
                            >
                              <MoreVertical className="w-5 h-5" />
                            </button>

                            {activeMenu === index && (
                              <div className="absolute right-10 top-0 z-[9999] mt-2 w-40 bg-app-card border border-app-surface rounded-xl shadow-lg flex flex-col py-1 text-left">
                                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-app-primary hover:bg-app-surface transition cursor-pointer">
                                  <Edit3 className="w-4 h-4 text-app-secondary" /> Modifier
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50/50 transition cursor-pointer">
                                  <Trash2 className="w-4 h-4 text-red-500" /> Supprimer
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  /* GESTION DU CAS LISTE VIDE OU RECHERCHE INFRUCTUEUSE */
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-app-surface rounded-full flex items-center justify-center mb-4">
                          <Tag className="w-8 h-8 text-app-secondary/50" />
                        </div>
                        <h3 className="text-lg font-bold text-app-primary">
                          {searchTerm ? "Aucun résultat trouvé" : "Aucune promotion"}
                        </h3>
                        <p className="text-sm text-app-secondary max-w-sm mt-1">
                          {searchTerm 
                            ? `Aucune promotion ne correspond à "${searchTerm}".` 
                            : "Lancez une nouvelle promotion pour dynamiser vos ventes dès aujourd'hui."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── BOUTON FLOTTANT SUR MOBILE ── */}
      <Link 
        href="/authenticated/vendeur/promotion/addPromotion" 
        className="md:hidden fixed bottom-6 right-6 z-[9000] flex items-center justify-center w-14 h-14 bg-app-accent text-white rounded-full shadow-2xl hover:bg-app-accent/90 transition active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}