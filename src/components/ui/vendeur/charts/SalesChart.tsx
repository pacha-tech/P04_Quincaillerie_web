'use client';

import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartService } from '@/src/services/ChartService';
import { ChevronDown } from 'lucide-react';
import { VentesStats } from '@/src/types/VentesCharts';


interface SalesChartProps {
  initialJours?: number;
}

export default function SalesChart({ initialJours = 7 }: SalesChartProps) {
  const [salesData, setSalesData] = useState<VentesStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [jours, setJours] = useState<number>(initialJours);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const filterOptions = [
    { value: 1, label: "Aujourd'hui" },
    { value: 7, label: "7 derniers jours" },
    { value: 30, label: "Ce mois-ci" }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Assure-toi que cette méthode existe dans ton ChartService !
        const data = await chartService.getVentesStatsChart(jours);
        setSalesData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de ventes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [jours]);

  return (
    <div className="w-full h-[200px] bg-app-card rounded-2xl p-4 shadow-sm border border-app-secondary/10 flex flex-col">
      
      <div className="mb-2 flex items-center justify-between relative z-50">
        <h3 className="text-sm font-bold text-app-primary">Chiffre d'Affaires</h3>
        
        {/* Conteneur du menu personnalisé */}
        <div className="relative">
          {/* Bouton qui déclenche le menu */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-app-secondary bg-slate-50 border border-slate-200 rounded-lg py-1 pl-2.5 pr-2 hover:bg-slate-100 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-app-primary/20"
          >
            {filterOptions.find(opt => opt.value === jours)?.label}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Le menu déroulant qui s'affiche au clic */}
          {menuOpen && (
            <>
              {/* Overlay invisible pour fermer le menu quand on clique à côté */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setMenuOpen(false)}
              ></div>
              
              <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden z-50 py-1">
                {filterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setJours(opt.value);
                      setMenuOpen(false); // On ferme après avoir cliqué
                    }}
                    className={`w-full text-left px-3 py-2 text-[10px] md:text-xs font-semibold transition-colors hover:bg-slate-50 ${
                      jours === opt.value ? 'text-app-primary bg-slate-50/50' : 'text-app-secondary'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- GRAPHIQUE --- */}
      <div className="flex-1 w-full relative z-10">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
            Chargement...
          </div>
        ) : salesData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
            Aucune vente pour cette période.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 5, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
              
              {/* Formatage de l'axe Y pour afficher en "k" (ex: 150000 -> 150k) */}
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#6b7280' }} 
                tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value} 
              />
              
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} F CFA`, "Revenus"]}
              />
              
              {/* dataKey correspond au nom de la variable dans ton VentesStatsDTO backend */}
              <Area type="monotone" dataKey="chiffreAffaires" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCa)" />
              
              <defs>
                <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}