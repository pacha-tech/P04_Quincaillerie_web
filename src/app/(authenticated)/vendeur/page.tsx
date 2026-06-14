'use client';

import { useState, useEffect } from 'react';
import SalesChart from '@/src/components/ui/vendeur/charts/SalesChart';
import OrdersChart from '@/src/components/ui/vendeur/charts/OrdersChart';
import {
  TrendingUp, Star, Box,
  PlusCircle, RefreshCw, Tag, Store, Activity,
  MessageCircle, Wallet, Calendar,
  Trophy, ArrowUpRight, AlertCircle, CheckCircle2,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useNotification } from '@/src/hooks/NotificationContext';
import { quincaillerieService } from '@/src/services/QuincaillerieService';
import { commandeService } from '@/src/services/CommandeService';
import { DashboardData } from '@/src/types/Dashboard';
import { Commande } from '@/src/types/Commande';
import { StatutCommande } from '@/src/utils/StatutCommande';

export default function DashboardVendeur() {
  const [period, setPeriod] = useState<number>(30); // par défaut 30 jours (ce mois-ci)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'mouvements' | 'preparer'>('mouvements');
  const [chartType, setChartType] = useState<'sales' | 'orders'>('sales');
  const [allCommandes, setAllCommandes] = useState<Commande[]>([]);
  const [commandesATraiter, setCommandesATraiter] = useState<Commande[]>([]);
  const [loadingCommandes, setLoadingCommandes] = useState<boolean>(true);

  const { unreadCount } = useNotification();

  // Mouvements récents en dur (comme demandé : stock mis, attente paiement, stock bas, etc.)
  const hardcodedMovements = [
    {
      id: '1',
      title: "Ciment Portland 50kg mis en stock",
      time: "Il y a 5 min",
      badge: { label: "STOCK", bg: "bg-blue-100", text: "text-blue-800" },
      amount: null
    },
    {
      id: '2',
      title: "Cmd #1244 en attente de paiement - Marie Claire",
      time: "Il y a 15 min",
      badge: { label: "ATTENTE PAIEMENT", bg: "bg-yellow-100", text: "text-yellow-800" },
      amount: 24500
    },
    {
      id: '3',
      title: "Stock bas détecté sur Fer à béton 10mm",
      time: "Il y a 1h",
      badge: { label: "STOCK BAS", bg: "bg-red-100", text: "text-red-800" },
      amount: null
    },
    {
      id: '4',
      title: "Cmd #1240 validée et payée - Jean Dupont",
      time: "Il y a 2h",
      badge: { label: "PAYÉ", bg: "bg-green-100", text: "text-green-800" },
      amount: 85000
    }
  ];

  // Chargement des données du tableau de bord lors du changement de période (avec cache sessionStorage)
  useEffect(() => {
    let active = true;
    const cacheKey = `brixel_dashboard_data_${period}`;

    // Tenter de charger depuis le cache sessionStorage en premier (instantané)
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setDashboardData(parsed);
        setLoading(false); // désactiver le chargement immédiatement
      } catch (e) {
        console.error("Erreur de parsing du cache dashboard :", e);
      }
    } else {
      setLoading(true);
    }

    const fetchDashboard = async () => {
      try {
        setError(null);
        const data = await quincaillerieService.getDashboard(period);
        if (active) {
          setDashboardData(data);
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (err: any) {
        if (active && !cached) {
          setError(err.message || "Impossible de charger les données du tableau de bord.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchDashboard();
    return () => {
      active = false;
    };
  }, [period]);

  // Chargement des commandes payées pour le tableau "À préparer" (avec cache sessionStorage)
  useEffect(() => {
    let active = true;
    const cacheKey = `brixel_commandes_all`;

    // Tenter de charger depuis le cache sessionStorage en premier (instantané)
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setAllCommandes(parsed);
        const payees = parsed.filter((cmd: Commande) => cmd.statut === StatutCommande.PAYEE);
        setCommandesATraiter(payees);
        setLoadingCommandes(false); // désactiver le chargement immédiatement
      } catch (e) {
        console.error("Erreur de parsing du cache commandes :", e);
      }
    } else {
      setLoadingCommandes(true);
    }

    const fetchCommandes = async () => {
      try {
        const data = await commandeService.getAllCommandeByQuincaillerie();
        if (active) {
          // Tri par date décroissante (les plus récentes en premier)
          const sortedData = [...data].sort(
            (a, b) => new Date(b.dateCommande).getTime() - new Date(a.dateCommande).getTime()
          );
          setAllCommandes(sortedData);
          sessionStorage.setItem(cacheKey, JSON.stringify(sortedData));

          // Filtrage uniquement pour le statut PAYEE (commandes payées)
          const payees = sortedData.filter(
            (cmd) => cmd.statut === StatutCommande.PAYEE
          );
          setCommandesATraiter(payees);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes :", err);
      } finally {
        if (active) {
          setLoadingCommandes(false);
        }
      }
    };
    fetchCommandes();
    return () => {
      active = false;
    };
  }, []);

  const stats = dashboardData?.statistiquesCles;
  const ca = stats?.chiffreAffaires;
  const reputation = stats?.reputation;
  const fonds = dashboardData?.fondsEnAttente ?? 0;

  // Formater le montant du CA proprement
  const formattedCA = (montant: number | undefined) => {
    if (montant === undefined) return { value: "0", currency: "Fcfa" };
    if (montant >= 1000000) {
      return { value: `${(montant / 1000000).toFixed(1).replace('.', ',')}M`, currency: 'Fcfa' };
    }
    return { value: montant.toLocaleString('fr-FR'), currency: 'Fcfa' };
  };

  const caDisplay = formattedCA(ca?.montant);
  const isPositiveEvolution = ca ? ca.evolutionPourcentage >= 0 : true;

  // Calcul du format d'ancienneté de la commande
  const formatTimeAgo = (dateStr: string) => {
    const dateCmd = new Date(dateStr);
    const diffMs = Date.now() - dateCmd.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin <= 0) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Il y a ${diffH}h`;
    const diffJ = Math.floor(diffH / 24);
    return `Il y a ${diffJ}j`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-6 lg:p-8 w-full overflow-hidden">

      {/* --- EN-TÊTE --- */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-app-primary tracking-tight">Bonjour, Vendeur 👋</h1>
          <p className="text-sm text-app-secondary mt-1">Voici ce qui se passe dans votre boutique aujourd'hui.</p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
          <Calendar className="w-4 h-4 text-app-primary" />
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="bg-transparent text-sm font-bold text-app-primary outline-none cursor-pointer"
          >
            <option value={1}>Aujourd'hui</option>
            <option value={7}>7 derniers jours</option>
            <option value={30}>Ce mois-ci</option>
          </select>
        </div>
      </header>

      {/* --- ETAT DE CHARGEMENT PRINCIPAL --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4">
          <Loader2 className="w-10 h-10 text-app-primary animate-spin" />
          <p className="text-sm text-app-secondary font-medium">Chargement des données du tableau de bord...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] w-full gap-4 p-6 bg-red-50 rounded-2xl border border-red-100 max-w-2xl mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-lg font-bold text-red-800">Une erreur est survenue</h3>
          <p className="text-sm text-red-700 text-center">{error}</p>
          <button
            onClick={() => setPeriod(period)}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
          >
            Réessayer
          </button>
        </div>
      ) : (
        /* --- GRILLE PRINCIPALE (BENTO STYLE) --- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">

          {/* COLONNE GAUCHE (8/12) : Analyses et Chiffres */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Ligne 1 : Les 3 KPIs Majeurs (Hauteur réduite à h-28 pour éviter le scroll vertical global) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Carte CA en évidence (Dark/Brand mode) */}
              <div className="bg-app-primary rounded-2xl p-5 text-white shadow-lg relative overflow-hidden flex flex-col justify-between h-28">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-[11px] font-bold text-white/80 uppercase tracking-wider">Chiffre d'Affaires</span>
                  <TrendingUp className="w-4 h-4 text-app-price-green" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-2xl md:text-3xl font-black">
                    {caDisplay.value} <span className="text-lg">{caDisplay.currency}</span>
                  </h2>
                  {ca && (
                    <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium ${isPositiveEvolution ? 'text-green-300' : 'text-red-300'}`}>
                      <ArrowUpRight className={`w-3 h-3 ${isPositiveEvolution ? '' : 'rotate-90'}`} />
                      <span>
                        {isPositiveEvolution ? '+' : ''}
                        {ca.evolutionPourcentage?.toFixed(0)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Carte Note */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-28">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-app-secondary uppercase tracking-wider">Note Moyenne</span>
                  <Star className="w-4 h-4 text-app-star-yellow fill-app-star-yellow" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-app-primary">
                    {reputation?.noteMoyenne !== undefined ? reputation.noteMoyenne.toFixed(1) : "0.0"}
                    <span className="text-lg text-gray-400">/5</span>
                  </h2>
                  <p className="text-[10px] font-medium text-app-secondary mt-1">
                    {reputation?.nombreAvis ?? 0} {reputation?.nombreAvis && reputation.nombreAvis > 1 ? 'avis' : 'avis'}
                  </p>
                </div>
              </div>

              {/* Carte Produits */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between h-28">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-app-secondary uppercase tracking-wider">Produits Actifs</span>
                  <Box className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-app-primary">{stats?.produitsActifs ?? 0}</h2>
                  <p className="text-[10px] font-medium text-app-secondary mt-1">Produits en vente</p>
                </div>
              </div>
            </div>

            {/* Ligne 2 : Graphiques */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3 className="text-lg font-black text-app-primary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-app-accent" /> Évolution de l'activité
                </h3>

                {/* Sélecteur de Graphique */}
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                  <button
                    onClick={() => setChartType('sales')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${chartType === 'sales'
                      ? 'bg-white text-app-primary shadow-sm'
                      : 'text-app-secondary hover:text-app-primary/80'
                      }`}
                  >
                    Chiffre d'affaires
                  </button>
                  <button
                    onClick={() => setChartType('orders')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${chartType === 'orders'
                      ? 'bg-white text-app-primary shadow-sm'
                      : 'text-app-secondary hover:text-app-primary/80'
                      }`}
                  >
                    Commandes
                  </button>
                </div>
              </div>

              <div className="h-[310px] w-full">
                {chartType === 'sales' ? (
                  <SalesChart initialJours={period} />
                ) : (
                  <OrdersChart initialJours={period} />
                )}
              </div>
            </div>

            {/* Ligne 3 : Top Produits */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-app-primary flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-app-star-yellow" /> Top Produits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {dashboardData?.topProduits && dashboardData.topProduits.length > 0 ? (
                  dashboardData.topProduits.map((prod) => (
                    <TopProductCard
                      key={prod.idPrice}
                      rank={prod.rang}
                      name={prod.nom}
                      qty={prod.quantiteVendue}
                      trend={prod.tendance === 'HAUSSE' || prod.tendance === 'UP' ? 'up' : 'down'}
                      imageUrl={prod.imageUrl}
                      idPrice={prod.idPrice}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-6 text-sm text-app-secondary">
                    Aucun produit vendu sur cette période.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* COLONNE DROITE (4/12) : Action & Mouvements/Urgences */}
          <div className="lg:col-span-4 flex flex-col gap-6">

            {/* Le nerf de la guerre : Fonds en attente */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 shadow-sm relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Wallet className="w-24 h-24 text-orange-600" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                  <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wider">Fonds en attente</h3>
                </div>
                <h2 className="text-2xl font-black text-orange-600 mb-1">
                  {fonds.toLocaleString('fr-FR')} <span className="text-base">Fcfa</span>
                </h2>
                <p className="text-[10px] font-medium text-orange-700/80">Confirmé après livraison</p>
              </div>
            </div>

            {/* Actions Rapides en grille compacte */}
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={PlusCircle} label="Ajouter Produit" bg="bg-blue-50" color="text-blue-600" href="/vendeur/products/addProduct" />
              <QuickAction icon={RefreshCw} label="Gérer Stock" bg="bg-green-50" color="text-green-600" href="/vendeur/products" />
              <QuickAction icon={Tag} label="Créer Promo" bg="bg-red-50" color="text-red-600" href="/vendeur/promotion/addPromotion" />
              <QuickAction icon={Store} label="Ma Boutique" bg="bg-gray-100" color="text-gray-700" href="/vendeur/boutique" />
            </div>

            {/* Widget Mouvements & Préparation (Hauteur réduite à h-[400px] pour éviter le débordement) */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col h-[465px]">

              {/* Header avec Onglets */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4 shrink-0">
                <div className="flex gap-5 relative">
                  <button
                    onClick={() => setActiveTab('mouvements')}
                    className={`relative text-xs font-black pb-1 transition-colors whitespace-nowrap ${activeTab === 'mouvements'
                      ? 'text-app-primary border-b-2 border-app-primary'
                      : 'text-app-secondary hover:text-app-primary/70'
                      }`}
                  >
                    Derniers mouvements
                  </button>

                  <button
                    onClick={() => setActiveTab('preparer')}
                    className={`relative text-xs font-black pb-1 transition-colors whitespace-nowrap ${activeTab === 'preparer'
                      ? 'text-app-primary border-b-2 border-app-primary'
                      : 'text-app-secondary hover:text-app-primary/70'
                      }`}
                  >
                    Commandes à préparer
                    {commandesATraiter.length > 0 && (
                      <span className="absolute -top-1.5 -right-3 bg-red-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white">
                        {commandesATraiter.length}
                      </span>
                    )}
                  </button>
                </div>
                <Link
                  href={activeTab === 'mouvements' ? '/vendeur/mouvements' : '/vendeur/commandes'}
                  className="text-xs font-bold text-blue-500 hover:underline shrink-0"
                >
                  Voir tout
                </Link>
              </div>

              {/* Contenu Défilant */}
              <div className="flex-grow overflow-y-auto pr-1 space-y-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {loadingCommandes ? (
                  <div className="flex flex-col items-center justify-center h-full py-12 gap-2">
                    <Loader2 className="w-6 h-6 text-app-primary animate-spin" />
                    <p className="text-xs text-gray-400">Chargement...</p>
                  </div>
                ) : activeTab === 'mouvements' ? (
                  hardcodedMovements.map((item) => (
                    <MouvementItem
                      key={item.id}
                      orderId={item.badge.label}
                      customer={item.title}
                      time={item.time}
                      badge={item.badge}
                      amount={item.amount}
                      href="/vendeur/mouvements"
                    />
                  ))
                ) : (
                  commandesATraiter.length > 0 ? (
                    commandesATraiter.map((cmd) => {
                      const timeLabel = formatTimeAgo(cmd.dateCommande);
                      return (
                        <UrgencyItem
                          key={cmd.idCommande}
                          orderId={`#${cmd.idCommande.toUpperCase()}`}
                          customer={cmd.clientName || "Client"}
                          time={timeLabel}
                          amount={cmd.montantTotal}
                          href="/vendeur/commandes"
                        />
                      );
                    })
                  ) : (
                    <div className="text-center py-12 text-sm text-app-secondary bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      Aucune commande à préparer 🎉
                    </div>
                  )
                )}
              </div>

            </div>

          </div>

        </div>
      )}


      <button className="fixed bottom-6 right-4 md:right-8 w-14 h-14 bg-app-primary text-white rounded-full shadow-lg shadow-app-primary/30 flex items-center justify-center hover:scale-105 transition-transform z-50">
        <MessageCircle className="w-6 h-6" />
      </button>

    </div>
  );
}


function TopProductCard({ rank, name, qty, trend, imageUrl, idPrice }: any) {
  return (
    <Link
      href={`/vendeur/products/${idPrice}`}
      className="flex flex-col p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-app-primary/30 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${rank === 1 ? 'bg-yellow-100 text-yellow-700' : rank === 2 ? 'bg-gray-200 text-gray-700' : 'bg-orange-100 text-orange-800'}`}>
          #{rank}
        </span>
        {trend === 'up' ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />}
      </div>
      <div className="flex items-center gap-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            className="w-14 h-14 rounded-lg object-cover bg-gray-200 border border-gray-100 shrink-0"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        <div className="truncate grow">
          <h4 className="text-sm font-bold text-app-primary truncate">{name}</h4>
          <p className="text-xs font-medium text-app-secondary mt-1">{qty} vendus</p>
        </div>
      </div>
    </Link>
  );
}

function QuickAction({ icon: Icon, label, bg, color, href }: any) {
  return (
    <Link href={href} className={`${bg} p-3 rounded-xl flex flex-col items-center justify-center gap-2 hover:brightness-95 transition-all w-full text-center`}>
      <Icon className={`w-5 h-5 ${color}`} />
      <span className={`text-[11px] font-bold ${color}`}>{label}</span>
    </Link>
  );
}

function UrgencyItem({ orderId, customer, time, amount, href }: any) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors group cursor-pointer animate-fade-in">
      <div className="truncate grow pr-2">
        <div className="flex flex-col gap-1 mb-1.5">
          <span className="text-[10px] font-bold text-gray-400">{time}</span>
          <span className="text-xs font-black text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md break-all w-fit">
            {orderId}
          </span>
        </div>
        <p className="text-sm font-bold text-app-primary group-hover:text-blue-600 transition-colors">{customer}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-green-500 text-white tracking-wider shadow-sm">
            PAYÉ
          </span>
          <span className="text-xs font-medium text-app-secondary">Prêt à etre livrée</span>
        </div>
      </div>
      {amount !== undefined && amount !== null && (
        <div className="text-right shrink-0 pl-1">
          <span className="text-xs font-black text-app-primary whitespace-nowrap">
            {amount.toLocaleString('fr-FR')} Fcfa
          </span>
        </div>
      )}
    </Link>
  );
}

function MouvementItem({ orderId, customer, time, badge, amount, href }: any) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-gray-50 transition-colors group cursor-pointer animate-fade-in">
      <div className="truncate grow pr-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
          <span className="text-[10px] font-bold text-gray-400">{time}</span>
        </div>
        <p className="text-sm font-bold text-app-primary truncate group-hover:text-blue-600 transition-colors">{customer}</p>
      </div>
      {amount !== undefined && amount !== null && (
        <div className="text-right shrink-0 pl-1 animate-fade-in">
          <span className="text-xs font-black text-app-primary whitespace-nowrap">
            {amount.toLocaleString('fr-FR')} Fcfa
          </span>
        </div>
      )}
    </Link>
  );
}