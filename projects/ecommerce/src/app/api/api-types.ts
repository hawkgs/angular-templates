// API response types (JSON)

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  price: number;
  discount_price: number;
  available_quantity: number;
  parameters: { name: string; value: string }[];
}
