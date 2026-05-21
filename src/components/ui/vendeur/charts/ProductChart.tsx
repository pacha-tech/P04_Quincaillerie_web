"use client";

import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { ChartMouvementProduct } from '@/src/types/ChartMouvementProduct';

interface ProductChartProps {
  data: ChartMouvementProduct[];
  isLoading: boolean;
}

export default function ProductChart({ data, isLoading }: ProductChartProps) {
  // --- ÉTATS DE CHARGEMENT ET VIDE (Style harmonisé) ---
  if (isLoading) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100 animate-pulse">
        <span className="text-sm text-gray-400 font-medium">Chargement du graphique...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-80 w-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <span className="text-sm text-gray-500">Aucune donnée disponible pour cette période.</span>
      </div>
    );
  }

  // Couleurs thématiques (Bleu pour Entrées, Rouge pour Sorties)
  const colorEntrees = "#3b82f6";
  const colorSorties = "#ef4444";

  return (
    // Le conteneur prend tout l'espace fourni par le parent dans ProductStats
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {/* Remplacement de LineChart par AreaChart + Marges du modèle */}
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
          
          {/* Définition des gradients (Exactement comme dans OrdersChart) */}
          <defs>
            <linearGradient id="colorEntreesU" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorEntrees} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colorEntrees} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorSortiesU" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colorSorties} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={colorSorties} stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          
          {/* Style des Axes du modèle (Police 10, gris, pas de lignes) */}
          <XAxis 
            dataKey="labelPeriode" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 10 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 10 }} 
          />
          
          {/* Tooltip épuré du modèle */}
          <Tooltip 
            cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              fontSize: '12px'
            }}
          />
          
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}/>
          
          {/* Remplacement des Line par des Area avec dégradés */}
          <Area 
            type="monotone" 
            dataKey="totalEntrees" 
            name="Entrées" 
            stroke={colorEntrees} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorEntreesU)" // Application du dégradé
            activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
          />
          <Area 
            type="monotone" 
            dataKey="totalSorties" 
            name="Sorties" 
            stroke={colorSorties} 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorSortiesU)" // Application du dégradé
            activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}