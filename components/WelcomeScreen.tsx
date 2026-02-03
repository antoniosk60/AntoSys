
import React from 'react';
import { Sparkles, ArrowRight, ShoppingCart, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

interface Props {
  onEnter: () => void;
}

export const WelcomeScreen: React.FC<Props> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
      
      <div className="relative z-10 max-w-5xl w-full px-8 flex flex-col items-center text-center">
        {/* Logo Section */}
        <div className="mb-12 animate-in fade-in zoom-in duration-1000">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="bg-orange-600 p-6 rounded-[2.5rem] shadow-2xl shadow-orange-900/40 relative">
              <div className="w-16 h-16 flex items-center justify-center font-black text-white text-5xl italic tracking-tighter">A</div>
              <Sparkles className="absolute -top-3 -right-3 w-10 h-10 text-white animate-bounce" />
            </div>
            <div className="text-left">
              <h1 className="text-7xl font-black tracking-tighter leading-none text-white">
                Antonio<span className="text-orange-500">Tech</span>
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="h-[2px] w-8 bg-orange-600" />
                <p className="text-xl font-black text-slate-400 uppercase tracking-[0.4em]">POS SYSTEM</p>
              </div>
            </div>
          </div>
          <p className="text-2xl font-medium text-slate-300 italic tracking-wide">
            "Tecnología que impulsa tu negocio"
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] hover:bg-slate-800/60 transition-all group">
            <div className="bg-orange-600/20 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Ventas Flash</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed">Terminal optimizada para Linux con respuesta de milisegundos.</p>
          </div>
          
          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] hover:bg-slate-800/60 transition-all group">
            <div className="bg-blue-600/20 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">Control Total</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed">Gestión avanzada de inventarios, mermas y auditoría en tiempo real.</p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-8 rounded-[2rem] hover:bg-slate-800/60 transition-all group">
            <div className="bg-green-600/20 p-4 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">IA Predictiva</h3>
            <p className="text-slate-400 text-xs font-bold leading-relaxed">Integración con Gemini 3 Pro para detectar oportunidades de negocio.</p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onEnter}
          className="group relative bg-orange-600 hover:bg-orange-500 text-white px-12 py-6 rounded-[2rem] font-black text-2xl uppercase tracking-[0.2em] shadow-2xl shadow-orange-900/40 transition-all hover:scale-105 active:scale-95 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500"
        >
          <span className="flex items-center gap-4">
            Comenzar Operación
            <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </span>
        </button>
        
        <div className="mt-12 text-slate-500 font-bold text-[10px] uppercase tracking-[0.5em] animate-pulse">
          v2.5.0 Stable Release • Linux Certified
        </div>
      </div>
    </div>
  );
};
