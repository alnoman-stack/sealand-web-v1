'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface HeroProps {
  onExplore: () => void;
}

const Hero = ({ onExplore }: HeroProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // ১. এডমিন রোল চেক করা (মেনুতে ড্যাশবোর্ড দেখানোর জন্য)
  useEffect(() => {
    async function getRole() {
      if (user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (data) setUserRole(data.role);
      }
    }
    getRole();
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      setIsOpen(false);
      router.push('/'); // লগআউট করলে হোমে পাঠিয়ে দিবে
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ২. হোম ক্লিক হ্যান্ডলার (এটি মেনু বন্ধ করবে এবং পেজ টপে নিবে)
  const handleHomeClick = (e: React.MouseEvent) => {
    setIsOpen(false);
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
      
      {/* স্লাইড মেনু ওভারলে */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* বাম পাশ থেকে আসা স্লাইড মেনু */}
      <aside className={`fixed top-0 left-0 h-full w-[280px] md:w-[350px] bg-black border-r border-white/10 z-[70] transform transition-transform duration-500 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-8">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1 rounded">
                <img src="/final.png" alt="Logo" className="h-6 w-auto" />
              </div>
              <span className="text-white font-black text-lg tracking-tighter uppercase">SEALAND <span className="text-green-500">AGRO</span></span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <nav className="flex flex-col gap-6">
            <Link href="/" onClick={handleHomeClick} className="text-2xl font-bold text-white hover:text-green-500 transition-all tracking-tight">HOME</Link>
            
            <button onClick={() => { onExplore(); setIsOpen(false); }} className="text-left text-2xl font-bold text-white hover:text-green-500 transition-all tracking-tight uppercase">SHOP</button>
            
            <Link href="/b2b" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-white hover:text-green-500 transition-all tracking-tight uppercase">B2B PARTNER</Link>

            {/* ৩. এডমিন হলে সরাসরি মেনুতে ড্যাশবোর্ড বাটন */}
            {(userRole === 'admin' || userRole === 'staff') && (
              <Link href="/admin-panel" onClick={() => setIsOpen(false)} className="text-2xl font-bold text-red-500 hover:text-white transition-all tracking-tight uppercase border-t border-white/10 pt-4">
                ADMIN PANEL
              </Link>
            )}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/10">
            {user ? (
              <div className="space-y-4">
                <p className="text-green-500 text-[10px] uppercase tracking-widest font-bold truncate">Logged in as: {user.email}</p>
                <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 text-red-500 rounded-xl font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition-all">Sign Out</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <button className="w-full py-4 bg-green-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-green-700 transition-all">Sign In</button>
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* ফ্লোটিং মেনু বাটন */}
      <div className="fixed top-6 left-6 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 p-2 pr-5 rounded-full hover:bg-black/60 transition-all shadow-xl"
        >
          <div className="bg-green-600 p-2 rounded-full group-hover:rotate-90 transition-transform duration-300">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Menu</span>
        </button>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://plus.unsplash.com/premium_photo-1661376973064-48f778b0d8cd?q=80&w=1470&auto=format&fit=crop" 
          alt="Fresh Agro" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl pt-10">
        <h1 className="text-5xl md:text-9xl font-black text-white mb-4 tracking-tighter">
          SEALAND <span className="text-green-500">AGRO</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-12 italic font-light tracking-wide max-w-2xl mx-auto opacity-90">
          "A Commitment To Freshness"
        </p>
        
        <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
          <button 
            onClick={onExplore}
            className="px-10 py-4 bg-green-600 text-white rounded-full font-black text-lg hover:bg-green-700 hover:scale-105 transition-all w-full md:w-auto shadow-2xl shadow-green-600/30 uppercase tracking-widest"
          >
            Explore Catalog
          </button>

          <Link href="/b2b" className="w-full md:w-auto">
            <button className="px-10 py-4 border-2 border-white/30 bg-white/5 text-white rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all w-full md:w-auto uppercase tracking-widest">
              B2B Partnership
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;