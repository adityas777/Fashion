import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyzeTryOn } from '../services/geminiService';
import { MOCK_PRODUCTS } from '../constants';
import { Product } from '../types';

const VirtualTryOn: React.FC = () => {
  const location = useLocation();
  const initialProduct = location.state?.product as Product | undefined;

  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(initialProduct);
  
  // Camera & Image State
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  
  // AI Analysis State
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Overlay Controls (Simple CSS simulation for prototype)
  const [overlayScale, setOverlayScale] = useState(1);
  const [overlayVertical, setOverlayVertical] = useState(50);

  useEffect(() => {
    // If we have an initial product but no user choice yet, set it
    if (initialProduct && !selectedProduct) {
        setSelectedProduct(initialProduct);
    }
  }, [initialProduct]);

  // Handle Countdown Logic
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    } else {
        capturePhoto();
    }
  }, [countdown]);

  const startCamera = async () => {
    try {
      setCapturedImage(null);
      setAnalysis(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        // Start auto-capture sequence
        setCountdown(8); // Increased time to 8s to give time to align
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        // Match canvas size to video size
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        
        // Draw
        context.drawImage(videoRef.current, 0, 0);
        
        // Convert to base64
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
        setCountdown(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage || !selectedProduct) return;
    setLoading(true);
    
    const base64Data = capturedImage.split(',')[1];
    const result = await analyzeTryOn(base64Data, selectedProduct.name);
    
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-64px)]">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            Virtual Dressing Room
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Camera / Image Area */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Visualizer Container */}
                <div className="relative bg-black/40 border border-white/10 rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[16/9] shadow-2xl flex items-center justify-center group">
                    
                    {/* State 1: Camera Active */}
                    {cameraActive && (
                        <>
                            <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
                            
                            {/* Visual Guides Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Body Frame Guide */}
                                <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[80%] md:w-[50%] h-[80%] border-4 border-indigo-400/30 border-dashed rounded-[3rem] shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-black/50 backdrop-blur-md rounded-full text-indigo-200 text-xs font-bold uppercase tracking-widest border border-indigo-500/30">
                                        Upper Body Zone
                                    </div>
                                </div>
                                
                                {/* Foot Alignment Line */}
                                <div className="absolute bottom-[10%] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_rgba(34,211,238,0.8)] animate-pulse"></div>
                                <div className="absolute bottom-[7%] w-full text-center">
                                    <span className="inline-block px-3 py-1 bg-black/60 rounded text-cyan-300 font-bold text-sm tracking-wider uppercase drop-shadow-md border border-cyan-500/30">
                                        Align Feet Here
                                    </span>
                                </div>

                                {/* Center vertical guide */}
                                <div className="absolute top-[10%] bottom-[15%] left-1/2 w-px bg-white/10"></div>
                            </div>

                            {/* Countdown Display */}
                            {countdown !== null && countdown > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] z-10">
                                    <div className="text-center">
                                        <div className="text-8xl font-bold text-white drop-shadow-[0_0_30px_rgba(99,102,241,1)] animate-ping-slow">
                                            {countdown}
                                        </div>
                                        <p className="text-white text-xl mt-4 font-medium drop-shadow-md bg-black/40 px-4 py-2 rounded-lg">
                                            Step back & Look at the camera!
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* State 2: Image Captured */}
                    {!cameraActive && capturedImage && (
                        <div className="relative w-full h-full">
                            <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                            
                            {/* Product Overlay */}
                            {selectedProduct && (
                                <div 
                                    className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none transition-all duration-200"
                                    style={{ 
                                        top: `${overlayVertical}%`, 
                                        width: `${300 * overlayScale}px`,
                                        marginTop: '-150px' // rough center offset
                                    }}
                                >
                                    <img 
                                        src={selectedProduct.image} 
                                        alt="Overlay" 
                                        className="w-full h-auto drop-shadow-2xl opacity-90"
                                    />
                                </div>
                            )}

                            {/* Overlay Controls */}
                            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 flex gap-4 items-center z-20">
                                <span className="text-xs text-white whitespace-nowrap">Size:</span>
                                <input 
                                    type="range" min="0.5" max="2" step="0.1" 
                                    value={overlayScale} 
                                    onChange={(e) => setOverlayScale(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <span className="text-xs text-white whitespace-nowrap">Position:</span>
                                <input 
                                    type="range" min="10" max="90" step="1" 
                                    value={overlayVertical} 
                                    onChange={(e) => setOverlayVertical(parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <button 
                                    onClick={() => { setCapturedImage(null); setAnalysis(null); }}
                                    className="ml-auto text-xs text-white bg-red-500/80 px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Retake
                                </button>
                            </div>
                        </div>
                    )}

                    {/* State 3: Empty / Initial */}
                    {!cameraActive && !capturedImage && (
                         <div className="text-center p-6">
                            <button 
                                onClick={startCamera}
                                className="group relative inline-flex items-center justify-center px-8 py-6 bg-indigo-600 rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_30px_rgba(79,70,229,0.4)]"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x"></div>
                                <span className="relative flex items-center gap-3 text-xl font-bold text-white">
                                    <span className="text-3xl">📸</span> Start Camera & Auto-Capture
                                </span>
                            </button>
                            <p className="mt-4 text-slate-400 text-sm">or</p>
                            <div className="mt-2 relative">
                                <button className="text-indigo-400 hover:text-indigo-300 underline text-sm">Upload a photo</button>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileUpload}
                                    accept="image/*" 
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    )}

                    {/* Hidden Canvas for capture */}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Product Carousel */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                    <p className="text-sm text-slate-400 mb-3 font-medium uppercase tracking-wider">Try Different Items</p>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent">
                        {MOCK_PRODUCTS.map((prod) => (
                            <button 
                                key={prod.id}
                                onClick={() => setSelectedProduct(prod)}
                                className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedProduct?.id === prod.id ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <img src={prod.image} className="w-full h-full object-cover" alt={prod.name} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Col: Controls & AI Analysis */}
            <div className="space-y-6">
                
                {/* Selected Item Info */}
                {selectedProduct ? (
                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-6 rounded-2xl">
                         <h3 className="text-white font-bold text-lg mb-1">{selectedProduct.name}</h3>
                         <p className="text-indigo-300 text-sm mb-4">{selectedProduct.brand} • ₹{selectedProduct.price.toLocaleString('en-IN')}</p>
                         
                         <button
                            onClick={handleAnalyze}
                            disabled={!capturedImage || loading}
                            className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
                        >
                            {loading ? 'AI Stylist Thinking...' : '✨ Analyze My Fit'}
                        </button>
                    </div>
                ) : (
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center text-slate-400">
                        Select a product to see details.
                    </div>
                )}

                {/* AI Output */}
                <div className={`transition-all duration-500 ${analysis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {analysis && (
                        <div className="bg-black/40 border border-green-500/30 p-6 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                             <div className="flex items-center gap-2 mb-4 text-green-400 font-bold">
                                <span>🤖</span> Stylist Feedback
                             </div>
                             <div className="prose prose-invert text-slate-300 text-sm leading-relaxed">
                                {analysis.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                {!analysis && (
                    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                        <h4 className="text-white font-bold mb-3 text-sm uppercase">How it works</h4>
                        <ol className="text-slate-400 text-sm space-y-2 list-decimal list-inside">
                            <li>Click <span className="text-indigo-400">Start Camera</span>.</li>
                            <li>Align your body within the <strong>dashed frame</strong>.</li>
                            <li>Ensure your feet are near the <strong>cyan line</strong>.</li>
                            <li>Wait for the auto-capture countdown.</li>
                            <li>Adjust the item overlay to fit your body.</li>
                            <li>Click <span className="text-white">Analyze My Fit</span>.</li>
                        </ol>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default VirtualTryOn;