import React from 'react';
import { TrendingUp, Tag, AlertTriangle } from 'lucide-react'; // Petites icônes sympas

export default function VendeurDashboard() {
  // Imagine que ces données viennent de ton API plus tard
  const stats = [
    { 
      label: "Ventes totales", 
      value: "1.250.000 FCFA", 
      color: "blue", 
      icon: <TrendingUp size={20} /> 
    },
    { 
      label: "Promotions actives", 
      value: "12 articles", 
      color: "green", 
      icon: <Tag size={20} /> 
    },
    { 
      label: "Stock faible", 
      value: "5 alertes", 
      color: "orange", 
      icon: <AlertTriangle size={20} /> 
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-8">
        Tableau de bord <span className="text-orange-500">Brixel</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item, index) => (
          <div 
            key={index}
            className={`p-6 border rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md
              ${item.color === 'blue' ? 'bg-blue-50 border-blue-100' : 
                item.color === 'green' ? 'bg-green-50 border-green-100' : 
                'bg-orange-50 border-orange-100'}`}
          >
            <div className={`mb-4 flex items-center justify-center w-10 h-10 rounded-lg 
              ${item.color === 'blue' ? 'text-blue-600 bg-blue-100' : 
                item.color === 'green' ? 'text-green-600 bg-green-100' : 
                'text-orange-600 bg-orange-100'}`}>
              {item.icon}
            </div>
            
            <p className={`text-sm font-semibold uppercase tracking-wider
              ${item.color === 'blue' ? 'text-blue-500' : 
                item.color === 'green' ? 'text-green-500' : 
                'text-orange-500'}`}>
              {item.label}
            </p>
            
            <p className="text-3xl font-black text-gray-900 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}