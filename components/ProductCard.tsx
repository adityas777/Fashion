import React from 'react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:border-indigo-500/30 hover:-translate-y-1">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-2xl bg-slate-800 lg:aspect-none group-hover:opacity-90 h-80">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center lg:h-full lg:w-full transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 flex justify-between px-4 pb-4">
        <div>
          <h3 className="text-sm text-slate-200 font-medium">
            <Link to={`/product/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-slate-400">{product.brand}</p>
        </div>
        <p className="text-sm font-bold text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
};

export default ProductCard;