'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/sections/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onExplore: () => void;
}

export default function Navbar({ onExplore }: NavbarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isB2BPartner, setIsB2BPartner] = useState(false);

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

  const tagline = '"A Commitment To Freshness"';

  return (
    <>
      {/* ব্যাকড্রপ ওভারলে */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[60] transition-opacity duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* মোবাইল রেসপনসিভ প্রফেশনাল সাইডবার */}
      <aside className={`fixed top-0 left-0 h-full w-[85%] max-w-[340px] md:w-[400px] bg-[#080808]/95 backdrop-blur-2xl border-r border-white/10 z-[70] transform transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-[30px_0_60px_rgba(0,0,0,0.95)] ${
        isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}>
        
        <div className="flex flex-col h-full justify-between p-6 sm:p-8 overflow-y-auto no-scrollbar">
          
          <div>
            {/* লোগো ও ব্র্যান্ডিং */}
            <div className="flex justify-between items-center pb-6 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-white/20 to-white/5 p-2 rounded-2xl shadow-xl border border-white/20 flex items-center justify-center transform transition-transform duration-300 hover:scale-105">
                  <img src="icon.png" alt="Logo" className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-black text-sm sm:text-base tracking-tight uppercase leading-none">
                    SEALAND <span className="text-green-500 italic">AGRO</span>
                  </span>
                  
                  <div className="overflow-hidden whitespace-nowrap border-r-2 border-green-500 animate-typing font-mono text-[9px] sm:text-[10px] text-green-400 font-bold uppercase tracking-wider mt-1.5 transform transition-all">
                    {tagline}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* নেভিগেশন লিংকসমূহ */}
            <nav className="space-y-2">
              
              <Link 
                href="/" 
                onClick={handleHomeClick} 
                className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-white/5 text-green-400 group-hover:bg-green-500 group-hover:text-black transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">Home</span>
                </div>
                <span className="text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              
              <button 
                onClick={() => { onExplore(); setIsOpen(false); }} 
                className="w-full group flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/5 text-left"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-white/5 text-green-400 group-hover:bg-green-500 group-hover:text-black transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">Shop Products</span>
                </div>
                <span className="text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {!isB2BPartner && (
                <Link 
                  href="/b2b" 
                  onClick={() => setIsOpen(false)} 
                  className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/5"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 rounded-xl bg-white/5 text-green-400 group-hover:bg-green-500 group-hover:text-black transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider">B2B Procurement</span>
                  </div>
                  <span className="text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              )}

              {/* মার্কেট ফিড পেজের সঠিক লিংক */}
              <Link 
                href="/market-feed" 
                onClick={() => setIsOpen(false)} 
                className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-white/5 text-green-400 group-hover:bg-green-500 group-hover:text-black transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">Market Feed</span>
                </div>
                <span className="text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              {user && (
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsOpen(false)} 
                  className="group flex items-center justify-between p-3.5 rounded-2xl bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-all border border-green-500/20"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 rounded-xl bg-green-500/20 text-green-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider">My Dashboard</span>
                  </div>
                  <span className="animate-pulse">●</span>
                </Link>
              )}

              <Link 
                href="/about" 
                onClick={() => setIsOpen(false)} 
                className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-white/5 text-green-400 group-hover:bg-green-500 group-hover:text-black transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">About Vision</span>
                </div>
                <span className="text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link 
                href="/support" 
                onClick={() => setIsOpen(false)} 
                className="group flex items-center justify-between p-3.5 rounded-2xl hover:bg-white/5 text-gray-300 hover:text-white transition-all border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2 rounded-xl bg-white/5 text-green-400 group-hover:bg-green-500 group-hover:text-black transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636l3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider">Support</span>
                </div>
                <span className="text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              {(userRole === 'admin' || userRole === 'staff') && (
                <div className="pt-3 border-t border-white/10 mt-3">
                  <Link 
                    href="/admin-panel" 
                    onClick={() => setIsOpen(false)} 
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2 rounded-xl bg-red-500/20 text-red-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      </div>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider">Admin Panel</span>
                    </div>
                    <span className="text-[9px] font-mono bg-red-500/20 px-2 py-0.5 rounded-full text-red-300">ADMIN</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>

          {/* ফুটার অংশ: ইউজার স্টেট ও সাইন আউট */}
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

      {/* ফ্লোটিং মেনু ট্রিগার বাটন */}
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

      <style jsx global>{`
        @keyframes typing {
          0% { width: 0; }
          70%, 90% { width: 100%; }
          100% { width: 0; }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: #22c55e; }
        }
        .animate-typing {
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          animation: typing 6s steps(30, end) infinite, blink-caret .75s step-end infinite;
          max-width: fit-content;
        }
      `}</style>
    </>
  );
}