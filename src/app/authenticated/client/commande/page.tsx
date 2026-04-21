import { Package, Clock, Truck, CheckCircle, Eye, Search } from 'lucide-react';
import Link from 'next/link';

// 1. Fausses données pour le design (À remplacer par ton appel API plus tard)
const mockOrders = [
  {
    id: "CMD-2026-089",
    date: "20 Avril 2026",
    total: 125000,
    itemsCount: 4,
    status: "LIVRÉE",
  },
  {
    id: "CMD-2026-090",
    date: "18 Avril 2026",
    total: 45000,
    itemsCount: 1,
    status: "EN_COURS",
  },
  {
    id: "CMD-2026-091",
    date: "15 Avril 2026",
    total: 320000,
    itemsCount: 12,
    status: "ATTENTE",
  }
];

// 2. Fonction pour gérer le design des badges de statut
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'LIVRÉE':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
          <CheckCircle size={14} /> Livrée
        </span>
      );
    case 'EN_COURS':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
          <Truck size={14} /> En cours
        </span>
      );
    case 'ATTENTE':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
          <Clock size={14} /> En attente
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
          <Package size={14} /> Inconnu
        </span>
      );
  }
};

export default async function MyOrdersPage() {
  // Plus tard, tu feras : const orders = await OrderService.getMyOrders();
  const orders = mockOrders;

  return (
    <div className="p-5 md:p-8 space-y-6 md:space-y-8 bg-app-surface min-h-screen">
      
      {/* ── En-tête de la page ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-app-primary mb-1">
            Mes Commandes
          </h1>
          <p className="text-xs md:text-sm text-app-secondary">
            Suivez l'état de vos achats et consultez votre historique
          </p>
        </div>
      </div>

      {/* ── État : Aucune commande ────────────────────────────────────── */}
      {orders.length === 0 ? (
        <div className="py-16 md:py-24 text-center border-2 border-dashed border-app-surface rounded-3xl bg-app-card shadow-sm">
          <Package className="h-10 w-10 md:h-12 md:w-12 text-app-secondary/40 mx-auto mb-3 md:mb-4" />
          <p className="text-base md:text-lg text-app-primary font-bold mb-1 md:mb-2">
            Vous n'avez pas encore passé de commande
          </p>
          <p className="text-xs md:text-sm text-app-secondary mb-6">
            Découvrez nos matériaux et commencez vos achats.
          </p>
          <Link 
            href="/authenticated/search" // Ou le lien vers ton catalogue
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-app-accent text-white font-medium text-sm transition-all hover:opacity-90"
          >
            <Search size={16} /> Parcourir le catalogue
          </Link>
        </div>
      ) : (
        /* ── Liste des commandes ─────────────────────────────────────── */
        <div className="grid gap-4">
          {orders.map((order) => (
            <div 
              key={order.id} 
              className="bg-app-card border border-app-surface rounded-2xl p-4 md:p-5 shadow-sm transition-all hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6"
            >
              {/* Infos principales */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-app-surface flex items-center justify-center shrink-0">
                  <Package className="h-6 w-6 text-app-secondary" />
                </div>
                
                <div>
                  <h3 className="font-bold text-app-primary text-sm md:text-base mb-1">
                    Commande #{order.id}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-app-secondary">
                    <span>Date : {order.date}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{order.itemsCount} article(s)</span>
                  </div>
                </div>
              </div>

              {/* Prix, Statut et Action */}
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-4 md:gap-6 w-full md:w-auto border-t border-app-surface md:border-none pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-xs text-app-secondary mb-0.5">Total</p>
                  <p className="font-bold text-app-accent text-sm md:text-base">
                    {order.total.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>

                <div>
                  {getStatusBadge(order.status)}
                </div>

                {/* Bouton Voir Détails */}
                <Link 
                  href={`/authenticated/client/orders/${order.id}`} 
                  className="p-2 md:px-4 md:py-2 rounded-full bg-app-surface text-app-primary hover:bg-app-primary hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <span className="hidden md:inline">Détails</span>
                  <Eye size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}