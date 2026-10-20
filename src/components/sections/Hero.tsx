'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/sections/context/AuthContext';
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
  const [isB2BPartner, setIsB2BPartner] = useState(false);

  // profiles টেবিল থেকে role ও is_b2b চেক করা
  useEffect(() => {
    async function checkUserProfile() {
      if (!user?.id) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_b2b')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserRole(profile.role);
        if (profile.role === 'b2b' || profile.is_b2b === true) {
          setIsB2BPartner(true);
        }
      }
    }
    
    checkUserProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.refresh();
      setIsOpen(false);
      router.push('/'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleHomeClick = () => {
    setIsOpen(false);
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden font-sans">
      
      {/* ব্যাকড্রপ ওভারলে */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-all duration-300 animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* মোবাইল রেসপনসিভ প্রফেশনাল সাইডবার */}
      <aside className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] md:w-[380px] bg-[#080808]/95 backdrop-blur-2xl border-r border-white/10 z-[70] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[20px_0_50px_rgba(0,0,0,0.9)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* ফ্লেক্স কন্টেইনার যাতে ফুটার সবসময় নিচে বা স্ক্রোলে থাকে */}
        <div className="flex flex-col h-full justify-between p-5 sm:p-6 overflow-y-auto no-scrollbar">
          
          {/* উপরের অংশ: হেডার ও নেভিগেশন */}
          <div>
            {/* হেডার ও ব্র্যান্ডিং */}
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="bg-white p-1.5 rounded-xl shadow-lg shadow-white/5">
                  <img src="/final.png" alt="Logo" className="h-5 sm:h-6 w-auto" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-sm sm:text-base tracking-tight uppercase leading-none">
                    SEALAND <span className="text-green-500 italic">AGRO</span>
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-gray-500 uppercase mt-1">A Commitment To Frshness.</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 active:scale-95"
              >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* নেভিগেশন লিংকসমূহ */}
            <nav className="mt-5 sm:mt-6 space-y-2">
              <Link 
                href="/" 
                onClick={handleHomeClick} 
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">Home</span>
                </div>
                <span className="text-[10px] font-mono text-gray-600 group-hover:text-green-500 transition-colors">01</span>
              </Link>
              
              <button 
                onClick={() => { onExplore(); setIsOpen(false); }} 
                className="w-full group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform" />
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">Shop Products</span>
                </div>
                <span className="text-[10px] font-mono text-gray-600 group-hover:text-green-500 transition-colors">02</span>
              </button>

              {/* ড্যাশবোর্ড (লগইন করা থাকলে) */}
              {user && (
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsOpen(false)} 
                  className="group flex items-center justify-between p-3 rounded-2xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all border border-green-500/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider">My Dashboard</span>
                  </div>
                  <span className="text-xs">→</span>
                </Link>
              )}

              {/* B2B Partner (B2B না হলে শুধু দেখাবে) */}
              {!isB2BPartner && (
                <Link 
                  href="/b2b" 
                  onClick={() => setIsOpen(false)} 
                  className="group flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform" />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider">B2B Partner</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-600 group-hover:text-green-500 transition-colors">B2B</span>
                </Link>
              )}

              {/* এডমিন প্যানেল */}
              {(userRole === 'admin' || userRole === 'staff') && (
                <div className="pt-3 border-t border-white/10 mt-3">
                  <Link 
                    href="/admin-panel" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-between p-3 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs">⚡</span>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider">Admin Panel</span>
                    </div>
                    <span className="text-[9px] font-mono bg-red-500/20 px-2 py-0.5 rounded-full text-red-300">ADMIN</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* নিচের ফুটার অংশ: ইউজার স্টেট ও সাইন আউট কার্ড (এখন ফ্লেক্সের কারণে সবসময় দৃশ্যমান থাকবে) */}
          <div className="pt-4 border-t border-white/10 mt-4 flex-shrink-0">
            {user ? (
              <div className="space-y-2.5">
                <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs flex-shrink-0">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[8px] text-gray-500 uppercase tracking-widest font-black">Logged In</p>
                    <p className="text-white text-[11px] font-bold truncate font-mono">{user.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-red-500/20 active:scale-98"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <button className="w-full py-3.5 bg-green-500 hover:bg-green-400 text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-green-500/20 active:scale-98">
                  Sign In Account
                </button>
              </Link>
            )}
          </div>

        </div>
      </aside>

      {/* ফ্লোটিং মেনু বাটন */}
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 sm:gap-3 bg-black/60 backdrop-blur-xl border border-white/15 p-1.5 pr-4 sm:p-2 sm:pr-5 rounded-full hover:bg-black/80 hover:border-green-500/50 transition-all shadow-2xl active:scale-95"
        >
          <div className="bg-green-500 text-black p-1.5 sm:p-2 rounded-full group-hover:rotate-90 transition-transform duration-300">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <span className="text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-green-400 transition-colors">Menu</span>
        </button>
      </div>

      {/* ব্যাকগ্রাউন্ড হিরো সেকশন */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://plus.unsplash.com/premium_photo-1661376973064-48f778b0d8cd?q=80&w=1470&auto=format&fit=crop" 
          alt="Fresh Agro" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl pt-10">
        <h1 className="text-4xl sm:text-6xl md:text-9xl font-black text-white mb-4 tracking-tighter">
          SEALAND <span className="text-green-500">AGRO</span>
        </h1>
        <p className="text-sm sm:text-lg md:text-2xl text-gray-200 mb-8 sm:mb-12 italic font-light tracking-wide max-w-2xl mx-auto opacity-90">
          "A Commitment To Freshness"
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-center w-full max-w-md sm:max-w-none mx-auto">
          <button 
            onClick={onExplore}
            className="px-8 sm:px-10 py-3.5 sm:py-4 bg-green-600 text-white rounded-full font-black text-sm sm:text-lg hover:bg-green-700 hover:scale-105 transition-all w-full sm:w-auto shadow-2xl shadow-green-600/30 uppercase tracking-widest"
          >
            Explore Catalog
          </button>

          {!isB2BPartner && (
            <Link href="/b2b" className="w-full sm:w-auto">
              <button className="px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-white/30 bg-white/5 text-white rounded-full font-bold text-sm sm:text-lg hover:bg-white hover:text-black transition-all w-full sm:w-auto uppercase tracking-widest">
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