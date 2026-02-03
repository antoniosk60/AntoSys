
import React from 'react';
import { Product, Sale } from '../types';
// Fixed: Added CheckCircle2 to the imports
import { DollarSign, Package, ShoppingCart, AlertTriangle, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  products: Product[];
  sales: Sale[];
}

export const Dashboard: React.FC<Props> = ({ products, sales }) => {
  const totalSalesToday = sales
    .filter(s => new Date(s.timestamp).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + curr.total, 0);

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  
  // Prepare chart data
  const last7DaysSales = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('es-MX', { weekday: 'short' });
    const dailyTotal = sales
      .filter(s => new Date(s.timestamp).toDateString() === d.toDateString())
      .reduce((acc, curr) => acc + curr.total, 0);
    return { name: dateStr, total: dailyTotal };
  }).reverse();

  const stats = [
    { label: 'Ventas del Día', value: `$${totalSalesToday.toFixed(2)}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Productos en Stock', value: products.length.toString(), icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Ventas Totales', value: sales.length.toString(), icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Bajo Inventario', value: lowStockCount.toString(), icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Resumen de Negocio</h2>
        <p className="text-slate-500">{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Tendencia de Ventas (7 días)</h3>
            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">
              <TrendingUp className="w-3 h-3" />
              +12.5%
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7DaysSales}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                />
                <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Alertas de Inventario</h3>
          <div className="space-y-4">
            {products.filter(p => p.stock <= p.minStock).slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-500">Quedan: {p.stock} unidades</p>
                </div>
                <div className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold rounded uppercase">
                  Stock Bajo
                </div>
              </div>
            ))}
            {lowStockCount === 0 && (
              <div className="text-center py-10">
                <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-slate-500 text-sm">Todo en orden</p>
              </div>
            )}
            {lowStockCount > 5 && (
              <button className="w-full py-2 text-sm text-blue-600 font-semibold hover:underline">
                Ver todos ({lowStockCount})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
