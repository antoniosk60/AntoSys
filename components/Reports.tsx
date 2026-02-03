
import React from 'react';
import { Sale } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Calendar, Filter, PieChart as PieChartIcon, List } from 'lucide-react';

interface Props {
  sales: Sale[];
}

export const Reports: React.FC<Props> = ({ sales }) => {
  // Aggregate data for payment methods
  const paymentData = [
    { name: 'Efectivo', value: sales.filter(s => s.paymentMethod === 'cash').length },
    { name: 'Tarjeta', value: sales.filter(s => s.paymentMethod === 'card').length },
    { name: 'Crédito', value: sales.filter(s => s.paymentMethod === 'credit').length },
  ].filter(d => d.value > 0);

  // Aggregate data for category distribution (by total $ amount)
  // Fix: Explicitly typing the accumulator and using Number() to ensure arithmetic operations are valid
  const categorySales = sales.reduce((acc: Record<string, number>, sale) => {
    sale.items.forEach(item => {
      const cat = item.product.category || 'Otros';
      const amount = (Number(item.product.salePrice) || 0) * (Number(item.quantity) || 0);
      acc[cat] = (acc[cat] || 0) + amount;
    });
    return acc;
  }, {} as Record<string, number>);

  // Fix: Explicitly casting or converting values to number to avoid type inference issues in arithmetic sort operation
  const categoryData = Object.entries(categorySales)
    .map(([name, value]) => ({ name, value: Number(value) }))
    .sort((a, b) => b.value - a.value);

  const PAYMENT_COLORS = ['#10b981', '#3b82f6', '#f59e0b'];
  const CATEGORY_COLORS = ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#475569', '#64748b'];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Reportes de Inteligencia</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Análisis de rendimiento y distribución de inventario</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 px-6 py-3 rounded-2xl text-slate-600 flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="w-4 h-4" />
            Últimos 30 días
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Methods Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-50 p-2 rounded-xl">
              <PieChartIcon className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Métodos de Pago</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontWeight: 'bold', fontSize: '12px', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-orange-50 p-2 rounded-xl">
              <PieChartIcon className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Ventas por Categoría</h3>
          </div>
          <div className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Venta Total']}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <PieChartIcon className="w-16 h-16 opacity-20 mb-4" />
                <p className="font-bold text-xs uppercase tracking-widest">Sin datos de categorías</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Sales Table */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-slate-50 p-2 rounded-xl">
              <List className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Últimas 10 Operaciones</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Venta</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Horario</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Monto Total</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Método Pago</th>
                  <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sales.slice(-10).reverse().map(sale => (
                  <tr key={sale.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="py-5 font-mono text-[10px] font-bold text-slate-400">#{sale.id.toUpperCase()}</td>
                    <td className="py-5 text-sm font-bold text-slate-600">
                      {new Date(sale.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="py-5">
                      <span className="text-lg font-black text-slate-800 tracking-tighter">${sale.total.toFixed(2)}</span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${sale.paymentMethod === 'cash' ? 'bg-green-500' : 'bg-blue-500'}`} />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {sale.paymentMethod === 'cash' ? 'Efectivo' : sale.paymentMethod === 'card' ? 'Tarjeta' : 'Crédito'}
                        </span>
                      </div>
                    </td>
                    <td className="py-5 text-right">
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Completado</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {sales.length === 0 && (
              <div className="py-20 text-center text-slate-300">
                <List className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-bold uppercase tracking-widest text-xs">No hay historial de ventas registrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
