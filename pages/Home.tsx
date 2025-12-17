import React, { useEffect, useState } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { analyzeTrendForLocation } from '../services/geminiService';

const Home: React.FC = () => {
  const [location, setLocation] = useState<string>('Detecting...');
  const [trend, setTrend] = useState<string>('Analyzing local trends...');

  useEffect(() => {
    // Simulate Geo-location
    setTimeout(() => {
      const detected = "Mumbai, India";
      setLocation(detected);
      
      analyzeTrendForLocation(detected).then(setTrend);
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Galaxy background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(76,29,149,0.4),_transparent_70%)]"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Fashion that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">Understands You</span>
          </h1>
          <p className="mt-6 text-xl text-slate-300 max-w-3xl leading-relaxed">
            AI-powered outfit recommendations, price comparisons, and smart sizing. 
            Experience the future of omnichannel retail.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6">
             <a href="#trending" className="inline-flex items-center justify-center px-8 py-4 border border-white/10 text-base font-medium rounded-full text-white bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Shop Trending
            </a>
            <a href="#/outfit-maker" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] transition-all duration-300 transform hover:scale-105">
              Create Outfit
            </a>
          </div>
        </div>
      </div>

      {/* Smart Analysis Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
              </span>
              <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-widest">Smart Location Analysis</h2>
            </div>
            <p className="text-3xl font-bold text-white tracking-wide">
              📍 {location}
            </p>
            <p className="text-slate-400 mt-2 max-w-2xl text-lg">
              {trend}
            </p>
          </div>
          <div className="bg-indigo-950/50 p-6 rounded-xl border border-indigo-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(79,70,229,0.2)]">
             <p className="text-xs text-indigo-300 font-bold mb-2 tracking-wider">NEARBY ACTIVITY</p>
             <p className="text-base text-indigo-100">🔥 128 people nearby bought <span className="font-semibold text-white">Denim Jackets</span> today.</p>
          </div>
        </div>
      </div>

      {/* Trending Products Grid */}
      <div id="trending" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-8 border-l-4 border-indigo-500 pl-4">Trending Near You</h2>
        <div className="grid grid-cols-1 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;