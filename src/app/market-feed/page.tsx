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

  const currentDate = new Date().toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });

  // পিসি এবং মোবাইলের জন্য সমন্বিত প্রিন্ট ও পিডিএফ ডাউনলোড হ্যান্ডলার
  const handlePrintOrDownload = async () => {
    // মোবাইল ডিভাইস শনাক্ত করার জন্য
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      const element = document.getElementById('pdf-printable-area');
      if (!element) return;

      // মোবাইলের জন্য html2pdf ব্যবহার করে সরাসরি পিডিএফ ডাউনলোড
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin:       5,
        filename:     'SeaLand-Agro-Price-List.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).save();
    } else {
      // পিসির জন্য আগের মতো স্ট্যান্ডার্ড window.print()
      window.print();
    }
  };

  return (
    <div className="h-screen bg-[#030303] text-white font-sans flex flex-col overflow-hidden">
      
      {/* ১. ফিক্সড ড্যাশবোর্ড থিমড হেডার ও ফিল্টার সেকশন (স্ক্রিন মোডে থাকবে, প্রিন্টে হাইড হবে) */}
      <div className="flex-shrink-0 bg-[#080808]/95 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 md:px-10 py-5 space-y-4 shadow-2xl z-50 print:hidden">
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
              {/* প্রিন্ট বা পিডিএফ ডাউনলোড বাটন */}
              <button 
                onClick={handlePrintOrDownload}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>📄</span> Price List PDF
              </button>

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

      {/* ২. মূল গ্রিড সেকশন (স্ক্রিন মোডে স্ক্রল হবে, প্রিন্ট করার সময় হাইড থাকবে) */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 sm:p-6 md:p-10 print:hidden">
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

      {/* ৩. প্রিন্ট বা পিডিএফ লেআউট (এখানে id="pdf-printable-area" যুক্ত করা হয়েছে যাতে মোবাইল ও পিসি উভয় মাধ্যমেই ডাটা রেন্ডার হয়) */}
      <div id="pdf-printable-area" className="hidden print:block bg-white text-black p-4 font-sans text-xs">
        
        {/* লোগো, কোম্পানি নাম, মোবাইল ও অ্যাড্রেস এবং ডানপাশে QR Code (উপরে) */}
        <div className="border-b-2 border-[#5B8C00] pb-2 mb-3 flex justify-between items-center">
          
          {/* বামপাশে লোগো ও ব্র্যান্ড নাম */}
          <div className="flex items-center gap-2.5">
            <img 
              src="/final.png" 
              alt="SeaLand Agro Logo" 
              onError={(e) => { (e.target as HTMLImageElement).src = '/icon.png'; }}
              className="w-12 h-12 object-contain" 
            />
            <div>
              <h1 className="text-xl font-black italic text-[#102C57] tracking-tight m-0 leading-tight">SeaLand Agro</h1>
              <p className="text-[8.5px] italic text-gray-500 m-0">A commitment to freshness.</p>
              <p className="text-[8px] font-bold text-green-700 m-0 mt-0.5">CELL: 01714-114396</p>
            </div>
          </div>
          
          {/* মাঝখানে ঠিকানা */}
          <div className="text-center text-[8px] font-bold text-gray-700 max-w-[220px]">
            <p className="m-0">HOUSE # 3, ROAD NOBINAGAR # 16, DHAKA UDDAYAN, MOHAMMADPUR, DHAKA</p>
            <p className="m-0 text-gray-500">sealandagro@gmail.com | www.sealandagro.com</p>
          </div>

          {/* ডানপাশে QR Code (App Download Link) */}
          <div className="flex flex-col items-center border border-gray-300 p-1 rounded bg-gray-50">
            <img 
              src="/qr.png" 
              alt="Scan to Download App" 
              onError={(e) => { (e.target as HTMLImageElement).src = '/Untitled.png'; }}
              className="w-12 h-12 object-contain" 
            />
            <span className="text-[7px] font-black text-gray-700 uppercase tracking-tighter mt-0.5">
              Scan for Android App
            </span>
          </div>

        </div>

        {/* তারিখের হেডার */}
        <div className="text-center mb-3">
          <span className="text-xs font-bold bg-gray-100 px-3 py-1 rounded border border-gray-300">
            {currentDate} তারিখের মূল্য তালিকা।
          </span>
        </div>

        {/* ক্যাটাগরি অনুযায়ী টেবিল লুপ */}
        {['LOCAL', 'CHINESE & LOCAL', 'FRUITS', 'CHINESE', 'FISH', 'FROZEN'].map((catName) => {
          const categoryItems = filteredItems.filter(i => (i.category || 'LOCAL').toUpperCase() === catName);
          if (categoryItems.length === 0) return null;

          return (
            <div key={catName} className="mb-4">
              <table className="w-full border-collapse border border-black text-[11px]">
                <thead>
                  <tr className="bg-[#A4C639] text-white text-left">
                    <th className="border border-black px-1.5 py-1 w-10 text-center font-bold">Sl.No</th>
                    <th className="border border-black px-2 py-1 font-bold uppercase">{catName} Commodities</th>
                    <th className="border border-black px-2 py-1 w-20 text-right font-bold">Price</th>
                    <th className="border border-black px-1.5 py-1 w-16 text-center font-bold">Per</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryItems.map((item, index) => (
                    <tr key={item.id} className="border-b border-gray-300">
                      <td className="border border-black px-1 py-0.5 text-center font-mono">{String(index + 1).padStart(2, '0')}</td>
                      <td className="border border-black px-2 py-0.5 font-medium">{item.name_en}</td>
                      <td className="border border-black px-2 py-0.5 text-right font-bold">
                        {item.current_stock === 0 ? <span className="text-red-600 italic">Stock out</span> : `৳${item.b2b_price || item.price}`}
                      </td>
                      <td className="border border-black px-1 py-0.5 text-center uppercase text-[10px]">{item.unit || 'KG'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}

      </div>

    </div>
  );
}