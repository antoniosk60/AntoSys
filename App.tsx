
import React, { useState, useEffect, useCallback } from 'react';
import { 
  ShoppingCart, 
  Package, 
  BarChart3, 
  LayoutDashboard, 
  BrainCircuit, 
  Menu, 
  LogOut,
  Bell,
  Settings,
  Sparkles
} from 'lucide-react';
import { Product, Sale, View } from './types';
import { INITIAL_PRODUCTS } from './constants';
import { POS } from './components/POS';
import { Inventory } from './components/Inventory';
import { Dashboard } from './components/Dashboard';
import { Reports } from './components/Reports';
import { AIInsights } from './components/AIInsights';
import { WelcomeScreen } from './components/WelcomeScreen';

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    // Para una mejor experiencia, mostramos la pantalla de bienvenida cada vez que se recarga
    // o podríamos guardarlo en session. Vamos a dejarlo que siempre aparezca al iniciar sesión.
    return true;
  });
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('antoniotech_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('antoniotech_sales');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('antoniotech_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('antoniotech_sales', JSON.stringify(sales));
  }, [sales]);

  const handleAddSale = useCallback((newSale: Sale) => {
    setSales(prev => [...prev, newSale]);
    // Update inventory
    setProducts(prevProducts => {
      const updated = [...prevProducts];
      newSale.items.forEach(item => {
        const productIndex = updated.findIndex(p => p.id === item.product.id);
        if (productIndex !== -1) {
          updated[productIndex].stock -= item.quantity;
        }
      });
      return updated;
    });
  }, []);

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'sales', label: 'Ventas (F1)', icon: ShoppingCart },
    { id: 'inventory', label: 'Inventario (F2)', icon: Package },
    { id: 'reports', label: 'Reportes (F3)', icon: BarChart3 },
    { id: 'ai', label: 'Asistente IA', icon: BrainCircuit },
  ];

  // Hotkeys simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') { e.preventDefault(); setActiveView('sales'); }
      if (e.key === 'F2') { e.preventDefault(); setActiveView('inventory'); }
      if (e.key === 'F3') { e.preventDefault(); setActiveView('reports'); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (showWelcome) {
    return <WelcomeScreen onEnter={() => setShowWelcome(false)} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`bg-[#0F172A] text-white transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'} flex flex-col shadow-2xl z-40`}>
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2.5 rounded-2xl shadow-lg shadow-orange-900/20 relative shrink-0">
              <div className="w-6 h-6 flex items-center justify-center font-black text-white text-xl italic tracking-tighter">A</div>
              <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-white animate-pulse" />
            </div>
            {isSidebarOpen && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                <h1 className="font-black text-xl tracking-tight leading-none">
                  <span className="text-white">Antonio</span>
                  <span className="text-orange-500">Tech</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-[1px] w-4 bg-slate-700" />
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">POS SYSTEM</p>
                </div>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <p className="mt-4 text-[10px] font-bold text-slate-400 leading-tight italic uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
              Tecnología que impulsa tu negocio
            </p>
          )}
        </div>

        <nav className="flex-1 mt-8 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all mb-2 group ${
                activeView === item.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 min-w-[20px] transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
              {isSidebarOpen && <span className="font-black text-xs uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800/50 bg-slate-900/30">
          <button 
            onClick={() => setShowWelcome(true)}
            className="w-full flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-black text-[10px] uppercase tracking-widest">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
              <Menu className="w-6 h-6 text-slate-600" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Vista Actual</h2>
              <p className="text-sm font-black text-slate-800 uppercase tracking-tighter">
                {menuItems.find(m => m.id === activeView)?.label || activeView}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Sucursal Principal</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Terminal ID: AT-77-POS</span>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div className="flex items-center gap-2">
              <button className="p-3 text-slate-400 hover:text-orange-600 relative transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-orange-600 rounded-full border-2 border-white"></span>
              </button>
              <button className="p-3 text-slate-400 hover:text-orange-600 transition-colors">
                <Settings className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 pl-4 pr-2 py-2 rounded-2xl border border-slate-100">
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-800 leading-none">Administrador</p>
                  <p className="text-[8px] font-bold text-green-600 uppercase mt-1">En Línea</p>
               </div>
               <div className="w-10 h-10 bg-orange-100 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
               </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          <div className="max-w-[1600px] mx-auto">
            {activeView === 'dashboard' && <Dashboard products={products} sales={sales} />}
            {activeView === 'sales' && <POS products={products} onSaleComplete={handleAddSale} />}
            {activeView === 'inventory' && (
              <Inventory 
                products={products} 
                onUpdate={handleUpdateProduct} 
                onAdd={handleAddProduct} 
                onDelete={handleDeleteProduct} 
              />
            )}
            {activeView === 'reports' && <Reports sales={sales} />}
            {activeView === 'ai' && <AIInsights products={products} sales={sales} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
