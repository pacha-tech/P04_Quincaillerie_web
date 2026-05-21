"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation'; // <-- Ajout du router pour la flèche retour
import { Package, TrendingUp, AlertCircle, Calendar, ArrowRightLeft, Clock, Filter, ArrowLeft } from 'lucide-react';
import { IndicateursPerformance } from '@/src/types/IndicateursPerformance';
import { LastMouvement } from '@/src/types/LastMouvement';
import { chartService } from '@/src/services/ChartService';
import { ChartMouvementProduct } from '@/src/types/ChartMouvementProduct';
import ProductChart from '@/src/components/ui/vendeur/charts/ProductChart';

export default function ProductStats({ params }: { params: Promise<{ idPrice: string }> }) {
  const router = useRouter();
  const { idPrice } = use(params);
  const [jours, setJours] = useState<number>(7);
  const [kpis, setKpis] = useState<IndicateursPerformance | null>(null);
  const [chartData, setChartData] = useState<ChartMouvementProduct[]>([]);
  const [lastMouv, setLastMouv] = useState<LastMouvement | null>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [kpiData, chartRes, mouvData] = await Promise.all([
          chartService.getIndicateursProduct(idPrice, jours),
          chartService.getStatsProductChart(idPrice, jours),
          chartService.getLastMouvement(idPrice)
        ]);

        setKpis(kpiData);
        setChartData(chartRes);
        setLastMouv(mouvData);
      } catch (err: any) {
        setError(err.message || "Impossible de charger les statistiques.");
      } finally {
        setIsLoading(false);
      }
    };

    if (idPrice) fetchData();
  }, [idPrice, jours]);


  // --- CARTE KPI OPTIMISÉE MOBILE ---
  const KpiCard = ({ title, value, subtext, icon: Icon, colorClass }: any) => (
    // Padding réduit et flex-col sur mobile pour éviter que le texte déborde
    <div className="bg-white rounded-xl p-3 md:p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 transition-all hover:shadow-md">
      <div className={`p-2 md:p-3 rounded-lg ${colorClass} shrink-0`}>
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <div className="w-full overflow-hidden">
        <p className="text-[10px] md:text-sm font-medium text-gray-500 truncate">{title}</p>
        <h3 className="text-lg md:text-2xl font-bold text-gray-900 mt-0.5 md:mt-1 truncate">{value !== undefined ? value : '-'}</h3>
        {subtext && <p className="text-[9px] md:text-xs text-gray-400 mt-0.5 truncate">{subtext}</p>}
      </div>
    </div>
  );

  const isEntree = lastMouv?.type?.toString().toUpperCase() === 'ENTREE';

  return (
    <div className="w-full mx-auto space-y-4 md:space-y-8 pb-6">
      
      {/* HEADER DE LA PAGE (Avec flèche retour) */}
      <div className="flex items-center gap-3">
        {/* Bouton retour : visible sur mobile, caché sur les grands écrans si tu as déjà un menu */}
        <button
          onClick={() => router.back()}
          className="md:hidden p-2 bg-white border border-gray-200 rounded-xl text-gray-600 transition hover:bg-gray-50 active:scale-95 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Performances du produit : {kpis?.nameProduct}</h2>
          {/* Sous-titre caché sur mobile pour gagner de la place */}
          <p className="hidden md:block text-sm text-gray-500 mt-1">Analyse détaillée des flux de stock et de l'activité récente.</p>
        </div>
      </div>

      {/* GESTION DES ERREURS */}
      {error && (
        <div className="p-3 md:p-4 text-xs md:text-sm text-red-800 rounded-lg bg-red-50 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      {/* ZONE DES STATISTIQUES */}
      <div className="space-y-4">
        
        {/* BARRE D'OUTILS : Titre + Filtre */}
        <div className="flex flex-row justify-between items-center gap-4 bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm">
          <div className="hidden md:flex items-center gap-2 text-gray-800 font-semibold">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3>Indicateurs & Graphique</h3>
          </div>
          
          <div className="flex items-center justify-end w-full md:w-auto gap-2">
            <Filter className="w-4 md:w-8 h-4 md:h-8 text-gray-400" />
            <span className="hidden md:block text-xl text-gray-500 font-medium">Période </span>
            <select 
              value={jours} 
              onChange={(e) => setJours(Number(e.target.value))}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-xs md:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-2 py-1.5 md:px-3 md:py-2 outline-none cursor-pointer font-medium w-full max-w-[150px] md:max-w-none"
              disabled={isLoading}
            >
              <option value={1}>Aujourd'hui</option>
              <option value={7}>7 jours</option>
              <option value={30}>30 jours</option>
              <option value={90}>3 mois</option>
            </select>
          </div>
        </div>

        {/* GRILLE DES KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <KpiCard 
            title="Stock Actuel" 
            value={isLoading ? "..." : kpis?.stockActuel} 
            icon={Package} 
            colorClass="bg-blue-50 text-blue-600"
          />
          <KpiCard 
            title={`Ventes (${jours}j)`} 
            value={isLoading ? "..." : kpis?.ventesSurPeriode} 
            subtext={kpis ? `Moy: ${kpis.moyenneVentesParSemaine}/sem` : ""}
            icon={TrendingUp} 
            colorClass="bg-emerald-50 text-emerald-600"
          />
          <KpiCard 
            title="Pertes & Casses" 
            value={isLoading ? "..." : kpis?.pertesSurPeriode} 
            icon={AlertCircle} 
            colorClass="bg-red-50 text-red-600"
          />
          <KpiCard 
            title="Réassort" 
            // Format de date raccourci pour le mobile (ex: 15/08/23)
            value={isLoading ? "..." : (kpis?.dateDernierReassort ? new Date(kpis.dateDernierReassort).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' }) : 'Aucun')} 
            icon={Calendar} 
            colorClass="bg-purple-50 text-purple-600"
          />
        </div>

        {/* SECTION GRAPHIQUE & DERNIER MOUVEMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* GRAPHIQUE */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Entrées & Sorties</h3>
            
            {/* Conteneur avec Scroll Horizontal forcé pour mobile */}
            <div className="overflow-x-auto w-full pb-2">
              {/* min-w-[500px] garantit que le chart ne s'écrase pas sur mobile et déclenche le scroll */}
              <div className="min-w-[500px] md:min-w-full">
                <ProductChart data={chartData} isLoading={isLoading} />
              </div>
            </div>
          </div>

          {/* DERNIER MOUVEMENT */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-500" />
              <h3 className="text-base md:text-lg font-bold text-gray-900">Dernière activité</h3>
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center text-xs md:text-sm text-gray-400">Chargement...</div>
            ) : lastMouv ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="text-center mb-3 md:mb-4">
                  <span className={`inline-flex items-center px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-wider
                    ${isEntree ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}
                  `}>
                    {lastMouv.type}
                  </span>
                </div>
                
                <div className="text-center">
                  <p className="text-4xl md:text-5xl font-black text-gray-900 mb-1 md:mb-2">
                    {isEntree ? '+' : '-'}{lastMouv.quantite}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 font-medium px-2">
                    {/* Format de date plus compact sur mobile */}
                    Le {new Date(lastMouv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {lastMouv.commentaire && (
                  <div className="mt-4 md:mt-6 bg-gray-50 rounded-lg p-2 md:p-3 text-xs md:text-sm text-gray-600 text-center italic border border-gray-100">
                    "{lastMouv.commentaire}"
                  </div>
                )}
              </div>
            ) : (
               <div className="flex-1 flex items-center justify-center text-gray-500 text-xs md:text-sm">
                  Aucun mouvement.
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}