'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/sections/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OrderHistory from './order-history/OrderHistory';

type TabType = 'overview' | 'orders' | 'support';

interface UserProfile {
  full_name?: string;
  phone?: string;
  address?: string;
  total_spending?: number;
}

// ---------------- ভিডিওর মতো চিকন কার্সারযুক্ত টাইপরাইটার অ্যানিমেশন ----------------
function TypewriterTagline() {
  const taglines = [
    'A COMMITMENT TO FRESHNESS',
    'A COMMITMENT TO TRANSPARENCY'
  ];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = taglines[index];
    let timeout: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length + 1));
        }, 75);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(fullText.substring(0, displayText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % taglines.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index]);

  return (
    <div className="h-6 flex items-center">
      <p className="text-[11px] sm:text-xs font-mono tracking-widest uppercase font-bold flex items-center">
        <span className="text-green-500 mr-2">SeaLand Agro</span> |{' '}
        <span className="ml-2 text-gray-300 inline-flex items-center">
          &quot;{displayText}
          {/* একদম চিকন ও লেখার সমান হাইটযুক্ত সবুজ কার্সার বার */}
          <span className="inline-block w-[2px] h-[1.1em] bg-green-500 ml-1.5 align-middle animate-pulse shadow-[0_0_8px_#22c55e]"></span>
          &quot;
        </span>
      </p>
    </div>
  );
}
// --------------------------------------------------------------------------

export default function CustomerDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [totalSpending, setTotalSpending] = useState<number>(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function checkApprovalAndFetch() {
      setLoading(true);

      const { data: b2bReq, error: b2bError } = await supabase
        .from('b2b_requests')
        .select('status, company_name')
        .eq('email', user?.email)
        .maybeSingle();

      if (b2bError || !b2bReq || b2bReq.status !== 'approved') {
        setIsApproved(false);
        setLoading(false);
        return;
      }

      setIsApproved(true);
      if (b2bReq.company_name) {
        setCompanyName(b2bReq.company_name);
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        const spending = Number(profileData.total_spending || 0);
        setTotalSpending(spending);
        setLoyaltyPoints(Math.floor(spending / 100));
      }
      setLoading(false);
    }

    checkApprovalAndFetch();
  }, [user, router]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-green-500 font-mono font-bold tracking-[0.3em] text-xs">
        <span className="animate-pulse">VERIFYING PARTNER ACCESS...</span>
      </div>
    );
  }

  if (isApproved === false) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
        <div className="bg-white/[0.03] border border-white/10 p-10 md:p-14 rounded-[3.5rem] max-w-lg w-full text-center space-y-6 backdrop-blur-xl">
          <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            ⏳
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white italic">
              Approval Pending
            </h1>
            <p className="text-xs text-gray-400 mt-3 font-mono leading-relaxed">
              আপনার বিটুবি পার্টনারশিপ আবেদনটি বর্তমানে এডমিন প্যানেলের পর্যালোচনায় আছে। এডমিন এপ্রুভ করার পর আপনি কাস্টমার ড্যাশবোর্ড ও সাপ্লাই চেইন এক্সেস পাবেন।
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <a 
              href="https://wa.me/8801714514396" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#20ba5a] transition-all shadow-lg"
            >
              💬 WhatsApp-এ যোগাযোগ করুন
            </a>
            <Link 
              href="/" 
              className="w-full py-4 bg-white/5 border border-white/10 text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              ← হোমপেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-6 md:p-10 font-sans pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP NAVIGATION HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-6 bg-white/[0.02] border border-white/10 p-6 sm:p-8 rounded-[35px] backdrop-blur-xl relative overflow-hidden group">
          
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/20 transition-all duration-700"></div>

          <div className="space-y-2 relative z-10">
            
            {/* কোম্পানির নাম ও এন্টারপ্রাইজ ব্যাজ */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter italic text-green-400 leading-none drop-shadow-lg">
                {companyName || 'My Dashboard'}
              </h1>

              <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                VERIFIED B2B PARTNER
              </span>
            </div>

            {/* টাইপরাইটার অ্যানিমেশন */}
            <TypewriterTagline />

          </div>

          {/* ব্যাক টু শপ বাটন */}
          <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
            <Link href="/" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white text-gray-300 hover:text-black border border-white/15 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg">
                ← Back To Shop
              </button>
            </Link>
          </div>

        </div>

        {/* FEATURE TABS */}
        <div className="flex overflow-x-auto gap-3 mb-8 no-scrollbar border-b border-white/10 pb-4 sticky top-0 bg-[#050505]/90 backdrop-blur-md z-20 pt-2">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'orders', label: '📦 Order History' },
            { id: 'support', label: '💬 Support & Logistics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap text-[10px] font-black uppercase tracking-[0.15em] transition-all border ${
                activeTab === tab.id
                  ? 'bg-green-500 text-black border-green-500 shadow-lg shadow-green-500/20'
                  : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* DYNAMIC CONTENT AREA */}
        <main className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-[30px]">
                  <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Total Procurement</p>
                  <h3 className="text-3xl sm:text-4xl font-black italic text-white mt-2">৳{totalSpending.toLocaleString()}</h3>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-6 sm:p-8 rounded-[30px]">
                  <p className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Loyalty Points</p>
                  <h3 className="text-3xl sm:text-4xl font-black text-green-500 italic mt-2">{loyaltyPoints} PTS</h3>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-500 text-black p-6 sm:p-8 rounded-[30px] flex flex-col justify-between">
                  <h3 className="text-2xl sm:text-3xl font-black italic uppercase">15% Seasonal Discount</h3>
                  <p className="text-[10px] text-black/80 font-mono font-bold uppercase mt-2">On Capsicum & Cherry Tomatoes</p>
                </div>
              </div>

            </div>
          )}
          
          {activeTab === 'orders' && <OrderHistory />}

          {activeTab === 'support' && (
            <div className="bg-white/[0.02] border border-white/10 p-8 sm:p-16 rounded-[40px] text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic text-white">24/7 Logistics Support</h2>
              <a href="https://wa.me/8801714514396" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                Contact via WhatsApp
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}