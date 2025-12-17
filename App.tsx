import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import OutfitMaker from './pages/OutfitMaker';
import ProductDetail from './pages/ProductDetail';
import VirtualTryOn from './pages/VirtualTryOn';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black text-slate-100">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/outfit-maker" element={<OutfitMaker />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/virtual-try-on" element={<VirtualTryOn />} />
          </Routes>
        </main>
        <footer className="bg-black/40 backdrop-blur-md border-t border-white/5 py-8 text-center text-sm text-slate-500">
          <p>&copy; 2024 StyleSync AI. All rights reserved.</p>
          <p className="mt-2 text-xs">Powered by Google Gemini</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;