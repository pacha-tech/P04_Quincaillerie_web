"use client";

import React from 'react';
import { Package, Plus } from 'lucide-react';

export default function ProduitsPage() {
  return (
    <div className="p-4 md:p-6 min-h-screen bg-app-surface w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Package className="text-app-primary" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Mes Produits</h1>
        </div>
        
        <button className="flex items-center gap-2 bg-app-primary text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-app-primary/90 transition-colors shadow-sm">
          <Plus size={18} />
          Ajouter un produit
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <Package size={48} className="text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Aucun produit pour le moment</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          C'est ici que vous pourrez gérer votre catalogue, vos stocks et vos prix.
        </p>
      </div>
    </div>
  );
}