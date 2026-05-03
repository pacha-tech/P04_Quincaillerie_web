"use client";

import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function StatistiquesPage() {
  return (
    <div className="p-4 md:p-6 min-h-screen bg-app-surface w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <BarChart3 className="text-app-primary" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Statistiques</h1>
      </div>

      {/* Petites cartes de résumé pour faire joli en attendant */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-32 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Donnée {item}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center h-64">
        <BarChart3 size={48} className="text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Vos performances</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Les graphiques de vos revenus et visites seront affichés sur cette page.
        </p>
      </div>
    </div>
  );
}