'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase'; // Supabase ইমপোর্ট নিশ্চিত করুন
import { useRouter } from 'next/navigation';

interface HeroProps {
  onExplore: () => void;
}

const Hero = ({ onExplore }: HeroProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // লগআউট ফাংশন
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh(); // পেজ রিফ্রেশ করে লগইন স্টেট রিসেট করবে
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center bg-black overflow-hidden">
      
      {/* ১. Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://plus.unsplash.com/premium_photo-1661376973064-48f778b0d8cd?q=80&w=1470&auto=format&fit=crop" 
          alt="Fresh Agro Products" 
          className="w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black" />
      </div>

      {/* ২. Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-30 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-black/40 backdrop-blur-xl p-3 px-6 rounded-2xl border border-white/10 shadow-2xl">
          
          {/* বাম পাশে: লোগো ও ব্র্যান্ড নাম */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white p-1 rounded-lg">
              <img src="/final.png" alt="SeaLand Logo" className="h-7 md:h-8 w-auto" />
            </div>
            <span className="text-white font-extrabold text-base md:text-xl tracking-tighter uppercase">
              SEALAND <span className="text-green-500">AGRO</span>
            </span>
          </div>

          {/* মাঝখানে: ডেস্কটপ মেনু */}
          <ul className="hidden md:flex items-center gap-8 text-white font-bold text-[10px] lg:text-[11px] tracking-[0.2em] uppercase">
            <li><Link href="/" className="hover:text-green-500 transition-colors">HOME</Link></li>
            <li><button onClick={onExplore} className="hover:text-green-500 transition-colors uppercase">SHOP</button></li>
            <li><Link href="/b2b" className="hover:text-green-500 transition-colors">B2B PARTNER</Link></li>
          </ul>
          
          {/* ডান পাশে: লগইন/লগআউট বাটন */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                {/* ইউজার স্ট্যাটাস */}
                <div className="bg-green-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-green-500/30 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="max-w-[60px] md:max-w-none truncate">
                    {user.is_b2b ? '💎 B2B' : '👤 User'}
                  </span>
                </div>
                
                {/* লগআউট বাটন (এটি নতুন যুক্ত করা হয়েছে) */}
                <button 
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-red-500/20 hover:text-red-400 text-white px-3 py-1.5 rounded-full border border-white/10 text-[9px] font-bold uppercase transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-full font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 active:scale-95">
                  Sign In
                </button>
              </Link>
            )}

            {/* মোবাইল হ্যামবার্গার মেনু বাটন */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ৩. মোবাইল ড্রপডাউন মেনু */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-[85px] left-6 right-6 z-20 bg-black/95 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
            <ul className="flex flex-col gap-5 text-white font-bold text-xs tracking-[0.2em] uppercase text-center">
              <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">HOME</Link></li>
              <li><button onClick={() => { onExplore(); setIsMobileMenuOpen(false); }} className="block w-full py-2">SHOP</button></li>
              <li><Link href="/b2b" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">B2B PARTNER</Link></li>
              {user && (
                 <li className="pt-4 border-t border-white/10">
                    <p className="text-green-500 text-[10px] lowercase mb-2">{user.email}</p>
                    <button 
                      onClick={handleLogout}
                      className="text-red-400 text-[10px] font-bold uppercase tracking-widest"
                    >
                      Logout
                    </button>
                 </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* ৪. Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl pt-16">
        <h1 className="text-5xl md:text-8xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl">
          SEALAND <span className="text-green-500">AGRO</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-200 mb-10 italic font-light tracking-wide max-w-2xl mx-auto opacity-90">
          "A Commitment To Freshness"
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onExplore}
            className="px-10 py-4 bg-green-600 text-white rounded-full font-black text-lg hover:bg-green-700 hover:scale-105 transition-all w-full md:w-auto shadow-2xl shadow-green-600/30 uppercase tracking-widest"
          >
            Explore Catalog
          </button>

          {!user?.is_b2b && (
            <Link href="/b2b" className="w-full md:w-auto">
              <button className="px-10 py-4 border-2 border-white/30 bg-white/5 text-white rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all w-full md:w-auto uppercase tracking-widest">
                B2B Partnership
              </button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;