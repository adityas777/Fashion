import { Product, PriceComparison, OfflineStore } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Oxford Shirt',
    category: 'Topwear',
    price: 2499,
    brand: 'Uniqlo',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800',
    description: 'A crisp, light blue oxford shirt suitable for casual and semi-formal occasions.',
  },
  {
    id: '2',
    name: 'Slim Fit Chinos',
    category: 'Bottomwear',
    price: 1999,
    brand: 'H&M',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800',
    description: 'Beige slim fit chinos made from stretch cotton.',
  },
  {
    id: '3',
    name: 'Denim Jacket',
    category: 'Outerwear',
    price: 3499,
    brand: 'Levis',
    image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&q=80&w=800',
    description: 'Classic rugged denim jacket.',
  },
    {
    id: '4',
    name: 'Floral Summer Dress',
    category: 'Dresses',
    price: 2999,
    brand: 'Zara',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&q=80&w=800',
    description: 'Lightweight floral dress perfect for summer outings.',
  },
];

export const MOCK_PRICE_COMPARISONS: PriceComparison[] = [
  { platform: 'StyleSync', price: 2499, deliveryDays: 2, inStock: true, logo: '✨' },
  { platform: 'Amazon', price: 2350, deliveryDays: 5, inStock: true, logo: '📦' },
  { platform: 'Myntra', price: 2600, deliveryDays: 1, inStock: true, logo: 'Ⓜ️' },
  { platform: 'Ajio', price: 2450, deliveryDays: 3, inStock: false, logo: '🅰️' },
];

export const MOCK_OFFLINE_STORES: OfflineStore[] = [
  { name: 'Fashion Hub Mall', distance: '1.2 km', address: '123 Market St, Downtown', phone: '+91 98765 43210' },
  { name: 'City Center Outlet', distance: '3.5 km', address: '45 Avenue Block B', phone: '+91 98765 12345' },
];

export const BRANDS = ['Uniqlo', 'H&M', 'Zara', 'Nike', 'Adidas', 'Levis', 'Gucci', 'Gap'];
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];