'use client';

import SalesChart from '@/src/components/ui/vendeur/charts/SalesChart';
import OrdersChart from '@/src/components/ui/vendeur/charts/OrdersChart';
import ViewsChart from '@/src/components/ui/vendeur/charts/ViewsChart';
import { 
  TrendingUp, Star, Box, ShoppingBag, AlertTriangle, 
  PlusCircle, RefreshCw, Tag, Store, Clock, Activity,
  MessageCircle, Wallet,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardVendeur() {
  return (
    
    <div className="relative pb-24 w-full overflow-clip">
      
      
      <main className="p-4 md:p-8 space-y-8 w-full">

        
        <div className="grid grid-cols-3 divide-x divide-app-secondary/10 p-4 md:p-6 bg-white rounded-2xl shadow-sm border border-app-secondary/10 w-full">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="w-4 h-4 text-app-price-green" />
              <span className="text-[10px] md:text-xs text-app-secondary uppercase font-bold tracking-wider">CA Mois</span>
            </div>
            <span className="text-lg md:text-2xl font-black text-app-price-green leading-none">2,3M F</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 mb-2">
              <Star className="w-4 h-4 text-app-star-yellow" />
              <span className="text-[10px] md:text-xs text-app-secondary uppercase font-bold tracking-wider">Note</span>
            </div>
            <span className="text-lg md:text-2xl font-black text-app-star-yellow leading-none">4.7 ★</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-1.5 mb-2">
              <Box className="w-4 h-4 text-app-primary" />
              <span className="text-[10px] md:text-xs text-app-secondary uppercase font-bold tracking-wider">Produits</span>
            </div>
            <span className="text-lg md:text-2xl font-black text-app-primary leading-none">38</span>
          </div>
        </div>

      
        <div className="w-full">
          <h2 className="text-sm md:text-base font-bold text-app-primary mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-app-accent" /> Aujourd'hui
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 w-full">
            <StatCard title="Ventes (F CFA)" value="145 000 F" trend="+12%" isPositive={true} icon={Wallet} color="text-app-price-green" bg="bg-green-50" border="border-green-200" />
            <StatCard title="Commandes" value="12" trend="+3" isPositive={true} icon={ShoppingBag} color="text-blue-500" bg="bg-blue-50" border="border-blue-200" />
            <div className="sm:col-span-2 md:col-span-1">
              <StatCard title="Alertes Stock" value="04" trend="Action" isPositive={false} icon={AlertTriangle} color="text-app-accent" bg="bg-red-50" border="border-red-200" />
            </div>
          </div>
        </div>

        
        
        <div className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-bold text-app-primary flex items-center gap-2">
              <Activity className="w-4 h-4 text-app-accent" /> Performances
            </h2>
            <Link 
              href="/vendeur/statistiques" 
              className="flex items-center gap-1 text-xs font-bold text-app-secondary hover:text-app-primary transition-colors group"
            >
              Voir plus 
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="min-w-[85vw] md:min-w-0 w-full snap-center"><SalesChart /></div>
            <div className="min-w-[85vw] md:min-w-0 w-full snap-center"><OrdersChart /></div>
            <div className="min-w-[85vw] md:min-w-0 w-full snap-center"><ViewsChart /></div>
          </div>
        </div>

        
        <div className="w-full">
          <h2 className="text-sm md:text-base font-bold text-app-primary mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-app-accent" /> Actions rapides
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
            <ActionCard title="Nouveau Produit" icon={PlusCircle} href="/vendeur/products/addProduct" color="text-app-primary" bg="bg-app-primary/10" border="border-app-primary/20" />
            <ActionCard title="Mettre à jour" icon={RefreshCw} href="#" color="text-app-price-green" bg="bg-green-50" border="border-green-200" />
            <ActionCard title="Créer Promo" icon={Tag} href="/vendeur/promotion/addPromotion" color="text-app-accent" bg="bg-red-50" border="border-red-200" />
            <ActionCard title="Ma Boutique" icon={Store} href="#" color="text-blue-500" bg="bg-blue-50" border="border-blue-200" />
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
          
          <div className="bg-white rounded-2xl shadow-sm border border-app-secondary/10 p-5 w-full">
            <h3 className="text-xs font-bold text-app-secondary uppercase tracking-wider mb-4 border-b border-app-secondary/10 pb-2">Dernières Ventes</h3>
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-app-secondary/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
              <ActivityItem title="Marteau 500g" time="Il y a 5 min" value="+3 500 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Ciment Portland" time="Il y a 22 min" value="+45 000 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Fer à béton 10mm" time="Il y a 1 h" value="+12 000 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Peinture Blanche 5L" time="Il y a 2 h" value="+18 000 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Peinture Blanche 5L" time="Il y a 2 h" value="+18 000 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Peinture Blanche 5L" time="Il y a 2 h" value="+18 000 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Peinture Blanche 5L" time="Il y a 2 h" value="+18 000 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Peinture Blanche 5L" time="Il y a 2 h" value="+18 000 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Peinture Blanche 5L" time="Il y a 2 h" value="+18 000 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Peinture Blanche 5L" time="Il y a 2 h" value="+18 000 F" color="text-app-price-green" bg="bg-green-50" />
              <ActivityItem title="Peinture Blanche 5L" time="Il y a 2 h" value="+18 000 F" color="text-app-price-green" bg="bg-green-50" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-app-secondary/10 p-5 w-full">
            <h3 className="text-xs font-bold text-app-secondary uppercase tracking-wider mb-4 border-b border-app-secondary/10 pb-2">Alertes & Suivi</h3>
            <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-app-secondary/20 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
              <ActivityItem title="Pointes 10cm" time="Épuisé" value="Alerte" color="text-app-accent" bg="bg-red-50" />
              <ActivityItem title="Cmd #1240" time="En attente" value="À valider" color="text-blue-500" bg="bg-blue-50" />
              <ActivityItem title="Pelles" time="Stock faible (2)" value="Alerte" color="text-app-accent" bg="bg-red-50" />
              <ActivityItem title="Cmd #1239" time="Livrée" value="Terminé" color="text-app-secondary" bg="bg-gray-100" />
              <ActivityItem title="Cmd #1239" time="Livrée" value="Terminé" color="text-app-secondary" bg="bg-gray-100" />
              <ActivityItem title="Cmd #1239" time="Livrée" value="Terminé" color="text-app-secondary" bg="bg-gray-100" />
              <ActivityItem title="Cmd #1239" time="Livrée" value="Terminé" color="text-app-secondary" bg="bg-gray-100" />
              <ActivityItem title="Cmd #1239" time="Livrée" value="Terminé" color="text-app-secondary" bg="bg-gray-100" />
              <ActivityItem title="Cmd #1239" time="Livrée" value="Terminé" color="text-app-secondary" bg="bg-gray-100" />
              <ActivityItem title="Cmd #1239" time="Livrée" value="Terminé" color="text-app-secondary" bg="bg-gray-100" />
            </div>
          </div>

        </div>

      </main>

      
      <button className="fixed bottom-6 right-4 md:right-8 w-12 h-12 md:w-14 md:h-14 bg-app-primary text-white rounded-full shadow-lg shadow-app-primary/30 flex items-center justify-center hover:scale-105 transition-transform z-50">
        <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
      </button>

    </div>
  );
}

function StatCard({ title, value, trend, isPositive, icon: Icon, color, bg, border }: any) {
  return (
    <div className={`flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border hover:shadow-md transition-all group ${border} w-full cursor-pointer`}>
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="flex flex-col grow truncate">
        <span className="text-[10px] md:text-xs text-app-secondary uppercase font-bold tracking-wider truncate mb-0.5">{title}</span>
        <h3 className="text-sm md:text-lg font-black text-app-primary leading-tight truncate">{value}</h3>
      </div>
      <div className="ml-auto shrink-0 pl-1">
        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

function ActionCard({ title, icon: Icon, href, color, bg, border }: any) {
  return (
    <Link href={href} className={`flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border hover:shadow-md hover:border-transparent transition-all group w-full ${border}`}>
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <span className="text-xs md:text-sm font-bold text-app-primary truncate">{title}</span>
    </Link>
  );
}

function ActivityItem({ title, time, value, color, bg }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="truncate pr-2">
        <h4 className="text-[13px] font-bold text-app-primary group-hover:text-app-accent transition-colors truncate">{title}</h4>
        <p className="text-[10px] text-app-secondary">{time}</p>
      </div>
      <div className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold whitespace-nowrap ${bg} ${color}`}>
        {value}
      </div>
    </div>
  );
}