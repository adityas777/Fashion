
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  brand: string;
}

export interface OutfitSuggestion {
  itemName: string;
  category: string;
  reason: string;
  color: string;
  price: number;
  imageUrl: string;
}

export interface PriceComparison {
  platform: string;
  price: number;
  deliveryDays: number;
  inStock: boolean;
  logo: string; // URL or emoji
}

export interface SizeMap {
  targetBrand: string;
  recommendedSize: string;
  confidence: number;
  reasoning: string;
}

export interface OfflineStore {
  name: string;
  distance: string;
  address: string;
  phone: string;
}
