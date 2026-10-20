'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: string;
  name_en: string;
  price: number;
  b2b_price: number;
  current_stock: number;
  unit: string;
  category?: string; // ডাটাবেজে ক্যাটাগরি থাকলে এটি কাজ করবে
  image_url?: string;
}

export default function MarketFeed() {
  const [marketProducts, setMarketProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Vegetables', 'Fruits', 'Fish', 'Exotic'];

  useEffect(() => {
    async function fetchMarketData() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('name_en', { ascending: true });

      if (data) setMarketProducts(data);
      setLoading(false);
    }
    fetchMarketData();
  }, []);

  // ফিল্টারিং লজিক
  const filteredProducts = useMemo(() => {
    return marketProducts.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.name_en.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm, marketProducts]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-64 w-full bg-white/5 rounded-[40px]"></div>
      ))}
    </div>
  );

  return (
    <div className="space-y-10">
      
      {/* ১. কন্ট্রোল বার: সার্চ ও ক্যাটাগরি */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeCategory === cat 
                ? 'bg-green-500 border-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative group">
          <input 
            type="text" 
            placeholder="SEARCH MARKET..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-green-500/50 w-full md:w-72 transition-all"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">🔍</span>
        </div>
      </div>

      {/* ২. মার্কেট টিকেট (Ticker) */}
      <div className="flex overflow-hidden bg-white/[0.02] border-y border-white/5 py-4 whitespace-nowrap">
        <div className="flex animate-marquee gap-12">
          {marketProducts.map((p) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]"></span>
              <span className="text-[10px] font-black uppercase text-white tracking-widest">{p.name_en}</span>
              <span className="text-green-500 font-mono text-xs">৳{p.b2b_price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ৩. প্রিমিয়াম প্রোডাক্ট গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="group relative bg-white/[0.02] border border-white/5 rounded-[40px] p-5 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 hover:border-green-500/20"
          >
            {/* ইমেজ সেকশন (আগের ডিজাইনের ছোঁয়া) */}
            <div className="aspect-square bg-gradient-to-br from-white/[0.05] to-transparent rounded-[30px] mb-6 relative overflow-hidden flex items-center justify-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name_en} className="w-4/5 h-4/5 object-contain group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <span className="text-4xl opacity-10 font-black italic">{product.name_en[0]}</span>
              )}
              
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/5">
                <p className="text-[8px] font-black text-green-500 uppercase tracking-widest">{product.unit}</p>
              </div>
            </div>

            {/* তথ্য সেকশন */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-black italic text-white uppercase leading-none tracking-tighter">{product.name_en}</h4>
                <div className={`h-2 w-2 rounded-full ${product.current_stock > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[8px] font-black text-gray-600 uppercase mb-1 tracking-widest">B2B Rate</p>
                  <p className="text-3xl font-black text-white italic leading-none">৳{product.b2b_price}</p>
                </div>
                
                <button className="h-12 w-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-green-500 transition-all duration-300">
                  <span className="text-xl font-bold text-white group-hover:text-black">+</span>
                </button>
              </div>
            </div>

            {/* হোভার গ্লো */}
            <div className="absolute inset-0 bg-green-500/5 rounded-[40px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"></div>
          </div>
        ))}
      </div>

      {/* ৪. লাইভ আপডেট স্ট্যাটাস */}
      <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
           <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Live Inventory Feed</p>
        </div>
        <p className="text-[8px] text-gray-700 font-bold uppercase italic">SeaLand Agro Strategic Operations Control</p>
      </div>
    </div>
  );
}