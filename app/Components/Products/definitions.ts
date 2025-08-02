import { OrderItem } from "@/app/warehouse/page";

export interface Product {
  sku: string;
  name: string;
  category: string;
  subcategory?: string;
  grade?: string;
  bubble_size?: string;
  width?: number;
  length?: number;
  roll_type?: string;
  rolls_per_pack?: number;
  density?: number;
  density_display?: string;
  pack_size?: number;
  pack_unit?: string;
  foam_type?: string;
  tape_width?: number;
  tape_length?: number;
  adhesive_type?: string;
  tape_color?: string;
  thickness?: number;
  weight?: number
}

export interface EnrichedOrderItem extends OrderItem {
  product?: Product;
}