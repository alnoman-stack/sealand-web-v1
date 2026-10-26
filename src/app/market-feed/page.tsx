'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MarketItem {
  id: string;
  name_en: string;
  category: string;
  b2b_price: number;
  price: number;
  unit: string;
  current_stock: number;
  image_url?: string;
}

export default function MarketFeedPage() {
  const router = useRouter();
  const [items, setItems] = useState<MarketItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MarketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'LOCAL', 'CHINESE & LOCAL', 'FRUITS', 'CHINESE', 'FISH', 'FROZEN'];

  useEffect(() => {
    async function fetchMarketData() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name_en', { ascending: true });

      if (error) {
        console.error('Error fetching market feed:', error.message);
      } else if (data) {
        setItems(data);
        setFilteredItems(data);
      }
      setLoading(false);
    }

    fetchMarketData();
  }, []);

  // সার্চ এবং ক্যাটাগরি ফিল্টার লজিক
  useEffect(() => {
    let result = items;

    if (selectedCategory !== 'ALL') {
      result = result.filter(item => item.category?.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchTerm.trim() !== '') {
      result = result.filter(item => item.name_en?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    setFilteredItems(result);
  }, [searchTerm, selectedCategory, items]);

  return (
    <div className="h-screen bg-[#030303] text-white font-sans flex flex-col overflow-hidden">
      
      {/* ফিক্সড ড্যাশবোর্ড থিমড হেডার ও ফিল্টার সেকশন (স্ক্রল হবে না) */}
      <div className="flex-shrink-0 bg-[#080808]/95 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 md:px-10 py-5 space-y-4 shadow-2xl z-50">
        <div className="max-w-7xl w-full mx-auto space-y-4">
          
          {/* টপ স্পেশাল ব্যাজ ও হেডার */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-mono font-bold tracking-wide border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                SPECIAL B2B WHOLESALE PRICING ACTIVE
              </div>
              <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white italic">
                Live Market <span className="text-green-500">Feed</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <button className="px-5 py-2.5 bg-green-500 hover:bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg">
                  📊 ERP Dashboard
                </button>
              </Link>
              <Link href="/">
                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                  ← Home
                </button>
              </Link>
            </div>
          </div>

          {/* ক্যাটাগরি ফিল্টার বাটনস ও সার্চ বার */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                    selectedCategory === cat 
                      ? 'bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20' 
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="w-full lg:w-80 relative">
              <span className="absolute left-4 top-3 text-gray-500 text-sm">🔍</span>
              <input 
                type="text"
                placeholder="Search commodities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-white/10 pl-11 pr-4 py-2.5 rounded-xl text-xs font-bold text-white outline-none focus:border-green-500 shadow-inner transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

        </div>
      </div>

      {/* শুধু কার্ড সেকশনটি স্ক্রল হবে এবং কোনো স্ক্রলবার দৃশ্যমান থাকবে না */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 sm:p-6 md:p-10">
        <div className="max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="py-24 text-center text-green-500 font-mono font-bold tracking-[0.3em] text-xs animate-pulse">
              CONNECTING TO SEALAND B2B TERMINAL...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/10 rounded-[30px] p-16 text-center shadow-xl">
              <p className="text-gray-400 text-xs font-mono uppercase tracking-widest">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
              {filteredItems.map((item, index) => {
                const seedVal = item.name_en ? item.name_en.charCodeAt(0) : index;
                const isPositive = seedVal % 2 === 0;
                const variance = ((seedVal % 7) * 0.4 + 1.1).toFixed(1);
                const priceVal = item.b2b_price || item.price || 1000;

                return (
                  <div 
                    key={item.id} 
                    className="bg-white/[0.02] border border-white/10 hover:border-green-500/40 rounded-[2.5rem] p-4 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-2xl backdrop-blur-xl"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full pointer-events-none group-hover:bg-green-500/10 transition-all"></div>

                    <div className="space-y-4 relative z-10">
                      
                      {/* প্রোডাক্ট ইমেজ */}
                      <div className="w-full h-52 rounded-[2rem] bg-black/40 border border-white/10 overflow-hidden relative flex items-center justify-center">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name_en} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <span className="text-4xl">🌱</span>
                        )}
                        
                        {/* স্টক স্ট্যাটাস ব্যাজ */}
                        <span className={`absolute top-3 right-3 text-[8px] font-mono font-black px-2.5 py-1 rounded-full uppercase border shadow-sm ${
                          item.current_stock > 0 
                            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {item.current_stock > 0 ? `Stock: ${item.current_stock}` : 'Stock Out'}
                        </span>
                      </div>

                      {/* নাম ও ক্যাটাগরি */}
                      <div className="px-2 space-y-1">
                        <p className="text-[8px] font-mono font-black text-gray-400 uppercase tracking-widest">
                          {item.category || 'Fresh Produce'}
                        </p>
                        <h3 className="text-base font-black uppercase text-white tracking-tight truncate group-hover:text-green-400 transition-colors">
                          {item.name_en}
                        </h3>
                      </div>

                      {/* প্রাইস ট্রেন্ড অ্যানালিটিক্স ও গ্রাফ */}
                      <div className="mx-2 bg-black/40 p-2.5 rounded-xl flex items-center justify-between border border-white/5 shadow-inner">
                        <span className={`text-[9px] font-mono font-black ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                          {isPositive ? `▲ +${variance}%` : `▼ -${variance}%`}
                        </span>
                        <svg className="w-14 h-4" viewBox="0 0 50 20" fill="none">
                          <path 
                            d={isPositive ? "M2 16 Q 15 2, 30 10 T 58 4" : "M2 4 Q 15 18, 30 12 T 58 16"} 
                            stroke={isPositive ? "#22c55e" : "#ef4444"} 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                          />
                        </svg>
                      </div>

                    </div>

                    {/* শুধু প্রাইস ও ইউনিট ডিসপ্লে */}
                    <div className="mt-6 pt-4 border-t border-white/5 px-2 flex items-baseline justify-between relative z-10">
                      <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">B2B Wholesale Price</p>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-2xl font-black italic text-green-400 tracking-tight">৳{priceVal}</span>
                          <span className="text-[10px] font-mono text-gray-400 uppercase">/ {item.unit || 'KG'}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}