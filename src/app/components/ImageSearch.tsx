import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Search, Image as ImageIcon, ShoppingCart, ExternalLink, RefreshCw, Package, Store, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

// 🖌️ Inline SVG Brand Logotypes (Zero external dependency)
const BrandLogos = {
  pickopick: (className: string) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  amazon: (className: string) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22.02 59.412c-2.454-3.14-5.46-5.836-8.756-7.86a.417.417 0 0 1 .412-.583c2.25 1.05 4.975 1.68 7.796 1.68a18.9 18.9 0 0 0 5.922-1.072.583.583 0 0 1 .325.79c-1.47 1.144-3.511 1.761-5.594 1.761a12.83 12.83 0 0 1-.105-2.716zm9.215-1.492c-.144-.196-.046-.408.172-.455 1.012-.204 2.373.157 3.19.859.184.16.14.432-.086.483-1.026.222-2.729-.387-3.276-.887z" fill="#000"/>
      <path d="M12.33 34.2C8.6 34.2 5.1 36.17 5.1 40.75c0 1.34.21 2.53.53 3.52.12.38.35.34.45.02.1-.31.33-1.09.43-1.39.04-.15.02-.28-.09-.41-.26-.33-.61-1.03-.61-2.07 0-3.32 2.37-5.11 5.43-5.11 2.37 0 3.73.97 3.73 2.6 0 1.25-.66 2.31-2.04 2.31-.69 0-1.14-.37-1.14-.94 0-.32.07-.63.22-.96.22-.49.22-.49.22-.72 0-.25-.19-.48-.56-.48-.48 0-.96.48-.96 1.3 0 1.67 1.24 2.6 2.62 2.6 2.05 0 3.55-1.92 3.55-4.4 0-2.48-1.83-4.46-4.3-4.46z" fill="#000"/>
    </svg>
  ),
  flipkart: (className: string) => (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M84.4 34.2v45.8c0 3-2.4 5.4-5.4 5.4H21c-3 0-5.4-2.4-5.4-5.4V34.2c0-1.2.7-2.3 1.9-2.8l32.5-13c.6-.2 1.3-.2 1.9 0l32.5 13c.1.5.8 1.6.8 2.8z" fill="#2874F0"/>
      <path d="M50 45.4c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="#FFD200"/>
      <path d="M60.4 67.2c-.3 1.2-.8 2.3-1.5 3.3l-8.9-3.9-8.9 3.9c-.7-1-1.2-2.1-1.5-3.3-.3-1.2-.4-2.4-.4-3.6 0-1.2.1-2.4.4-3.6.3-1.2.8-2.3 1.5-3.3l8.9 3.9 8.9-3.9c.7 1 1.2 2.1 1.5 3.3.3 1.2.4 2.4.4 3.6.1 1.3 0 2.5-.4 3.6z" fill="#FFF"/>
    </svg>
  ),
  google: (className: string) => (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53v-5.6z" fill="#EA4335"/>
    </svg>
  )
};

interface ProductResult {
  id: number | string;
  name: string;
  price: string;
  store: string;
  source: 'pickopick' | 'amazon' | 'flipkart' | string;
  image: string;
  url: string;
  description?: string;
  category?: string;
  inStock?: boolean;
}

interface SearchResponse {
  source: 'pickopick' | 'external' | 'mixed' | 'universal';
  identified: string;
  results: ProductResult[];
  aiFailed?: boolean;
}

const SOURCE_CONFIG: Record<string, { color: string; bg: string; border: string; logo: (c: string) => React.ReactNode; label: string }> = {
  pickopick: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    logo: (c) => BrandLogos.pickopick(c),
    label: 'PickoPick'
  },
  amazon: {
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    logo: (c) => BrandLogos.amazon(c),
    label: 'Amazon India'
  },
  flipkart: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    logo: (c) => BrandLogos.flipkart(c),
    label: 'Flipkart'
  },
  google: {
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    logo: (c) => BrandLogos.google(c),
    label: 'Google Shopping'
  }
};

export function ImageSearch() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPhase, setSearchPhase] = useState<'idle' | 'identifying' | 'searching-local' | 'searching-external'>('idle');
  const [results, setResults] = useState<ProductResult[]>([]);
  const [resultSource, setResultSource] = useState<'pickopick' | 'external' | null>(null);
  const [identifiedProduct, setIdentifiedProduct] = useState<string>('');
  const [searchType, setSearchType] = useState<'image' | 'link'>('image');
  const [productLink, setProductLink] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const [manualProductName, setManualProductName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddToCart = async (product: ProductResult) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.error("Please login to add items to cart");
      return;
    }
    const user = JSON.parse(userStr);

    const { error } = await supabase.from("cart").insert([{
      customer_id: user.customerID,
      product_id: product.id,
      name: product.name,
      price: parseFloat(String(product.price).replace(/[₹,]/g, '')) || 0,
      image: product.image || "",
      quantity: 1,
    }]);

    if (error) {
      console.error(error);
      toast.error("Failed to add to cart ❌");
      return;
    }

    toast.success(`${product.name} added to cart 🛒`);
    window.dispatchEvent(new Event("cart-updated"));
  };

  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_SIZE = 800;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedData = canvas.toDataURL('image/jpeg', 0.7);
        setSelectedImage(compressedData);
        performSearch(compressedData);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const performSearch = async (imageData: string) => {
    setIsSearching(true);
    setResults([]);
    setResultSource(null);
    setIdentifiedProduct('');
    setManualProductName(''); // Clear old text on new image upload
    setErrorMessage('');
    setIsQuotaExceeded(false);

    try {
      setSearchPhase('identifying');
      
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data: SearchResponse = await response.json();
      
      setIdentifiedProduct(data.identified || '');
      setManualProductName(data.identified || ''); // Sync the input box with AI result
      setResultSource(data.source);

      if (data.aiFailed || !data.identified) {
        setIsQuotaExceeded(true);
      }

      const isInternal = data.source === 'pickopick' || data.source === 'mixed';
      setSearchPhase(isInternal ? 'searching-local' : 'searching-external');

      await new Promise(r => setTimeout(r, 500));

      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error: any) {
      console.error("Search error:", error);
      if (error.message?.includes("Quota Exceeded") || error.message?.includes("429")) {
        setIsQuotaExceeded(true);
      } else {
        setErrorMessage(error.message || "Search failed. Please try again.");
      }
      setResults([]);
    } finally {
      setIsSearching(false);
      setSearchPhase('idle');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Drag & Drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        processImageFile(file);
      } else {
        toast.error("Please drop an image file");
      }
    }
  };

  const handleLinkSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productLink.trim()) return;

    setIsSearching(true);
    setResults([]);
    setResultSource(null);
    setIdentifiedProduct('');
    setErrorMessage('');
    setIsQuotaExceeded(false);

    try {
      setSearchPhase('identifying');

      const response = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: productLink })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error (${response.status})`);
      }

      const data: SearchResponse = await response.json();

      setIdentifiedProduct(data.identified || '');
      setIdentifiedProduct(data.identified || '');
      setResultSource(data.source);

      if (data.source === 'pickopick') {
        setSearchPhase('searching-local');
      } else if (data.source === 'mixed') {
        setSearchPhase('searching-local');
      } else {
        setSearchPhase('searching-external');
      }

      await new Promise(r => setTimeout(r, 500));

      if (data.results && data.results.length > 0) {
        setResults(data.results);
      } else {
        setResults([]);
      }
    } catch (error: any) {
      console.error("Link Search error:", error);
      if (error.message?.includes("Quota Exceeded") || error.message?.includes("429")) {
        setIsQuotaExceeded(true);
      } else {
        setErrorMessage(error.message || "Search failed. Please try again.");
      }
      setResults([]);
    } finally {
      setIsSearching(false);
      setSearchPhase('idle');
    }
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualProductName.trim()) return;

    setIsSearching(true);
    setResults([]);
    setErrorMessage('');
    setIsQuotaExceeded(false);

    try {
      setSearchPhase('searching-local');
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: manualProductName })
      });

      if (!response.ok) throw new Error("Search failed");

      const data: SearchResponse = await response.json();
      setIdentifiedProduct(data.identified || manualProductName);
      setResultSource(data.source);
      setResults(data.results || []);
    } catch (error: any) {
      setErrorMessage("Manual search failed. Please try again.");
    } finally {
      setIsSearching(false);
      setSearchPhase('idle');
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProductLink('');
    setResults([]);
    setResultSource(null);
    setIdentifiedProduct('');
    setSearchPhase('idle');
    setErrorMessage('');
    setIsDragging(false);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSourceConfig = (source: string) => {
    return SOURCE_CONFIG[source] || SOURCE_CONFIG.amazon;
  };

  return (
    <section id="search-by-image" className="pt-12 pb-32 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-blue-700 font-medium text-sm mb-6"
          >
            <Search size={16} />
            AI Product Discovery
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6"
          >
            Find it . Buy it . Ship it .
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Looking for something specific? Search by uploading an image or pasting a product link below.
          </motion.p>
        </div>

        {/* Search Type Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
            <button
              onClick={() => setSearchType('image')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                searchType === 'image' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Search by Image
            </button>
            <button
              onClick={() => setSearchType('link')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                searchType === 'link' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Search by Link
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/40 border border-slate-100"
          >
            {searchType === 'image' ? (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  id="image-upload-input"
                />

                <div
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] transition-all cursor-pointer group relative overflow-hidden ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-50/80 scale-[1.02]' 
                      : selectedImage 
                        ? 'border-blue-400 bg-blue-50/10' 
                        : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                  }`}
                >
                  {/* Drag overlay */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-blue-50/90 flex items-center justify-center z-10 rounded-3xl">
                      <div className="text-center">
                        <Upload size={48} className="text-blue-600 mx-auto mb-4 animate-bounce" />
                        <p className="text-blue-700 font-bold text-lg">Drop your image here</p>
                      </div>
                    </div>
                  )}

                  {selectedImage ? (
                    <div className="relative w-full h-full flex flex-col items-center group">
                      <div className="relative w-full aspect-video rounded-3xl overflow-hidden mb-8 bg-slate-50 border border-slate-200 shadow-2xl group/preview">
                        <img
                          src={selectedImage}
                          alt="Selected"
                          className="w-full h-full object-contain"
                        />
                        
                        {/* Scanning Animation */}
                        {isSearching && !isQuotaExceeded && (
                          <motion.div 
                            initial={{ top: '-10%' }}
                            animate={{ top: '110%' }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] z-20"
                          />
                        )}

                        {!isSearching && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReset();
                            }}
                            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 hover:bg-white shadow-lg transition-all z-30"
                          >
                            <RefreshCw size={22} />
                          </button>
                        )}
                      </div>

                      <AnimatePresence>
                        {isQuotaExceeded && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full space-y-4" 
                            onClick={e => e.stopPropagation()}
                          >
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="What is this? (e.g. Nike Sneakers)"
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 pr-12 font-medium"
                                value={manualProductName}
                                onChange={(e) => setManualProductName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch(e as any)}
                              />
                              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            </div>
                            <button
                              onClick={handleManualSearch}
                              disabled={isSearching || !manualProductName.trim()}
                              className="w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-900 transition-all shadow-xl shadow-blue-600/20"
                            >
                              Search Manual Catalog
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {isSearching && (
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex gap-1.5">
                            {[0, 1, 2].map((i) => (
                              <motion.div
                                key={i}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                                className="w-2 h-2 rounded-full bg-blue-600"
                              />
                            ))}
                          </div>
                          <p className="text-blue-600 font-bold text-sm tracking-wide uppercase">AI Analyzing Image...</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                      >
                        <Upload size={32} />
                      </motion.div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Drag & Drop Image</h3>
                      <p className="text-slate-500 mb-8 text-sm">or click to browse from your device</p>
                      <label
                        htmlFor="image-upload-input"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="px-8 py-3 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-full font-medium hover:from-blue-700 hover:to-indigo-900 transition-colors shadow-lg shadow-blue-600/20 cursor-pointer"
                      >
                        Select Image
                      </label>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col justify-center">
                <div className="p-8 border-2 border-slate-100 rounded-3xl bg-slate-50/50">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                    <Upload size={28} className="rotate-180" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Search by Product Link</h3>
                  <p className="text-slate-500 mb-8">Paste a link to any product from an Indian e-commerce store like Amazon, Myntra, or Flipkart.</p>
                  
                  <form onSubmit={handleLinkSearch} className="space-y-4">
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://www.amazon.in/dp/..."
                        required
                        value={productLink}
                        onChange={(e) => setProductLink(e.target.value)}
                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-12 text-slate-900"
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="w-full py-4 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-indigo-900 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                    >
                      {isSearching ? 'Analyzing Link...' : 'Search Product'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col min-h-[400px]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-blue-600">
                  <ImageIcon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Matching Products</h3>
              </div>
              {results.length > 0 && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  resultSource === 'pickopick' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {results.length} {resultSource === 'pickopick' ? 'from PickoPick' : 'from Stores'}
                </span>
              )}
            </div>

            {/* Identified product banner */}
            {identifiedProduct && !isSearching && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100"
              >
                <p className="text-sm text-indigo-700">
                  <span className="font-bold">🔍 Identified:</span> {identifiedProduct}
                </p>
              </motion.div>
            )}

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-12"
                  >
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
                    <p className="text-slate-600 font-medium animate-pulse text-center">
                      {searchPhase === 'identifying' && '🤖 AI is identifying the product...'}
                      {searchPhase === 'searching-local' && '🛒 Found matches in PickoPick catalog!'}
                      {searchPhase === 'searching-external' && '🌐 Searching Amazon & Flipkart...'}
                      {searchPhase === 'idle' && 'Searching...'}
                    </p>
                  </motion.div>
                ) : errorMessage ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                      <AlertCircle size={24} className="text-red-400" />
                    </div>
                    <p className="text-red-700 font-bold mb-1">Search Interrupted</p>
                    <p className="text-slate-500 text-sm mb-6">{errorMessage}</p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                    >
                      Reset Search
                    </button>
                  </motion.div>
                ) : isQuotaExceeded ? (
                  /* Quota fallback state */
                  <motion.div
                    key="quota"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                      <ImageIcon size={28} className="text-amber-500" />
                    </div>
                    <p className="text-slate-900 text-lg font-bold mb-1">Help us identify it</p>
                    <p className="text-slate-500 text-sm max-w-xs mb-6">
                      AI identification is taking a break. What is the name of this product?
                    </p>
                    
                    <form onSubmit={handleManualSearch} className="w-full space-y-3">
                      <input
                        type="text"
                        placeholder="e.g. Adidas Ultraboost 5.0"
                        required
                        autoFocus
                        value={manualProductName}
                        onChange={(e) => setManualProductName(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
                      />
                      <button
                        type="submit"
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                      >
                        Search Manual Catalog
                      </button>
                    </form>
                  </motion.div>
                ) : results.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-4"
                  >
                    {/* Source indicator */}
                    {resultSource && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                          (resultSource === 'pickopick' || resultSource === 'mixed')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {resultSource === 'pickopick' ? (
                          <>
                            <Package size={16} />
                            Available in our catalog — add directly to cart!
                          </>
                        ) : resultSource === 'mixed' ? (
                          <>
                            <ShoppingCart size={16} />
                            Found in our warehouse + external store options
                          </>
                        ) : (
                          <>
                            <Store size={16} />
                            Not in our catalog — found on external stores
                          </>
                        )}
                      </motion.div>
                    )}

                    {results.map((product, index) => {
                      const config = getSourceConfig(product.source);
                      
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex gap-4 p-4 rounded-2xl border hover:shadow-md transition-all group ${config.border}`}
                        >
                          {/* Product Image / Store Logo */}
                          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  const container = (e.target as HTMLImageElement).parentElement;
                                  if (container) {
                                    container.classList.add('p-3', 'text-slate-300');
                                  }
                                }}
                              />
                            ) : null}
                            {(!product.image) && (
                              <div className="w-full h-full flex items-center justify-center p-3 opacity-20">
                                {config.logo("w-10 h-10")}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-tight">
                                  {product.name}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${config.bg} ${config.color} border border-transparent hover:border-current transition-colors`}>
                                  <div className="w-3 h-3">
                                    {config.logo("w-full h-full")}
                                  </div>
                                  {config.label}
                                </span>
                                {product.description && (
                                  <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{product.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-lg font-bold text-blue-600">{product.price}</span>
                              
                              {product.source === 'pickopick' ? (
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-sm"
                                >
                                  <ShoppingCart size={14} />
                                  Add to Cart
                                </button>
                              ) : (
                                <a
                                  href={product.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                                >
                                  <ExternalLink size={14} />
                                  Visit Store
                                </a>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Buy All via PickoPick - only for pickopick products */}
                    {resultSource === 'pickopick' && (
                      <button
                        onClick={() => {
                          results.forEach(p => handleAddToCart(p));
                        }}
                        className="w-full py-4 mt-4 border-2 border-dashed border-emerald-200 rounded-2xl text-emerald-600 font-bold hover:border-emerald-400 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={18} />
                        Add All to Cart
                      </button>
                    )}
                  </motion.div>
                ) : !isSearching && (selectedImage || productLink) ? (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                      <Search size={36} className="text-slate-300" />
                    </div>
                    <p className="text-slate-500 text-lg font-medium mb-2">No products found</p>
                    <p className="text-slate-400 text-sm max-w-xs">
                      We couldn't find matching products. Try a different image or product link.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Search size={80} className="text-slate-100 mb-6" strokeWidth={1.5} />
                    </motion.div>
                    <p className="text-slate-400 max-w-sm text-lg">
                      Upload an image to find matching products — first in our catalog, then from Amazon & Flipkart.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
