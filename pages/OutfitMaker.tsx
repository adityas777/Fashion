import React, { useState } from 'react';
import { getOutfitRecommendations, generateOutfitImage } from '../services/geminiService';
import { OutfitSuggestion } from '../types';

const OutfitMaker: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<OutfitSuggestion[]>([]);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedItem) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);
    
    try {
      // Step 1: Get text recommendations
      const textResults = await getOutfitRecommendations(selectedItem, "Casual summer vibes, high-end street style");
      
      if (textResults.length === 0) {
        setError("Could not generate recommendations. Please try again.");
        setLoading(false);
        return;
      }

      setSuggestions(textResults);
      setLoading(false); // Text is ready, now we load images in parallel

      // Step 2: Generate images for each recommendation
      textResults.forEach(async (item, index) => {
        setImageLoadingStates(prev => ({ ...prev, [index]: true }));
        try {
          const prompt = `${item.color} ${item.itemName} for ${item.category}`;
          const base64Image = await generateOutfitImage(prompt);
          
          setSuggestions(current => {
            const newSuggestions = [...current];
            if (newSuggestions[index]) {
              newSuggestions[index].imageUrl = base64Image;
            }
            return newSuggestions;
          });
        } catch (imgErr) {
          console.error("Failed to generate image for item", index, imgErr);
        } finally {
          setImageLoadingStates(prev => ({ ...prev, [index]: false }));
        }
      });

    } catch (e) {
      console.error(e);
      setError("An unexpected error occurred. Please check your API key.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">AI Fashion Studio</h1>
        <p className="mt-4 text-slate-400 text-lg">Harnessing the power of Nano Banana AI to design your perfect look.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Input Section */}
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/10 h-fit sticky top-24">
          <label className="block text-sm font-semibold text-indigo-300 mb-6 tracking-widest uppercase">Select Core Garment</label>
          <div className="flex flex-wrap gap-3 mb-8">
            {['White Linen Shirt', 'Navy Blue Suit', 'Black Leather Jacket', 'Vintage Denim', 'Beige Chinos'].map(item => (
              <button
                key={item}
                onClick={() => setSelectedItem(item)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold border transition-all duration-300 ${selectedItem === item ? 'bg-indigo-600 text-white border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.6)]' : 'bg-white/5 text-slate-300 border-white/10 hover:border-indigo-500/50 hover:text-white hover:bg-white/10'}`}
              >
                {item}
              </button>
            ))}
          </div>
          
          <div className="relative group">
            <textarea
              className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-slate-600 transition-all resize-none shadow-inner"
              rows={4}
              placeholder="Describe your garment (e.g., 'A forest green corduroy oversized blazer')..."
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={loading || !selectedItem}
            className="mt-8 w-full flex items-center justify-center px-6 py-5 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-x hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50 disabled:animate-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Consulting Stylist...</span>
              </div>
            ) : (
              <span className="flex items-center gap-2">✨ Design My Look</span>
            )}
          </button>
          
          {error && <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
            {suggestions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {suggestions.map((item, index) => (
                        <div key={index} className="group relative bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-indigo-500/40 hover:shadow-[0_0_40px_rgba(99,102,241,0.2)] flex flex-col">
                            <div className="h-72 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                                {imageLoadingStates[index] || !item.imageUrl ? (
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                        <p className="text-xs text-indigo-300 font-bold animate-pulse">GENERATING PHOTO...</p>
                                    </div>
                                ) : (
                                    <img 
                                        src={item.imageUrl} 
                                        alt={item.itemName} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                )}
                                <div className="absolute top-4 right-4 px-4 py-1.5 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                                    <span className="text-indigo-300 font-black text-sm tracking-tight">₹{item.price.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80 pointer-events-none"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="text-[10px] font-black px-2 py-0.5 bg-indigo-500 text-white rounded-sm uppercase tracking-widest">{item.category}</span>
                                </div>
                            </div>
                            
                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">{item.itemName}</h3>
                                <p className="text-xs text-slate-500 mb-4 font-semibold uppercase tracking-widest">Suggested Color: <span className="text-indigo-400">{item.color}</span></p>
                                
                                <div className="relative p-5 bg-white/5 rounded-2xl border border-white/5 mb-6 italic text-slate-300 text-sm leading-relaxed">
                                    <span className="absolute -top-3 left-4 text-3xl text-indigo-500/30 font-serif">"</span>
                                    {item.reason}
                                    <span className="absolute -bottom-6 right-4 text-3xl text-indigo-500/30 font-serif">"</span>
                                </div>

                                <div className="mt-auto flex items-center gap-4">
                                     <button className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all uppercase tracking-widest">Store Stock</button>
                                     <button className="flex-1 py-3 bg-white text-black font-black rounded-xl text-xs hover:bg-indigo-50 shadow-xl active:scale-95 transition-all uppercase tracking-widest">Buy Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-[3rem] transition-all duration-700 hover:bg-white/[0.04] hover:border-indigo-500/20 group">
                    <div className="relative mb-10">
                        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse group-hover:bg-indigo-500/40"></div>
                        <span className="relative text-9xl block drop-shadow-2xl">🎨</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Design Your Aesthetic</h2>
                    <p className="max-w-md text-slate-500 leading-relaxed text-lg">
                        Input a piece from your wardrobe to see custom AI-generated high-fashion recommendations and visuals.
                    </p>
                    <div className="mt-12 flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"></div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default OutfitMaker;