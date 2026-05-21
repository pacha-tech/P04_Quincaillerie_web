'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, TrendingUp, TrendingDown, DollarSign, 
  Package, ShoppingCart, CalendarClock, AlertCircle, 
  BarChart3, RefreshCw,
  Banknote,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { chartService } from '@/src/services/ChartService';
import { CampagnePromoStats } from '@/src/types/CampagnePromoStats';

// -- 1. TYPES (À adapter selon ton service réel) --
type CampaignStatus = 'Programmée' | 'En cours' | 'Terminée';


export default function CampaignStatsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const idCampagne = params.idCampagne as string; // Récupère l'ID depuis l'URL
  const nomCampagne = searchParams.get('nom') || 'Campagne';
  const statut = searchParams.get("statut") as CampaignStatus || 'Terminée';

  const [stats, setStats] = useState<CampagnePromoStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // -- 2. CHARGEMENT DES DONNÉES --
  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Remplace ceci par l'appel à ton vrai service
      const data = await chartService.getDetailPromotion(idCampagne);
      setStats(data);
    } catch (err) {
      setError("Impossible de charger les statistiques. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idCampagne) fetchStats();
  }, [idCampagne]);

  // -- 3. UTILITAIRES D'AFFICHAGE --
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(value);
  };

  const renderStatusBadge = (status: CampaignStatus) => {
    switch (status) {
      case 'Programmée':
        return (
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-50/80 text-blue-700 text-sm font-bold rounded-xl border border-blue-200 shadow-sm">
            <CalendarClock size={16} /> Programmée
          </span>
        );
      case 'En cours':
        return (
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-200 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            En cours
          </span>
        );
      case 'Terminée':
        return (
          <span className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-xl border border-gray-200 shadow-sm">
            Terminée
          </span>
        );
    }
  };


  
  const getPromoAnalysis = () => {
    if (!stats) return null;

    const revGrowth = stats.pourcentageAugmentationRevenu;
    const volGrowth = stats.pourcentageAugmentationVolume;

    
    if (revGrowth >= 10 && volGrowth >= 10) {
      return {
        title: "Succès commercial majeur !",
        badge: "Excellente rentabilité",
        colorClass: "border-green-200 bg-green-50/50 text-green-900",
        icon: <TrendingUp className="w-6 h-6 text-green-600" />,
        message: `La campagne est une réussite totale. Le volume de ventes a bondi de ${volGrowth}%, ce qui a surcompensé les réductions accordées pour générer une hausse nette de ${revGrowth}% de chiffre d'affaires.`
      };
    }
    
    // Cas 2 : Succès modéré ou équilibré (CA positif mais croissance douce)
    if (revGrowth > 0) {
      return {
        title: "Performance positive",
        badge: "Objectif atteint",
        colorClass: "border-blue-200 bg-blue-50/50 text-blue-900",
        icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
        message: `Bilan globalement positif. L'offre a stimulé l'activité avec une hausse de ${revGrowth}% de chiffre d'affaires. Le volume additionnel a permis de couvrir le manque à gagner.`
      };
    }

    // Cas 3 : Volume en hausse mais perte de chiffre d'affaires (Stratégie de déstockage)
    if (volGrowth > 0 && revGrowth <= 0) {
      return {
        title: "Volume stimulé, mais baisse de rentabilité",
        badge: "Déstockage / Risque de marge",
        colorClass: "border-orange-200 bg-orange-50/50 text-orange-900",
        icon: <Package className="w-6 h-6 text-orange-600" />,
        message: `Opération mitigée. Vous avez vendu plus d'articles (+${volGrowth}%), mais la réduction était trop agressive. Le volume n'a pas suffi à compenser le manque à gagner de ${formatCurrency(stats.manqueAGagner)}.`
      };
    }

    // Cas 4 : Bilan négatif (Baisse du volume et du CA)
    return {
      title: "Campagne non rentable",
      badge: "À réévaluer",
      colorClass: "border-red-200 bg-red-50/50 text-red-900",
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      message: `La promotion n'a pas rencontré son public sur cette période. Le chiffre d'affaires a reculé de ${Math.abs(revGrowth)}%. Il est conseillé de revoir le choix des produits ou la période de diffusion.`
    };
  };

  const analysis = getPromoAnalysis();



  // -- 4. RENDU DE LA PAGE --
  return (
    <div className="p-4 md:p-8 bg-app-surface min-h-[calc(100vh-4rem)] flex flex-col h-full overflow-y-auto">
      
      {/* ── EN-TÊTE DE LA PAGE ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/vendeur/promotion" 
            className="md:hidden p-2 bg-app-card border border-app-secondary/10 text-app-secondary hover:text-app-primary hover:border-app-secondary/30 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base md:text-3xl font-black text-app-primary tracking-tight flex items-center gap-3">
              <BarChart3 className="w-7 h-7 md:w-8 md:h-8 text-app-accent" />
              Statistiques de la Promotion
            </h1>
            <p className="text-xs md:text-sm text-app-secondary mt-0.5">
              {stats ? `Analyse des performances pour : ${nomCampagne}` : 'Chargement des informations...'}
            </p>
          </div>
        </div>

        {stats && (
          <div className="flex flex-row justify-end items-center gap-3">
            <button 
              onClick={fetchStats}
              className="p-2.5 text-app-secondary bg-app-card border border-app-secondary/10 hover:bg-app-surface rounded-xl transition cursor-pointer"
              title="Rafraîchir les données"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            {renderStatusBadge(statut)}
          </div>
        )}
      </div>

      {/* ── GESTION DES ÉTATS DE CHARGEMENT & ERREUR ── */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-accent mb-4"></div>
          <p className="text-app-secondary font-medium">Analyse des données en cours...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-app-card rounded-3xl border border-app-secondary/10 p-12">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-app-primary mb-2">Impossible de charger le rapport</h3>
          <p className="text-sm text-app-secondary mb-6 text-center max-w-md">{error}</p>
          <button 
            onClick={fetchStats}
            className="px-6 py-3 bg-app-accent text-white font-bold rounded-xl hover:bg-app-accent/90 transition shadow-sm active:scale-95 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Réessayer
          </button>
        </div>
      ) : stats ? (
        
        /* ── CORPS DU DASHBOARD SELON LE STATUT ── */
        <div className="w-full max-w-6xl mx-auto space-y-6">
          
          {statut === 'Programmée' ? (
            /* VUE PROGRAMMÉE */
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-app-card rounded-3xl border border-dashed border-app-secondary/20">
              <div className="w-24 h-24 bg-blue-50/50 rounded-full flex items-center justify-center mb-6">
                <CalendarClock size={48} className="text-blue-400" />
              </div>
              <h3 className="text-2xl font-black text-app-primary mb-3">La promotion n'a pas encore commencé</h3>
              <p className="text-app-secondary max-w-lg text-sm md:text-base">
                Les statistiques de ventes, le chiffre d'affaires généré et l'impact de vos réductions apparaîtront ici dès que la première vente sera effectuée sous cette campagne.
              </p>
            </div>
          ) : (
            /* VUE EN COURS / TERMINÉE */
            <>

               {analysis && (
                <div className={`p-5 md:p-6 rounded-3xl border shadow-sm transition-all duration-300 ${analysis.colorClass}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
                        {analysis.icon}
                      </div>
                      <h4 className="text-base md:text-lg font-black tracking-tight">
                        {analysis.title}
                      </h4>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 bg-white/80 rounded-full text-xs font-bold tracking-wide uppercase border border-current/10 shadow-2xs">
                      {analysis.badge}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm leading-relaxed opacity-90 font-medium">
                    {analysis.message}
                  </p>
                </div>
              )}

              {/* LIGNE 1 : KPIs Principaux */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mb-2 md:mb-6">
                
                {/* CARTE : Chiffre d'Affaires */}
                <div className="p-6 md:p-8 bg-app-card rounded-3xl border border-app-secondary/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-green-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <div className="relative flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs font-bold text-app-secondary uppercase tracking-wider mb-2">Revenus générés (CA Réel)</p>
                      <h3 className="text-4xl font-black text-app-primary tracking-tight">
                        {formatCurrency(stats.chiffreAffairesReel)}
                      </h3>
                    </div>
                    <div className="p-4 bg-green-50 rounded-2xl">
                      <Banknote className="text-green-600 w-8 h-8" />
                    </div>
                  </div>
                  
                  <div className="relative pt-6 border-t border-app-surface flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${stats.pourcentageAugmentationRevenu >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stats.pourcentageAugmentationRevenu >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {stats.pourcentageAugmentationRevenu > 0 ? '+' : ''}{stats.pourcentageAugmentationRevenu}%
                    </span>
                    <span className="text-sm font-medium text-app-secondary">vs. période précédente ({formatCurrency(stats.chiffreAffairesAvantPromo)})</span>
                  </div>
                </div>

                {/* CARTE : Volume de Ventes */}
                <div className="p-6 md:p-8 bg-app-card rounded-3xl border border-app-secondary/10 shadow-sm relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-app-accent/5 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                  
                  <div className="relative flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs font-bold text-app-secondary uppercase tracking-wider mb-2">Volume d'articles vendus</p>
                      <h3 className="text-4xl font-black text-app-primary tracking-tight flex items-baseline gap-2">
                        {stats.totalArticlesVendus} <span className="text-lg font-bold text-app-secondary">unités</span>
                      </h3>
                    </div>
                    <div className="p-4 bg-app-accent/10 rounded-2xl">
                      <Package className="text-app-accent w-8 h-8" />
                    </div>
                  </div>
                  
                  <div className="relative pt-6 border-t border-app-surface flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${stats.pourcentageAugmentationVolume >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stats.pourcentageAugmentationVolume >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {stats.pourcentageAugmentationVolume > 0 ? '+' : ''}{stats.pourcentageAugmentationVolume}%
                    </span>
                    <span className="text-sm font-medium text-app-secondary">vs. période précédente ({stats.articlesVendusAvantPromo} unités)</span>
                  </div>
                </div>

              </div>

              {/* LIGNE 2 : KPIs Secondaires */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                
                {/* CARTE : Coût de la promo */}
                <div className="p-6 bg-app-card rounded-3xl border border-app-secondary/10 shadow-sm flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-orange-50 rounded-xl">
                      <TrendingDown className="w-6 h-6 text-orange-500" />
                    </div>
                    <p className="text-sm font-bold text-app-secondary uppercase tracking-wider">Coût de la réduction (Manque à gagner)</p>
                  </div>
                  <h3 className="text-3xl font-black text-orange-600 mb-2">
                    - {formatCurrency(stats.manqueAGagner)}
                  </h3>
                  <p className="text-sm text-app-secondary font-medium">
                    Vous auriez encaissé <strong className="text-app-primary">{formatCurrency(stats.chiffreAffairesTheorique)}</strong> sans appliquer de taux de réduction.
                  </p>
                </div>

                {/* CARTE : Nombre de commandes */}
                <div className="p-6 bg-app-card rounded-3xl border border-app-secondary/10 shadow-sm flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 bg-blue-50 rounded-xl">
                      <ShoppingCart className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-sm font-bold text-app-secondary uppercase tracking-wider">Commandes</p>
                  </div>
                  <h3 className="text-3xl font-black text-app-primary mb-2">
                    {stats.nombreCommandes} <span className="text-base text-app-secondary font-bold">commande{stats.nombreCommandes > 1 ? 's' : ''}</span>
                  </h3>
                  <p className="text-sm text-app-secondary font-medium">
                    C'est le nombre de fois où un client a payer une commande contenant au moins un produit de cette promotion.
                  </p>
                </div>

              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}