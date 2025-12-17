import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 font-bold drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]' 
    : 'text-slate-400 hover:text-white transition-colors duration-300';

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/70 backdrop-blur-md border-b border-white/10 shadow-lg shadow-indigo-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
              <span className="text-2xl group-hover:animate-pulse">✨</span>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">StyleSync</span>
            </Link>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/outfit-maker" className={isActive('/outfit-maker')}>Outfit Maker</Link>
            <Link to="/virtual-try-on" className={isActive('/virtual-try-on')}>Try On</Link>
          </div>
          <div className="flex items-center sm:hidden">
            <span className="text-xl text-white">☰</span>
          </div>
        </div>
      </div>
      {/* Mobile Menu Links */}
      <div className="sm:hidden flex justify-around bg-black/50 py-3 border-t border-white/10 backdrop-blur-md">
         <Link to="/" className={`text-sm ${isActive('/')}`}>Home</Link>
         <Link to="/outfit-maker" className={`text-sm ${isActive('/outfit-maker')}`}>Outfit</Link>
         <Link to="/virtual-try-on" className={`text-sm ${isActive('/virtual-try-on')}`}>TryOn</Link>
      </div>
    </nav>
  );
};

export default Navbar;