
export type SaleMode = 'pieza' | 'granel' | 'paquete';

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  category: string;
  saleMode: SaleMode;
  unit: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'credit';
  amountReceived: number;
  change: number;
}

export type View = 'sales' | 'inventory' | 'reports' | 'dashboard' | 'ai';
