
import React, { useState } from 'react';
import { Product, SaleMode } from '../types';
import { CATEGORIES } from '../constants';
import { Plus, Search, Edit2, Trash2, Package, Save, X, Scale, Box, Layers, Info, DollarSign, TrendingUp, Image as ImageIcon } from 'lucide-react';

interface Props {
  products: Product[];
  onUpdate: (p: Product) => void;
  onAdd: (p: Product) => void;
  onDelete: (id: string) => void;
}

export const Inventory: React.FC<Props> = ({ products, onUpdate, onAdd, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [formData, setFormData] = useState<Partial<Product>>({});

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.includes(searchTerm);
    const matchesCategory = selectedCategory === 'Todas' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const startEdit = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    setFormData(p);
    setEditingId(p.id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      onDelete(id);
    }
  };

  const handleSave = () => {
    const data: Product = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      code: formData.code || '',
      name: formData.name || '',
      description: formData.description || '',
      category: formData.category || CATEGORIES[0],
      saleMode: (formData.saleMode as SaleMode) || 'pieza',
      unit: formData.unit || 'pz',
      stock: Number(formData.stock) || 0,
      minStock: Number(formData.minStock) || 0,
      salePrice: Number(formData.salePrice) || 0,
      purchasePrice: Number(formData.purchasePrice) || 0,
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&h=400&auto=format&fit=crop'
    };

    if (editingId) {
      onUpdate(data);
      setEditingId(null);
    } else {
      onAdd(data);
      setIsAdding(false);
    }
    setFormData({});
  };

  const margin = viewingProduct ? ((viewingProduct.salePrice - viewingProduct.purchasePrice) / viewingProduct.salePrice * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Inventario de Abarrotes</h2>
        <button 
          onClick={() => { setFormData({ saleMode: 'pieza', unit: 'pz' }); setIsAdding(true); }}
          className="bg-orange-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-200 flex items-center gap-2"
        >
          <Plus className="w-6 h-6" />
          NUEVO PRODUCTO
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o marca..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {['Todas', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-widest ${
                selectedCategory === cat ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Producto</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Código</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Categoría</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Stock Actual</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Precio Venta</th>
              <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(p => (
              <tr 
                key={p.id} 
                onClick={() => setViewingProduct(p)}
                onMouseEnter={() => setHoveredProductId(p.id)}
                onMouseLeave={() => setHoveredProductId(null)}
                className="hover:bg-orange-50/60 transition-colors group cursor-pointer relative"
              >
                <td className="px-6 py-4 relative">
                  <div className="font-black text-slate-800">{p.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.description}</div>
                  
                  {/* Tooltip on Hover */}
                  {hoveredProductId === p.id && (
                    <div className="absolute left-full top-0 ml-4 z-50 pointer-events-none animate-in fade-in zoom-in duration-200">
                      <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl p-4 w-52 overflow-hidden flex flex-col gap-3">
                        <div className="h-32 w-full overflow-hidden rounded-2xl bg-slate-50">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Código: {p.code}</p>
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-slate-600 uppercase">Stock</span>
                            <span className={`text-xl font-black ${p.stock <= p.minStock ? 'text-red-500' : 'text-slate-800'}`}>
                              {p.stock} <span className="text-[10px] uppercase">{p.unit}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs text-slate-500 font-bold">{p.code}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{p.category}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${p.stock <= p.minStock ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className={`font-black ${p.stock <= p.minStock ? 'text-red-500' : 'text-slate-700'}`}>
                      {p.stock} {p.unit}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 font-black text-orange-600 text-lg">${p.salePrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={(e) => startEdit(e, p)} className="p-2.5 bg-slate-100 text-slate-600 hover:bg-orange-100 hover:text-orange-600 rounded-xl transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => handleDelete(e, p.id)} className="p-2.5 bg-slate-100 text-slate-600 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-300">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="font-bold uppercase tracking-widest text-sm">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in duration-300">
            <div className="flex flex-col md:flex-row h-full">
              {/* Image Section */}
              <div className="w-full md:w-2/5 bg-slate-50 relative group">
                <img 
                  src={viewingProduct.imageUrl} 
                  alt={viewingProduct.name} 
                  className="w-full h-full object-cover min-h-[300px]"
                />
                <div className="absolute top-6 left-6 bg-orange-600 text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg">
                  {viewingProduct.saleMode}
                </div>
                <button 
                  onClick={() => setViewingProduct(null)}
                  className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 rounded-full transition-all md:hidden"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Info Section */}
              <div className="flex-1 p-10 space-y-8 overflow-y-auto max-h-[80vh] md:max-h-none">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{viewingProduct.category} • {viewingProduct.code}</p>
                    <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">{viewingProduct.name}</h3>
                  </div>
                  <button 
                    onClick={() => setViewingProduct(null)}
                    className="hidden md:block p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                  >
                    <X className="w-8 h-8" />
                  </button>
                </div>

                <p className="text-slate-500 font-medium text-lg leading-relaxed">{viewingProduct.description}</p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-slate-400">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Precio Compra</span>
                    </div>
                    <p className="text-2xl font-black text-slate-600">${viewingProduct.purchasePrice.toFixed(2)}</p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100">
                    <div className="flex items-center gap-2 mb-2 text-orange-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Precio Venta</span>
                    </div>
                    <p className="text-3xl font-black text-orange-600">${viewingProduct.salePrice.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border border-slate-100 rounded-2xl text-center">
                    <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">Stock Actual</span>
                    <p className={`font-black text-lg ${viewingProduct.stock <= viewingProduct.minStock ? 'text-red-500' : 'text-slate-800'}`}>
                      {viewingProduct.stock} {viewingProduct.unit}
                    </p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-2xl text-center">
                    <span className="block text-[8px] font-black text-slate-400 uppercase mb-1">Stock Mínimo</span>
                    <p className="font-black text-slate-800 text-lg">{viewingProduct.minStock} {viewingProduct.unit}</p>
                  </div>
                  <div className="p-4 border border-slate-100 rounded-2xl text-center bg-green-50 border-green-100">
                    <span className="block text-[8px] font-black text-green-600 uppercase mb-1">Margen Utilidad</span>
                    <p className="font-black text-green-700 text-lg">{margin}%</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={(e) => { setViewingProduct(null); startEdit(e, viewingProduct); }}
                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" /> Editar Datos
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(isAdding || editingId) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-2xl font-black text-slate-800">{isAdding ? 'Nuevo Producto Zorro' : 'Editar Producto'}</h3>
              <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="p-3 hover:bg-slate-200 rounded-full transition-colors"><X className="w-6 h-6 text-slate-500" /></button>
            </div>
            
            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre del Producto</label>
                  <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold" placeholder="Ej: Aceite Nutrioli 1L" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</label>
                  <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Código de Barras</label>
                  <input type="text" value={formData.code || ''} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">URL de Imagen</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={formData.imageUrl || ''} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold" placeholder="https://..." />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio Venta</label>
                    <input type="number" value={formData.salePrice || ''} onChange={e => setFormData({...formData, salePrice: Number(e.target.value)})} className="w-full p-4 bg-orange-50 text-orange-700 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-black text-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Precio Compra</label>
                    <input type="number" value={formData.purchasePrice || ''} onChange={e => setFormData({...formData, purchasePrice: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-xl" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Inicial</label>
                    <input type="number" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-xl" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Mínimo</label>
                    <input type="number" value={formData.minStock || ''} onChange={e => setFormData({...formData, minStock: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-xl" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</label>
                  <select value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidad</label>
                  <input type="text" value={formData.unit || ''} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold" placeholder="pz, kg, lt..." />
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 flex gap-4">
               <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest">Cancelar</button>
               <button onClick={handleSave} className="flex-1 py-4 bg-orange-600 text-white rounded-2xl font-black hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-3 uppercase tracking-widest"><Save className="w-5 h-5" />Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
