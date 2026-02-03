
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', code: '750100', name: 'Aceite Nutrioli 1L', description: 'Aceite puro de soya', 
    purchasePrice: 32.50, salePrice: 38.00, stock: 120, minStock: 24, category: 'Abarrotes', 
    saleMode: 'pieza', unit: 'pz', imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=200&h=200&auto=format&fit=crop' 
  },
  { 
    id: '2', code: '750200', name: 'Arroz SOS 1kg', description: 'Arroz super extra', 
    purchasePrice: 18.00, salePrice: 22.50, stock: 50, minStock: 10, category: 'Granos', 
    saleMode: 'pieza', unit: 'pz', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=200&h=200&auto=format&fit=crop' 
  },
  { 
    id: '3', code: '1001', name: 'Frijol Negro (Granel)', description: 'Frijol negro veracruzano', 
    purchasePrice: 24.00, salePrice: 31.00, stock: 45, minStock: 5, category: 'Granos', 
    saleMode: 'granel', unit: 'kg', imageUrl: 'https://images.unsplash.com/photo-1551462147-ff29053fad31?q=80&w=200&h=200&auto=format&fit=crop' 
  },
  { 
    id: '4', code: '750300', name: 'Leche Lala Entera 1L', description: 'Leche ultrapasteurizada', 
    purchasePrice: 19.50, salePrice: 24.00, stock: 72, minStock: 12, category: 'Lácteos', 
    saleMode: 'pieza', unit: 'pz', imageUrl: 'https://images.unsplash.com/photo-1550583724-125581cc258b?q=80&w=200&h=200&auto=format&fit=crop' 
  },
  { 
    id: '5', code: '750400', name: 'Bimbo Pan Blanco Grande', description: 'Pan de caja con Actileche', 
    purchasePrice: 38.00, salePrice: 46.00, stock: 15, minStock: 6, category: 'Panadería', 
    saleMode: 'pieza', unit: 'pz', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200&h=200&auto=format&fit=crop' 
  }
];

export const CATEGORIES = ['Abarrotes', 'Granos', 'Lácteos', 'Panadería', 'Bebidas', 'Limpieza', 'Mascotas'];
