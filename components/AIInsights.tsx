
import React, { useState } from 'react';
import { Product, Sale } from '../types';
import { getBusinessInsights } from '../services/geminiService';
import { BrainCircuit, Send, Sparkles, Loader2, RefreshCcw, Cpu, TrendingUp, AlertCircle } from 'lucide-react';

interface Props {
  products: Product[];
  sales: Sale[];
}

export const AIInsights: React.FC<Props> = ({ products, sales }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const result = await getBusinessInsights(products, sales, query);
    setResponse(result);
    setLoading(false);
  };

  const handleQuickAction = async (prompt: string) => {
    setQuery(prompt);
    setLoading(true);
    const result = await getBusinessInsights(products, sales, prompt);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="bg-orange-100 text-orange-600 p-6 rounded-[2.5rem] w-fit mx-auto shadow-xl shadow-orange-100/50">
            <Cpu className="w-12 h-12" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-orange-400 animate-bounce" />
        </div>
        <div>
          <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">Gemini Business <span className="text-orange-600 underline decoration-orange-200">Thinking</span></h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">Powered by Google Gemini 3 Pro • Análisis Mayorista Avanzado</p>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden transition-all">
        <div className="p-12">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué productos tienen mejor margen este mes? ¿Cómo optimizar mi stock?"
              className="w-full pl-8 pr-24 py-8 bg-slate-50 border-none rounded-[2.5rem] focus:ring-4 focus:ring-orange-100 outline-none text-xl font-bold placeholder:text-slate-300 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-5 rounded-[2rem] hover:bg-orange-600 disabled:bg-slate-200 transition-all shadow-xl group"
            >
              {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </button>
          </form>

          {!response && !loading && (
            <div className="mt-12 space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-4">Consultas Estratégicas</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { t: "¿Cuáles son mis 5 productos 'hueso' con menos ventas?", i: AlertCircle },
                  { t: "Analiza la tendencia de ventas de abarrotes de esta semana", i: TrendingUp },
                  { t: "Sugiere un pack mayorista para aumentar el ticket promedio", i: Sparkles },
                  { t: "Genera una lista de compras basada en el stock mínimo", i: RefreshCcw }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickAction(item.t)}
                    className="flex items-center gap-4 bg-white border border-slate-100 hover:border-orange-500 hover:bg-orange-50/30 p-6 rounded-3xl text-left transition-all group"
                  >
                    <div className="bg-slate-50 p-3 rounded-2xl group-hover:bg-orange-100 transition-colors">
                      <item.i className="w-5 h-5 text-slate-400 group-hover:text-orange-600" />
                    </div>
                    <span className="font-bold text-slate-600 group-hover:text-orange-900 text-sm">{item.t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-20 text-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 border-8 border-orange-100 border-t-orange-600 rounded-full animate-spin"></div>
                <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-orange-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Activando Modo Pensamiento</h3>
              <p className="text-slate-400 font-bold text-sm">Gemini está analizando trillones de posibilidades para tu negocio...</p>
            </div>
          )}

          {response && !loading && (
            <div className="mt-12 bg-orange-50/30 p-12 rounded-[3rem] border border-orange-100 relative animate-in fade-in slide-in-from-bottom-10 shadow-inner">
              <div className="absolute top-10 right-10 text-orange-600/10">
                <BrainCircuit className="w-32 h-32" />
              </div>
              <div className="prose prose-slate max-w-none">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-orange-600 p-2 rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-black text-orange-900 uppercase tracking-widest text-lg m-0">Resolución de Inteligencia</h4>
                </div>
                <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-xl font-medium font-serif italic">
                  {response}
                </div>
              </div>
              <div className="mt-12 flex justify-between items-center border-t border-orange-100 pt-8">
                <div className="flex gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                   <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                </div>
                <button 
                  onClick={() => { setResponse(null); setQuery(''); }}
                  className="flex items-center gap-3 px-8 py-3 bg-white text-orange-600 rounded-2xl font-black text-sm hover:bg-orange-600 hover:text-white transition-all shadow-md uppercase tracking-widest"
                >
                  <RefreshCcw className="w-4 h-4" /> Nueva Estrategia
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
