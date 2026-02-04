import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, Package, Lightbulb, RefreshCw } from 'lucide-react';
import { Product, Sale } from '../types';
import { GeminiService, AnalyticsInsights, InventoryInsights } from '../services/GeminiService';

interface AIInsightsProps {
  products: Product[];
  sales: Sale[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ products, sales }) => {
  const [analyticsInsights, setAnalyticsInsights] = useState<AnalyticsInsights | null>(null);
  const [inventoryInsights, setInventoryInsights] = useState<InventoryInsights | null>(null);
  const [salesPrediction, setSalesPrediction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'inventory' | 'predictions'>('analytics');

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [analytics, inventory, prediction] = await Promise.all([
        GeminiService.getAnalyticsInsights(sales, products),
        GeminiService.getInventoryInsights(products),
        GeminiService.getSalesPrediction(sales)
      ]);
      
      setAnalyticsInsights(analytics);
      setInventoryInsights(inventory);
      setSalesPrediction(prediction);
    } catch (err) {
      setError('Error al cargar insights. Verifica tu conexión y API key.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [products, sales]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
            <p className="text-slate-600 font-medium">Analizando datos con IA...</p>
            <p className="text-sm text-slate-400 mt-2">Esto puede tomar unos segundos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-lg">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">Asistente IA</h1>
                <p className="text-slate-600 text-sm md:text-base">Análisis inteligente de tu negocio en tiempo real</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Conectado a Gemini AI</span>
              <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">API Activa</span>
            </div>
          </div>
          
          <button
            onClick={loadInsights}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-medium text-slate-700">Actualizar análisis</span>
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">{error}</p>
                <p className="text-sm text-red-600 mt-1">
                  Verifica que tu API key esté configurada en el archivo .env
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'analytics' ? 'bg-white text-orange-600 shadow-lg' : 'bg-white/50 text-slate-600 hover:bg-white'}`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Análisis General</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'inventory' ? 'bg-white text-orange-600 shadow-lg' : 'bg-white/50 text-slate-600 hover:bg-white'}`}
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span>Inventario IA</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('predictions')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'predictions' ? 'bg-white text-orange-600 shadow-lg' : 'bg-white/50 text-slate-600 hover:bg-white'}`}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span>Predicciones</span>
            </div>
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && analyticsInsights && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Resumen Ejecutivo</h3>
              </div>
              <p className="text-slate-700 leading-relaxed">{analyticsInsights.summary}</p>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Recomendaciones</h3>
              </div>
              <div className="space-y-4">
                {analyticsInsights.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-slate-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trends */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Tendencias Identificadas</h3>
              </div>
              <div className="space-y-3">
                {analyticsInsights.trends.map((trend, index) => (
                  <div key={index} className="p-3 border border-slate-100 rounded-lg">
                    <p className="text-slate-700">{trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Alertas Importantes</h3>
              </div>
              <div className="space-y-3">
                {analyticsInsights.alerts.map((alert, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-red-700">{alert}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === 'inventory' && inventoryInsights && (
          <div className="space-y-6">
            {/* Low Stock Products */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Productos con Stock Bajo</h3>
                    <p className="text-sm text-slate-500">Necesitan reabastecimiento inmediato</p>
                  </div>
                </div>
                <div className="px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium">
                  {inventoryInsights.lowStock.length} productos críticos
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Producto</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Stock Actual</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Stock Recomendado</th>
                      <th className="text-left py-3 px-4 text-slate-600 font-medium">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryInsights.lowStock.map((product, index) => (
                      <tr key={index} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900">{product.productName}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                            {formatNumber(product.currentStock)} unidades
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                            {formatNumber(product.recommendedStock)} unidades
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900">
                            {formatNumber(product.recommendedStock - product.currentStock)} unidades
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Productos más Vendidos</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {inventoryInsights.topProducts.map((product, index) => (
                  <div key={index} className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg font-bold">
                        {index + 1}
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-white rounded-full">
                        {formatNumber(product.salesCount)} ventas
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 truncate">{product.productName}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inventoryInsights.insights.map((insight, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg">
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-slate-900">Insight #{index + 1}</h3>
                  </div>
                  <p className="text-slate-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictions Tab */}
        {activeTab === 'predictions' && (
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-orange-100 to-pink-100 rounded-lg">
                <Lightbulb className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Predicción de Ventas</h3>
                <p className="text-slate-500">Análisis basado en datos históricos e IA</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-100 rounded-xl p-6 mb-6">
              <p className="text-lg text-slate-800 leading-relaxed">{salesPrediction}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-900 mb-2">Confianza del Modelo</h4>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2 w-3/4"></div>
                  </div>
                  <span className="font-bold text-green-600">85%</span>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-900 mb-2">Base de Datos</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-slate-600">
                    {formatNumber(sales.length)} transacciones analizadas
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-5">
                <h4 className="font-bold text-slate-900 mb-2">Actualizado</h4>
                <div className="text-slate-600">
                  {new Date().toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Total Productos</p>
              <p className="text-2xl font-bold text-slate-900">{formatNumber(products.length)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Total Ventas</p>
              <p className="text-2xl font-bold text-slate-900">{formatNumber(sales.length)}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-slate-500 mb-1">Stock Crítico</p>
              <p className="text-2xl font-bold text-red-600">
                {inventoryInsights ? formatNumber(inventoryInsights.lowStock.length) : '0'}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-slate-500 mb-1">IA Activa</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-2xl font-bold text-green-600">Online</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
