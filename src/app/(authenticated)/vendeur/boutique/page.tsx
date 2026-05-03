"use client";

import React from 'react';
import { Store } from 'lucide-react';

export default function BoutiquePage() {
  return (
    <div className="p-4 md:p-6 min-h-screen bg-app-surface w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          <Store className="text-app-primary" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Ma Boutique</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
        <Store size={48} className="text-gray-300 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Profil de la boutique</h2>
        <p className="text-gray-500 text-sm max-w-sm">
          Gérez ici la bannière, le logo, la description et les informations publiques de votre boutique BRIXEL.
        </p>
      </div>
    </div>
  );
}