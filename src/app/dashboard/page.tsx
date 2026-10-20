'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/sections/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OrderHistory from './order-history/OrderHistory';

type TabType = 'overview' | 'orders' | 'support';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [totalSpending, setTotalSpending] = useState<number>(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (profileData) {
        const spending = Number(profileData.total_spending || 0);
        setTotalSpending(spending);
        setLoyaltyPoints(Math.floor(spending / 100));
        if (profileData.order_status) setOrderStatus(profileData.order_status);
      }
      setLoading(false);
    }

    fetchProfile();
  }, [user, router]);

  if (loading) return <div className="h-screen bg-black flex items-center justify-center text-white font-black tracking-[0.3em] text-xs">LOADING SEALAND OS...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10 font-sans pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-500 w-2 h-2 rounded-full animate-pulse"></span>
              <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic text-green-500 leading-none">My Dashboard</h1>
            </div>
            <p className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-widest">Partner: <span className="text-white">#SL-{user?.id?.slice(0,5).toUpperCase()}</span></p>
          </div>
          <Link href="/">
            <button className="px-8 py-3 border border-white/10 rounded-xl md:rounded-full font-black text-[10px] uppercase hover:bg-white hover:text-black transition-all">BACK TO SHOP</button>
          </Link>
        </div>

        {/* FEATURE TABS */}
        <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar border-b border-white/10 pb-4 sticky top-0 bg-[#050505] z-10 pt-2">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'orders', label: 'Order History' },
            { id: 'support', label: 'Support' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[9px] font-black uppercase tracking-[0.15em] transition-all border ${
                activeTab === tab.id ? 'bg-green-500 text-black border-green-500' : 'bg-white/5 text-gray-500 border-transparent hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <main className="space-y-6 md:space-y-10">
          
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              
              {/* TOP SUMMARY CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[35px] relative overflow-hidden group">
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Total Spending</p>
                  <h3 className="text-4xl font-black italic text-white">৳{totalSpending.toLocaleString()}</h3>
                  <p className="text-[10px] text-green-500 mt-2 font-bold uppercase italic tracking-tighter">Lifetime Procurement</p>
                </div>

                <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[35px] relative overflow-hidden group">
                  <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest mb-2">Loyalty Points</p>
                  <h3 className="text-4xl font-black text-green-500 italic">{loyaltyPoints}</h3>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Silver Status</p>
                </div>

                <div className="bg-green-500 text-black p-8 rounded-[35px] relative overflow-hidden group shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                  <p className="text-black/60 text-[10px] uppercase font-black tracking-widest mb-2">Active Savings</p>
                  <h3 className="text-3xl font-black italic leading-tight">15% Seasonal<br />Benefit</h3>
                  <p className="text-[10px] text-black/80 mt-2 font-bold uppercase italic">On Capsicum & Cherry</p>
                </div>
              </div>

            </div>
          )}
          
          {activeTab === 'orders' && <OrderHistory />}

          {activeTab === 'support' && (
            <div className="bg-white/[0.02] border border-white/5 p-12 md:p-24 rounded-[40px] text-center">
              <h2 className="text-2xl md:text-4xl font-black uppercase mb-4 tracking-tighter italic">Business Support</h2>
              <p className="text-gray-500 text-xs md:text-sm max-w-sm mx-auto mb-10 font-bold uppercase tracking-widest">
                Need help with supply chain or bulk pricing? Our logistics experts are active 24/7.
              </p>
              <a href="https://wa.me/8801700000000" target="_blank" rel="noopener noreferrer">
                <button className="px-12 py-4 bg-white text-black rounded-full font-black text-[10px] uppercase hover:bg-green-500 transition-all">
                  Contact via WhatsApp
                </button>
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}