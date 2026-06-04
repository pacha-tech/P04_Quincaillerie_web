"use client";

import { useState } from 'react';
import { Bell, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NotificationsAlertes() {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState({ newOrder: true, canceledOrder: true, stockAlert: 10, channelSMS: true, channelEmail: false });
  const [form, setForm] = useState(config);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Sauvegarde des notifications...", { id: 'save-notifs' });
    await new Promise(r => setTimeout(r, 1000));
    setConfig(form);
    setIsEditing(false);
    toast.success("Notifications mises à jour !", { id: 'save-notifs' });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 max-w-2xl animate-in fade-in duration-200">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2"><Bell className="text-amber-500" /> Alertes & Stocks</h3>
        {!isEditing ? (
          <button onClick={() => { setForm(config); setIsEditing(true); }} className="p-2 bg-gray-50 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"><Edit2 size={16} /></button>
        ) : (
          <button onClick={() => setIsEditing(false)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"><X size={16} /></button>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs text-gray-400 font-black uppercase tracking-wider mb-2">Canaux de réception</p>
            <div className="flex gap-4">
              {config.channelSMS && <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">SMS Activé</span>}
              {config.channelEmail && <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">Email Activé</span>}
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">Seuil de rupture de stock</p>
              <p className="text-xs text-gray-500">Vous serez alerté si un produit atteint cette limite.</p>
            </div>
            <div className="text-2xl font-black text-amber-600">{config.stockAlert} <span className="text-sm font-bold text-amber-500">unités</span></div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer">
              <input type="checkbox" checked={form.channelSMS} onChange={e => setForm({ ...form, channelSMS: e.target.checked })} className="w-5 h-5 accent-blue-600" />
              <span className="text-sm font-bold text-gray-800">Recevoir par SMS (Recommandé)</span>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer">
              <input type="checkbox" checked={form.channelEmail} onChange={e => setForm({ ...form, channelEmail: e.target.checked })} className="w-5 h-5 accent-blue-600" />
              <span className="text-sm font-bold text-gray-800">Recevoir par Email</span>
            </label>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500">Seuil critique de stock (Quantité minimum)</label>
            <input type="number" min="1" value={form.stockAlert} onChange={e => setForm({ ...form, stockAlert: parseInt(e.target.value) })} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2"><Save size={16} /> Enregistrer</button>
        </form>
      )}
    </div>
  );
}