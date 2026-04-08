import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Search, Image as ImageIcon, ShoppingCart, ExternalLink, RefreshCw } from 'lucide-react';
import { analyzeProductImage } from '../../services/geminiService';

const mockResults = [
  {
    id: 1,
    name: "Premium Silk Saree",
    price: "₹4,500",
    store: "Amazon India",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
    url: "https://amazon.in"
  },
  {
    id: 2,
    name: "Designer Kurta Set",
    price: "₹2,800",
    store: "Myntra",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400",
    url: "https://myntra.com"
  },
  {
    id: 3,
    name: "Handcrafted Jewelry Box",
    price: "₹1,200",
    store: "Flipkart",
    image: "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?auto=format&fit=crop&q=80&w=400",
    url: "https://flipkart.com"
  }
];

export function ImageSearch() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<typeof mockResults>([]);
  const [searchType, setSearchType] = useState<'image' | 'link'>('image');
  const [productLink, setProductLink] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const performSearch = async (imageData: string) => {
    setIsSearching(true);
    setResults([]);
    try {
      const aiResults = await analyzeProductImage(imageData);

      if (aiResults && aiResults.length > 0) {
        const formattedResults = aiResults.map((res: any, index: number) => ({
          ...res,
          id: res.id || index + 1,
          image: `https://picsum.photos/seed/${encodeURIComponent(res.name)}/400/400`,
          url: res.store.toLowerCase().includes('amazon') ? 'https://amazon.in' :
            res.store.toLowerCase().includes('myntra') ? 'https://myntra.com' :
              'https://flipkart.com'
        }));
        setResults(formattedResults);
      } else {
        // Fallback to mock if API returned empty array (e.g. error caught in geminiService)
        setResults(mockResults);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults(mockResults); // Fallback to mock
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Max dimension to compress to (e.g., 800px)
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

          // Compress to WebP or JPEG at 70% quality
          const compressedData = canvas.toDataURL('image/jpeg', 0.7);

          setSelectedImage(compressedData);
          performSearch(compressedData);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productLink.trim()) return;
    
    setIsSearching(true);
    setResults([]);
    try {
      // In a real app, this would fetch metadata from the link
      // For now, we'll use a mock response based on the link or call Gemini with the link
      const response = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: productLink })
      });
      
      const aiResults = await response.json();
      if (aiResults && aiResults.length > 0) {
        const formattedResults = aiResults.map((res: any, index: number) => ({
          ...res,
          id: res.id || index + 1,
          image: `https://picsum.photos/seed/${encodeURIComponent(res.name)}/400/400`,
          url: productLink
        }));
        setResults(formattedResults);
      } else {
        setResults(mockResults);
      }
    } catch (error) {
      console.error("Link Search error:", error);
      setResults(mockResults);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setProductLink('');
    setResults([]);
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
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] transition-all cursor-pointer group relative overflow-hidden ${selectedImage ? 'border-blue-400 bg-blue-50/10' : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                >
                  {selectedImage ? (
                    <div className="relative w-full h-full flex flex-col items-center">
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="max-h-[300px] rounded-2xl shadow-lg mb-6 object-cover"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReset();
                        }}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
                      >
                        <RefreshCw size={16} />
                        Try another image
                      </button>
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-8 py-3 bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-full font-medium hover:from-blue-700 hover:to-indigo-900 transition-colors shadow-lg shadow-blue-600/20"
                      >
                        Select Image
                      </button>
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="text-blue-600">
                  <ImageIcon size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Matching Products</h3>
              </div>
              {results.length > 0 && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                  {results.length} Matches Found
                </span>
              )}
            </div>

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
                    <p className="text-slate-600 font-medium animate-pulse">AI is analyzing your image...</p>
                  </motion.div>
                ) : results.length > 0 ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-4"
                  >
                    {results.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{product.name}</h4>
                            <p className="text-sm text-slate-500">{product.store}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-blue-600">{product.price}</span>
                            <a
                              href={product.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                            >
                              <ExternalLink size={16} />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <button
                      onClick={() => alert("Added to cart via PickoPick! Proceeding to checkout...")}
                      className="w-full py-4 mt-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Buy All via PickoPick
                    </button>
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
                      Upload an image to see visually similar products from around the world.
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
