import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS, MOCK_PRICE_COMPARISONS, MOCK_OFFLINE_STORES, BRANDS, SIZES } from '../constants';
import { normalizeSize } from '../services/geminiService';
import { SizeMap } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
  
  // Size Normalizer State
  const [myBrand, setMyBrand] = useState(BRANDS[0]);
  const [mySize, setMySize] = useState(SIZES[2]); // Default M
  const [sizeMap, setSizeMap] = useState<SizeMap | null>(null);
  const [isNormalizing, setIsNormalizing] = useState(false);

  // Fake stock state for demoing offline logic
  const isOutOfStock = product.id === '3'; 

  const handleSizeCheck = async () => {
    setIsNormalizing(true);
    const result = await normalizeSize(myBrand, mySize, product.brand);
    setSizeMap(result);
    setIsNormalizing(false);
  };

  const handleVirtualTryOn = () => {
    navigate('/virtual-try-on', { state: { product } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="rounded-2xl overflow-hidden bg-slate-800 shadow-2xl shadow-indigo-500/10 border border-white/10">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info Section */}
        <div>
          <h1 className="text-4xl font-bold text-white">{product.name}</h1>
          <p className="text-lg text-indigo-400 mt-2 font-medium">{product.brand} • {product.category}</p>
          <p className="mt-6 text-slate-300 leading-relaxed text-lg">{product.description}</p>
          
          <div className="mt-8 flex items-baseline gap-4">
             <span className="text-3xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">₹{product.price.toLocaleString('en-IN')}</span>
             <span className="text-lg text-slate-500 line-through">₹{(product.price * 1.2).toFixed(0)}</span>
             <span className="text-green-400 text-sm font-bold bg-green-900/30 px-2 py-1 rounded">20% OFF</span>
          </div>

          <div className="mt-8 flex gap-4">
            <button 
                onClick={handleVirtualTryOn}
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
                <span>🔮</span> Virtual Try-On
            </button>
            <button className="flex-1 bg-white text-black px-6 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors">
                Add to Cart
            </button>
          </div>

          {/* Price Comparison */}
          <div className="mt-10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📊</span> Compare Prices
            </h3>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
              {MOCK_PRICE_COMPARISONS.map((offer, idx) => (
                <div key={idx} className={`flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors ${offer.price === Math.min(...MOCK_PRICE_COMPARISONS.map(p => p.price)) ? 'bg-indigo-900/20' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{offer.logo}</span>
                    <div>
                        <p className="font-semibold text-white">{offer.platform}</p>
                        <p className="text-xs text-slate-400">Delivers in {offer.deliveryDays} days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${offer.price === Math.min(...MOCK_PRICE_COMPARISONS.map(p => p.price)) ? 'text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]' : 'text-slate-200'}`}>₹{offer.price.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-slate-500">{offer.inStock ? 'In Stock' : 'Out of Stock'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Size Normalizer */}
          <div className="mt-10 bg-indigo-950/30 p-6 rounded-xl border border-indigo-500/30 backdrop-blur-sm shadow-[0_0_20px_rgba(79,70,229,0.1)]">
            <div className="flex items-center gap-3 mb-4">
               <span className="text-indigo-400 text-2xl">📏</span>
               <h3 className="font-bold text-white text-lg">AI Size recommender</h3>
            </div>
            <p className="text-sm text-indigo-200 mb-6">Tell us what fits you well, and our AI will recommend the right size for <span className="font-semibold text-white">{product.brand}</span>.</p>
            
            <div className="flex gap-3">
                <select value={myBrand} onChange={(e) => setMyBrand(e.target.value)} className="block w-full rounded-lg bg-black/40 border-white/10 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3">
                    {BRANDS.map(b => <option key={b} value={b} className="bg-slate-900">{b}</option>)}
                </select>
                <select value={mySize} onChange={(e) => setMySize(e.target.value)} className="block w-32 rounded-lg bg-black/40 border-white/10 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3">
                    {SIZES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
                </select>
                <button 
                  onClick={handleSizeCheck}
                  disabled={isNormalizing}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 text-sm font-bold whitespace-nowrap shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all"
                >
                    {isNormalizing ? 'Checking...' : 'Check Size'}
                </button>
            </div>
            
            {sizeMap && (
                <div className="mt-6 bg-white/10 p-4 rounded-lg border border-indigo-500/30 animate-fade-in">
                    <p className="text-white font-bold text-lg">
                        Recommended Size: <span className="text-2xl text-indigo-300 drop-shadow-[0_0_5px_rgba(165,180,252,0.8)]">{sizeMap.recommendedSize}</span>
                    </p>
                    <p className="text-sm text-slate-300 mt-2 italic">{sizeMap.reasoning}</p>
                </div>
            )}
          </div>

          {/* Offline Store Fallback */}
          {isOutOfStock && (
             <div className="mt-10 bg-red-950/20 p-6 rounded-xl border border-red-500/30 backdrop-blur-sm animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-red-500 text-2xl">⚠️</span>
                    <h3 className="font-bold text-red-200 text-lg">Out of Stock Online</h3>
                </div>
                <p className="text-sm text-red-300 mb-4">Don't worry! This item is available at these nearby stores:</p>
                <div className="space-y-3">
                    {MOCK_OFFLINE_STORES.map((store, i) => (
                        <div key={i} className="flex justify-between items-center bg-black/40 p-4 rounded-lg border border-red-500/10 shadow-sm hover:border-red-500/30 transition-colors">
                            <div>
                                <p className="font-semibold text-white">{store.name}</p>
                                <p className="text-xs text-slate-400 mt-1">{store.address}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">{store.distance}</p>
                                <a href={`tel:${store.phone}`} className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline mt-1 block">Call Store</a>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;