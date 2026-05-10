'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const viewsData = [
  { name: 'Lun', vues: 450 },
  { name: 'Mar', vues: 620 },
  { name: 'Mer', vues: 380 },
  { name: 'Jeu', vues: 710 },
  { name: 'Ven', vues: 850 },
  { name: 'Sam', vues: 1200 },
  { name: 'Dim', vues: 980 },
];

export default function ViewsChart() {
  return (
    <div className="w-full h-[200px] bg-app-card rounded-2xl p-4 shadow-sm border border-app-secondary/10 flex flex-col">
      <div className="mb-2">
        <h3 className="text-sm font-bold text-app-primary">Vues Boutique</h3>
      </div>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={viewsData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              formatter={(value: any) => [value, "Consultations"]}
            />
            <Area type="monotone" dataKey="vues" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}