// Shared interfaces for Customer Service components
// This ensures type consistency across all CS components

export interface CSOrder {
  id: string;
  orderNumber: string;
  shipped: boolean;
  store: string;
  location: string;
  timeStamp: number;
  items: any[];
  priority?: number; // Optional - can be undefined
  primeStatus?: boolean; // Optional - can be undefined
}

export interface CSProduct {
  name: string;
  sku: string;
  weight?: number;
  category: string;
  subcategory?: string;
  imageURL?: string;
  upc?: string;
  density?: number;
  pack_size?: number;
  pack_unit?: string;
}

export interface CSOrderItem {
  name: string;
  sku: string;
  upc?: string;
  quantity?: number;
  orderNumber: string;
  orderId: string;
  priority?: number; // Optional to match CSOrder
  timeStamp: number;
}