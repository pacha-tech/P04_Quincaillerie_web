"use client";

import { useState } from 'react';
import { Truck, Edit2, Save, X, RefreshCcw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PolitiquesVente() {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState({ deliveryDays: "Lundi au Samedi", returnAccepted: false, returnDays: 0 });
  const [form, setForm] = useState(config);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Sauvegarde des politiques...", { id: 'save-policies' });
    await new Promise(r => setTimeout(r, 1000));
    setConfig(form);
    setIsEditing(false);
    toast.success("Politiques mises à jour !", { id: 'save-policies' });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 max-w-2xl animate-in fade-in duration-200">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><Truck className="text-indigo-500" /> Politiques de vente</h3>
        {!isEditing ? (
          <button onClick={() => { setForm(config); setIsEditing(true); }} className="p-2 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"><Edit2 size={16} /></button>
        ) : (
          <button onClick={() => setIsEditing(false)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"><X size={16} /></button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-sm font-bold text-gray-600">Jours de livraison</span>
            <span className="text-sm font-black text-gray-900">{config.deliveryDays}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-sm font-bold text-gray-600">Retours acceptés</span>
            {config.returnAccepted ? (
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1"><CheckCircle size={12} /> Oui, sous {config.returnDays} jours</span>
            ) : (
              <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1"><X size={12} /> Non acceptés</span>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500">Jours d'expédition habituels</label>
            <input type="text" value={form.deliveryDays} onChange={e => setForm({ ...form, deliveryDays: e.target.value })} placeholder="Ex: Lundi au Samedi" className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="p-4 border rounded-xl bg-gray-50 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-2"><RefreshCcw size={16} /> Accepter les retours clients ?</span>
              <input type="checkbox" checked={form.returnAccepted} onChange={e => setForm({ ...form, returnAccepted: e.target.checked })} className="w-5 h-5 accent-blue-600" />
            </label>
            {form.returnAccepted && (
              <div className="pl-6 border-l-2 border-blue-200 animate-in fade-in">
                <label className="text-xs font-bold text-gray-500 block mb-1">Nombre de jours max pour un retour</label>
                <input type="number" min="1" value={form.returnDays} onChange={e => setForm({ ...form, returnDays: parseInt(e.target.value) })} className="w-24 p-2 bg-white rounded-lg border border-gray-200 text-sm font-bold text-center" />
              </div>
            )}
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Save size={16} /> Enregistrer</button>
        </form>
      )}
    </div>
  );
}