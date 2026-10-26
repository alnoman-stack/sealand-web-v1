'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/sections/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import OrderHistory from './order-history/OrderHistory';

type TabType = 'overview' | 'orders' | 'payments' | 'support';

interface UserProfile {
  full_name?: string;
  phone?: string;
  address?: string;
}

// ---------------- ভিডিওর মতো চিকন কার্সারযুক্ত টাইপরাইটার অ্যানিমেশন ----------------
function TypewriterTagline() {
  const taglines = [
    'A COMMITMENT TO FRESHNESS',
    'A COMMITMENT TO TRANSPARENCY',
    'SEALAND AGRO B2B SUPPLY CHAIN'
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
      <p className="text-[10px] sm:text-xs font-mono tracking-widest uppercase font-bold flex items-center truncate">
        <span className="text-green-500 mr-1.5 shrink-0">SeaLand Agro</span> |{' '}
        <span className="ml-1.5 text-gray-300 inline-flex items-center truncate">
          &quot;{displayText}
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
  const [totalPaid, setTotalPaid] = useState<number>(0);
  const [totalDue, setTotalDue] = useState<number>(0);
  const [loyaltyPoints, setLoyaltyPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [invoicesList, setInvoicesList] = useState<any[]>([]);

  // পেমেন্ট ও লেজার ট্যাবের ডেট ফিল্টার স্টেট
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function checkApprovalAndFetch() {
      setLoading(true);

      // ১. বিটুবি পার্টনারশিপ স্ট্যাটাস চেক
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

      // ২. ইউজারের প্রোফাইল ফেচ করা
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
      }

      // ৩. সুপাবেজ থেকে বর্তমান ইউজারের ইনভয়েসগুলো ফেচ করা
      const userName = user.user_metadata?.full_name || user.email?.split('@')[0];
      let query = supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (user.id) {
        if (userName) {
          query = query.or(`customer_id.eq.${user.id},customer_name.ilike.%${userName}%`);
        } else {
          query = query.eq('customer_id', user.id);
        }
      }

      const { data: invoicesData, error: invError } = await query;

      if (invoicesData && !invError) {
        setInvoicesList(invoicesData);

        const spending = invoicesData.reduce((acc, inv) => acc + Number(inv.total_amount || 0), 0);
        const paid = invoicesData.reduce((acc, inv) => {
          const received = Number(inv.received_amount || 0);
          const discount = Number(inv.total_discount || 0);
          return acc + received + discount;
        }, 0);

        const due = invoicesData.reduce((acc, inv) => {
          const total = Number(inv.total_amount || 0);
          const received = Number(inv.received_amount || 0);
          const discount = Number(inv.total_discount || 0);
          const calculatedDue = total - (received + discount);
          return acc + Math.max(0, calculatedDue);
        }, 0);

        setTotalSpending(spending);
        setTotalPaid(paid);
        setTotalDue(due);
        setLoyaltyPoints(Math.floor(spending / 100));

        setRecentOrders(invoicesData.slice(0, 3));
      }

      setLoading(false);
    }

    checkApprovalAndFetch();
  }, [user, router]);

  // লেজার ট্যাবের জন্য ডেট ফিল্টার লজিক
  const filteredInvoices = invoicesList.filter((inv: any) => {
    if (!startDate && !endDate) return true;
    const invDate = new Date(inv.created_at).toISOString().split('T')[0];
    if (startDate && invDate < startDate) return false;
    if (endDate && invDate > endDate) return false;
    return true;
  });

  const filteredSpending = filteredInvoices.reduce((acc: number, inv: any) => acc + Number(inv.total_amount || 0), 0);
  const filteredPaid = filteredInvoices.reduce((acc: number, inv: any) => acc + Number(inv.received_amount || 0) + Number(inv.total_discount || 0), 0);
  const filteredDue = Math.max(0, filteredSpending - filteredPaid);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-green-500 font-mono font-bold tracking-[0.3em] text-xs px-4 text-center">
        <span className="animate-pulse">VERIFYING PARTNER ACCESS...</span>
      </div>
    );
  }

  if (isApproved === false) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="bg-white/[0.03] border border-white/10 p-6 sm:p-10 md:p-14 rounded-[2.5rem] sm:rounded-[3.5rem] max-w-lg w-full text-center space-y-6 backdrop-blur-xl">
          <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            ⏳
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight text-white italic">
              Approval Pending
            </h1>
            <p className="text-xs text-gray-400 mt-3 font-mono leading-relaxed">
              আপনার বিটুবি পার্টনারশিপ আবেদনটি বর্তমানে এডমিন প্যানেলের পর্যালোচনায় আছে। এডমিন এপ্রুভ করার পর আপনি কাস্টমার ড্যাশবোর্ড ও সাপ্লাই চেইন এক্সেস পাবেন।
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <a 
              href="https://wa.me/8801714114396" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#20ba5a] transition-all shadow-lg text-center"
            >
              💬 WhatsApp-এ যোগাযোগ করুন
            </a>
            <Link 
              href="/" 
              className="w-full py-4 bg-white/5 border border-white/10 text-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all text-center"
            >
              ← হোমপেজে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#050505] text-white p-3 sm:p-5 md:p-8 font-sans flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex flex-col flex-1 lg:overflow-hidden">
        
        {/* TOP NAVIGATION HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-5 sm:mb-6 gap-4 sm:gap-6 bg-white/[0.02] border border-white/10 p-4 sm:p-6 md:p-8 rounded-[25px] sm:rounded-[35px] backdrop-blur-xl relative overflow-hidden group shrink-0">
          
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/20 transition-all duration-700"></div>

          <div className="space-y-2 relative z-10 w-full lg:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-green-400 leading-none drop-shadow-lg truncate max-w-full">
                {companyName || 'My Dashboard'}
              </h1>

              <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[8px] sm:text-[9px] font-mono font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                VERIFIED B2B
              </span>
            </div>

            <TypewriterTagline />
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto relative z-10 flex-wrap">
            <Link href="/dashboard/create-invoice" className="flex-1 sm:flex-none">
              <button className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-green-500 hover:bg-white text-black rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95 shadow-lg flex items-center justify-center gap-2">
                ⚡ Create New Order
              </button>
            </Link>
            <Link href="/" className="flex-1 sm:flex-none">
              <button className="w-full sm:w-auto px-4 sm:px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/15 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 active:scale-95 text-center">
                ← Back To Shop
              </button>
            </Link>
          </div>

        </div>

        {/* FEATURE TABS */}
        <div className="flex overflow-x-auto gap-2 sm:gap-3 mb-5 sm:mb-6 no-scrollbar border-b border-white/10 pb-3 bg-[#050505]/90 backdrop-blur-md z-20 pt-1 shrink-0">
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'orders', label: '📦 Order History' },
            { id: 'payments', label: '💳 Payments & Ledger' },
            { id: 'support', label: '💬 Support & Logistics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl whitespace-nowrap text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] transition-all border ${
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
        <main className="flex-1 lg:overflow-y-auto space-y-6 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* স্ট্যাটিস্টিকস কার্ড */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white/[0.03] border border-white/15 p-5 sm:p-6 rounded-[24px] sm:rounded-[30px]">
                  <p className="text-gray-400 text-[9px] sm:text-[10px] uppercase font-black tracking-widest">Total Procurement</p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black italic text-white mt-2">৳{totalSpending.toLocaleString()}</h3>
                </div>

                <div className="bg-white/[0.03] border border-white/15 p-5 sm:p-6 rounded-[24px] sm:rounded-[30px]">
                  <p className="text-gray-400 text-[9px] sm:text-[10px] uppercase font-black tracking-widest">Total Paid</p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black italic text-green-400 mt-2">৳{totalPaid.toLocaleString()}</h3>
                </div>

                <div className="bg-white/[0.03] border border-white/15 p-5 sm:p-6 rounded-[24px] sm:rounded-[30px]">
                  <p className="text-gray-400 text-[9px] sm:text-[10px] uppercase font-black tracking-widest">Current Due</p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black italic text-red-400 mt-2">৳{totalDue.toLocaleString()}</h3>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-500 text-black p-5 sm:p-6 rounded-[24px] sm:rounded-[30px] flex flex-col justify-between">
                  <p className="text-black/80 text-[9px] sm:text-[10px] font-mono font-bold uppercase">Loyalty Points</p>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black italic mt-1">{loyaltyPoints} PTS</h3>
                </div>
              </div>

              {/* অ্যাকাউন্ট ম্যানেজার ও সাম্প্রতিক অর্ডারসমূহ */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                
                <div className="bg-white/[0.02] border border-white/10 p-5 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[30px] space-y-4 sm:space-y-6">
                  <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-green-400">Account Manager</h4>
                  <div className="space-y-2.5 sm:space-y-3 text-[11px] sm:text-xs font-mono text-gray-300 break-all">
                    <p><span className="text-gray-500">Email:</span> {user?.email}</p>
                    <p><span className="text-gray-500">Phone:</span> {profile?.phone || 'Not Provided'}</p>
                    <p><span className="text-gray-500">Address:</span> {profile?.address || 'Dhaka, Bangladesh'}</p>
                  </div>
                  <a 
                    href="https://wa.me/8801714114396" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-white/5 border border-white/10 hover:bg-green-500 hover:text-black rounded-xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 text-center"
                  >
                    💬 Chat with Account Manager
                  </a>
                </div>

                <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 p-5 sm:p-6 md:p-8 rounded-[24px] sm:rounded-[30px] space-y-4 sm:space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-green-400">Recent Orders</h4>
                    <button onClick={() => setActiveTab('orders')} className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white">
                      View All →
                    </button>
                  </div>

                  {recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {recentOrders.map((ord: any) => (
                        <div key={ord.id} className="bg-white/[0.02] border border-white/5 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3">
                          <div className="truncate">
                            <p className="text-[11px] sm:text-xs font-black uppercase text-white truncate">Invoice #{ord.invoice_number || ord.id}</p>
                            <p className="text-[9px] sm:text-[10px] font-mono text-gray-500">{new Date(ord.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs sm:text-sm font-black text-green-400">৳{ord.total_amount || 0}</p>
                            <span className="text-[7px] sm:text-[8px] uppercase tracking-widest bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-bold">
                              {ord.status || 'Pending'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 sm:py-10 text-center text-gray-500 text-[11px] sm:text-xs font-mono uppercase">
                      No recent orders found.
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}
          
          {activeTab === 'orders' && <OrderHistory />}

          {/* পেমেন্ট ও লেজার ট্যাব (ডেট রেঞ্জ ফিল্টার ও স্টেটমেন্ট ট্রানজেকশন স্ক্রলেবল কার্ড) */}
          {activeTab === 'payments' && (
            <div className="bg-white/[0.02] border border-white/10 p-5 sm:p-8 md:p-10 rounded-[25px] sm:rounded-[35px] space-y-6">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-black uppercase italic text-green-400">B2B Financial Summary & Ledger</h3>
                  <p className="text-[11px] sm:text-xs text-gray-400 font-mono mt-1">নির্দিষ্ট তারিখের রেঞ্জ সিলেক্ট করে স্টেটমেন্ট ও খরচ রিপোর্ট তৈরি করুন।</p>
                </div>
                
                {/* ডেট রেঞ্জ ফিল্টার ইনপুট */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 w-full lg:w-auto">
                  <div className="flex items-center gap-2 flex-1 sm:flex-none">
                    <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">From:</span>
                    <input 
                      type="date" 
                      value={startDate} 
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-black/50 text-white text-[11px] sm:text-xs p-2 rounded-xl border border-white/10 outline-none [color-scheme:dark] w-full sm:w-auto"
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1 sm:flex-none">
                    <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">To:</span>
                    <input 
                      type="date" 
                      value={endDate} 
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-black/50 text-white text-[11px] sm:text-xs p-2 rounded-xl border border-white/10 outline-none [color-scheme:dark] w-full sm:w-auto"
                    />
                  </div>
                  {(startDate || endDate) && (
                    <button 
                      onClick={() => { setStartDate(''); setEndDate(''); }}
                      className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-xl text-[9px] sm:text-[10px] font-black uppercase w-full sm:w-auto text-center"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
              
              {/* ফিল্টারকৃত সামারি কার্ড */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10">
                  <p className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">Total Bill (Filtered)</p>
                  <p className="text-xl sm:text-2xl font-black text-white mt-1">৳{filteredSpending.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10">
                  <p className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">Total Paid (Filtered)</p>
                  <p className="text-xl sm:text-2xl font-black text-green-400 mt-1">৳{filteredPaid.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/10">
                  <p className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase">Outstanding Due</p>
                  <p className="text-xl sm:text-2xl font-black text-red-400 mt-1">৳{filteredDue.toLocaleString()}</p>
                </div>
              </div>

              {/* Statement Transactions টেবিল যেখানে কেবল ডেটা বেশি হলে ভেতরে স্কল হবে */}
              <div className="space-y-4 pt-4">
                <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-green-400">Statement Transactions</h4>
                <div className="max-h-[220px] overflow-x-auto overflow-y-auto border border-white/5 rounded-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <table className="w-full text-left text-xs min-w-[550px] sm:min-w-full">
                    <thead className="bg-white/5 uppercase text-[8px] sm:text-[9px] font-black text-gray-400 sticky top-0 z-10 backdrop-blur-md">
                      <tr>
                        <th className="p-3 sm:p-4">Date</th>
                        <th className="p-3 sm:p-4">Invoice No</th>
                        <th className="p-3 sm:p-4 text-right">Amount</th>
                        <th className="p-3 sm:p-4 text-right">Paid</th>
                        <th className="p-3 sm:p-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[11px] sm:text-xs">
                      {filteredInvoices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-500 font-mono uppercase text-xs">No records found for this date range.</td>
                        </tr>
                      ) : (
                        filteredInvoices.map((inv: any) => (
                          <tr key={inv.id} className="hover:bg-white/[0.02]">
                            <td className="p-3 sm:p-4 text-gray-400 font-mono text-[9px] sm:text-[10px]">{new Date(inv.created_at).toLocaleDateString()}</td>
                            <td className="p-3 sm:p-4 font-bold text-white">{inv.invoice_number}</td>
                            <td className="p-3 sm:p-4 text-right font-black text-white">৳{inv.total_amount}</td>
                            <td className="p-3 sm:p-4 text-right font-black text-green-400">৳{(Number(inv.received_amount||0) + Number(inv.total_discount||0))}</td>
                            <td className="p-3 sm:p-4 text-right">
                              <span className="px-2.5 py-1 rounded-full text-[7px] sm:text-[8px] font-black uppercase bg-green-500/10 text-green-400 border border-green-500/30">
                                {inv.status || 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-[11px] sm:text-xs text-gray-400 font-mono text-center sm:text-left">নির্দিষ্ট তারিখের এই খরচ রিপোর্ট বা স্টেটমেন্ট প্রিন্ট করতে প্রিন্ট বাটনে ক্লিক করুন।</p>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button 
                    onClick={() => window.print()} 
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-green-500 hover:bg-green-600 text-black font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg text-center"
                  >
                    🖨️ Print Statement Report
                  </button>
                  <a 
                    href="https://wa.me/8801714114396" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 font-black text-[10px] sm:text-xs uppercase tracking-widest rounded-2xl transition-all text-center"
                  >
                    💬 Verify via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="bg-white/[0.02] border border-white/10 p-6 sm:p-12 md:p-16 rounded-[30px] sm:rounded-[40px] text-center max-w-3xl mx-auto space-y-6">
              <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                🎧
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter italic text-white">24/7 Logistics & B2B Support</h2>
              <p className="text-[11px] sm:text-xs text-gray-400 font-mono leading-relaxed">
                পাইকারি অর্ডার ডেলিভারি, ইনভয়েসিং কিংবা পেমেন্ট সংক্রান্ত যেকোনো সহায়তার জন্য আমাদের ডেডিকেটেড সাপ্লাই চেইন টিমের সাথে সরাসরি যোগাযোগ করুন।
              </p>
              <a href="https://wa.me/8801714114396" target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto px-8 py-4 bg-[#25D366] text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg hover:bg-[#20ba5a] transition-all text-center">
                💬 Contact via WhatsApp
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}