'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { name: 'Lun', ca: 120000 },
  { name: 'Mar', ca: 150000 },
  { name: 'Mer', ca: 100000 },
  { name: 'Jeu', ca: 210000 },
  { name: 'Ven', ca: 180000 },
  { name: 'Sam', ca: 320000 },
  { name: 'Dim', ca: 250000 },
];

export default function SalesChart() {
  return (
    <div className="w-full h-[200px] bg-app-card rounded-2xl p-4 shadow-sm border border-app-secondary/10 flex flex-col">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-app-primary">Ventes (F CFA)</h3>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              formatter={(value: any) => [`${Number(value).toLocaleString('fr-FR')} F`, "Ventes"]}
            />
            <Area type="monotone" dataKey="ca" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCa)" />
            <defs>
              <linearGradient id="colorCa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}