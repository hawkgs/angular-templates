// API response types (JSON)

export interface ApiCategory {
  id: string;
  name: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  category_id: string;
  images: string[];
  price: number;
  discount_price: number;
  available_quantity: number;
  parameters: { name: string; value: string }[];
}
