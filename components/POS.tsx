
import React, { useState, useEffect, useRef } from 'react';
import { Product, CartItem, Sale } from '../types';
import { Search, Trash2, Plus, Minus, CreditCard, Banknote, User, Delete, Printer, ShoppingCart, Scale, Box, Layers, Calculator, Sparkles } from 'lucide-react';

interface Props {
  products: Product[];
  onSaleComplete: (sale: Sale) => void;
}

export const POS: React.FC<Props> = ({ products, onSaleComplete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [amountReceived, setAmountReceived] = useState<number>(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bulkProduct, setBulkProduct] = useState<Product | null>(null);
  const [bulkQty, setBulkQty] = useState<string>('0');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.code.includes(searchTerm)
  );

  const subtotal = cart.reduce((acc, item) => acc + (item.product.salePrice * item.quantity), 0);
  const total = subtotal;

  const addToCart = (product: Product, quantity: number = 1) => {
    if (product.saleMode === 'granel' && !bulkProduct) {
      setBulkProduct(product);
      setBulkQty('0');
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setSearchTerm('');
    setBulkProduct(null);
    searchInputRef.current?.focus();
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const step = item.product.saleMode === 'granel' ? 0.1 : 1;
        const newQty = Math.max(step, item.quantity + (delta * step));
        return { ...item, quantity: parseFloat(newQty.toFixed(3)) };
      }
      return item;
    }));
  };

  const handleFinishSale = (method: Sale['paymentMethod']) => {
    const sale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      items: [...cart],
      total,
      paymentMethod: method,
      amountReceived: method === 'cash' ? amountReceived : total,
      change: method === 'cash' ? Math.max(0, amountReceived - total) : 0
    };

    onSaleComplete(sale);
    setCart([]);
    setShowPaymentModal(false);
    setAmountReceived(0);
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex items-center gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Escanear código o buscar abarrotes..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-orange-100 outline-none transition-all text-xl font-bold placeholder:text-slate-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && filteredProducts.length === 1) {
                  addToCart(filteredProducts[0]);
                }
              }}
            />
          </div>
          <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center gap-3 shadow-lg uppercase tracking-widest text-sm">
            <User className="w-5 h-5" /> F10 CLIENTE
          </button>
        </div>

        <div className="flex-1 overflow-auto scrollbar-hide">
          {searchTerm.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-100 transition-all text-left flex flex-col group animate-in fade-in slide-in-from-bottom-4 min-h-[160px] justify-between"
                >
                  <div className="px-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.code}</span>
                      <div className="bg-slate-50 px-3 py-1 rounded-full text-[9px] font-black text-slate-500 shadow-sm uppercase">
                        {p.saleMode}
                      </div>
                    </div>
                    <h4 className="font-black text-slate-800 text-lg leading-tight mb-1 group-hover:text-orange-600 transition-colors uppercase">{p.name}</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{p.category}</p>
                  </div>
                  <div className="px-2 mt-5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-3xl font-black text-orange-600 tracking-tighter leading-none">${p.salePrice.toFixed(2)}</span>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">por {p.unit}</span>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${p.stock > 0 ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white' : 'bg-red-50 text-red-400'}`}>
                      <Plus className="w-6 h-6" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-200">
              <div className="relative">
                <Calculator className="w-32 h-32 mb-6" />
                <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-orange-400 animate-pulse" />
              </div>
              <p className="text-2xl font-black tracking-tight uppercase">Terminal de Venta Lista</p>
              <p className="font-bold text-slate-300 uppercase tracking-widest text-sm">Escanea un producto para iniciar la cuenta</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-full lg:w-[450px] flex flex-col bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-orange-600 p-3 rounded-2xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg uppercase tracking-widest">Carrito de Ventas</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Terminal #01 • Admin</p>
            </div>
          </div>
          <span className="bg-orange-600 px-4 py-1 rounded-full text-xs font-black">{cart.length} ITEMS</span>
        </div>

        <div className="flex-1 overflow-auto p-8 space-y-6 scrollbar-hide">
          {cart.map(item => (
            <div key={item.product.id} className="flex gap-5 animate-in slide-in-from-right-4 items-center">
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-800 text-sm leading-tight truncate uppercase">{item.product.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">${item.product.salePrice.toFixed(2)} / {item.product.unit}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1.5 hover:bg-white rounded-lg transition-colors"><Minus className="w-3 h-3" /></button>
                    <span className="text-xs font-black min-w-[40px] text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1.5 hover:bg-white rounded-lg transition-colors"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col justify-between items-end">
                <p className="font-black text-slate-800 tracking-tighter text-lg leading-none">${(item.product.salePrice * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.product.id)} className="text-slate-300 hover:text-red-500 transition-colors mt-2"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {cart.length === 0 && <div className="h-full flex flex-col items-center justify-center text-slate-200 py-10"><ShoppingCart className="w-20 h-20 mb-4" /><p className="font-black text-xs uppercase tracking-widest">Seleccione mercancía</p></div>}
        </div>

        <div className="p-10 bg-slate-50/50 border-t border-slate-100">
          <div className="space-y-3 mb-8">
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Subtotal Neto</span>
              <span>${(total * 0.84).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>I.V.A (16%) Trasladado</span>
              <span>${(total * 0.16).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-slate-100">
              <span className="font-black text-slate-800 uppercase tracking-tighter text-lg">Importe Total</span>
              <span className="text-6xl font-black text-orange-600 tracking-tighter leading-none">${total.toFixed(2)}</span>
            </div>
          </div>
          <button 
            disabled={cart.length === 0} 
            onClick={() => setShowPaymentModal(true)} 
            className="w-full bg-orange-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-orange-200 hover:bg-orange-700 disabled:bg-slate-200 disabled:shadow-none transition-all uppercase tracking-widest"
          >
            F12 COBRAR AHORA
          </button>
        </div>
      </div>

      {bulkProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 bg-orange-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-widest"><Scale className="w-6 h-6" /> Pesaje a Granel</h3>
              <button onClick={() => setBulkProduct(null)} className="p-2 hover:bg-white/20 rounded-full"><Delete className="w-7 h-7" /></button>
            </div>
            <div className="p-10 space-y-8 text-center">
              <div>
                <h4 className="text-3xl font-black text-slate-800 tracking-tight uppercase">{bulkProduct.name}</h4>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Precio por {bulkProduct.unit}: ${bulkProduct.salePrice.toFixed(2)}</p>
              </div>
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block">Ingrese Peso Manual o Recibir de Báscula</label>
                <div className="relative">
                  <input 
                    type="number" step="any" autoFocus
                    className="w-full text-6xl font-black p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-orange-100 outline-none text-center tracking-tighter"
                    value={bulkQty}
                    onChange={(e) => setBulkQty(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') addToCart(bulkProduct, parseFloat(bulkQty)); }}
                  />
                  <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 text-2xl uppercase">{bulkProduct.unit}</span>
                </div>
              </div>
              <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                <p className="text-orange-600 font-black text-xs uppercase tracking-widest mb-1">Costo Proyectado</p>
                <p className="text-5xl font-black text-orange-700 tracking-tighter leading-none">${(bulkProduct.salePrice * parseFloat(bulkQty || '0')).toFixed(2)}</p>
              </div>
              <button onClick={() => addToCart(bulkProduct, parseFloat(bulkQty))} className="w-full py-6 bg-orange-600 text-white rounded-3xl font-black text-xl hover:bg-orange-700 transition-all uppercase tracking-widest shadow-xl shadow-orange-100">Confirmar Pesaje</button>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-50 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Total Liquidación</p>
              <h2 className="text-8xl font-black text-slate-900 tracking-tighter leading-none">${total.toFixed(2)}</h2>
            </div>
            
            <div className="p-12 space-y-10">
              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => handleFinishSale('cash')} className="p-8 border-2 border-slate-100 rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-orange-500 hover:bg-orange-50 transition-all group shadow-sm">
                  <Banknote className="w-12 h-12 text-slate-300 group-hover:text-orange-600 transition-colors" />
                  <span className="font-black text-slate-400 group-hover:text-orange-900 uppercase tracking-widest text-xs">Efectivo</span>
                </button>
                <button onClick={() => handleFinishSale('card')} className="p-8 border-2 border-slate-100 rounded-[2.5rem] flex flex-col items-center gap-4 hover:border-orange-500 hover:bg-orange-50 transition-all group shadow-sm">
                  <CreditCard className="w-12 h-12 text-slate-300 group-hover:text-orange-600 transition-colors" />
                  <span className="font-black text-slate-400 group-hover:text-orange-900 uppercase tracking-widest text-xs">Tarjeta Bancaria</span>
                </button>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest text-center block">Efectivo Recibido</label>
                <div className="relative">
                  <input type="number" autoFocus className="w-full text-5xl font-black p-6 bg-slate-50 border-none rounded-3xl focus:ring-4 focus:ring-orange-100 outline-none text-center tracking-tighter" placeholder="0.00" onChange={(e) => setAmountReceived(Number(e.target.value))} />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-200">$</span>
                </div>
              </div>

              {amountReceived >= total && (
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white flex justify-between items-center shadow-2xl animate-in slide-in-from-bottom-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Cambio a Entregar</p>
                    <p className="text-5xl font-black text-orange-500 tracking-tighter leading-none">${(amountReceived - total).toFixed(2)}</p>
                  </div>
                  <Printer className="w-10 h-10 text-slate-700" />
                </div>
              )}
            </div>
            
            <div className="p-8 bg-slate-50 flex gap-4">
               <button onClick={() => setShowPaymentModal(false)} className="flex-1 py-5 bg-white border border-slate-200 rounded-2xl font-black text-slate-400 uppercase tracking-widest hover:bg-slate-100 transition-all">Cancelar</button>
               <button onClick={() => handleFinishSale('cash')} disabled={amountReceived < total} className="flex-2 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50">Finalizar Venta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
