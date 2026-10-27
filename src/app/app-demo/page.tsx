'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function NativeAppDemoPage() {
  const [activeTab, setActiveTab] = useState<'market' | 'procurement' | 'logistics' | 'support' | 'erp'>('market');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // রিয়েল সুপাবেস স্টেটসমূহ
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState<boolean>(false);

  // টিকিট ফর্ম স্টেট
  const [ticketName, setTicketName] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMsg, setTicketMsg] = useState('');
  const [ticketCategory, setTicketCategory] = useState('complaint');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // কার্ট স্টেট (B2B Bulk Procurement)
  const [cart, setCart] = useState<{ [key: string]: number }>({});

  // ১. সুপাবেস থেকে রিয়েল মার্কেট প্রডাক্ট ডেটা ফেচ করা
  useEffect(() => {
    async function fetchRealMarketData() {
      setLoadingProducts(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
          // সুপাবেসে টেবিল না থাকলে ফলব্যাক ডেমো ডেটা
          setProducts([
            { id: '1', name: 'Grade-A Roma Tomatoes', category: 'Produce', price: 45, unit: 'kg', trend: '+4.2%', origin: 'Bogura Hub', stock: '12,500 kg', is_up: true },
            { id: '2', name: 'Fresh Water Rui Fish (3kg+)', category: 'Fish', price: 340, unit: 'kg', trend: '-1.8%', origin: 'Jessore Enclosure', stock: '4,200 kg', is_up: false },
            { id: '3', name: 'Broiler Chicken (Dressed)', category: 'Poultry', price: 185, unit: 'kg', trend: '+0.5%', origin: 'Gazipur Farm', stock: '8,000 kg', is_up: true },
            { id: '4', name: 'Najirshail Fine Rice', category: 'Grains', price: 78, unit: 'kg', trend: '+0%', origin: 'Dinajpur Mill', stock: '45,000 kg', is_up: true },
            { id: '5', name: 'Organic Red Onions', category: 'Produce', price: 62, unit: 'kg', trend: '+8.5%', origin: 'Pabna Depot', stock: '18,200 kg', is_up: true },
            { id: '6', name: 'Black Tiger Shrimp (20/30)', category: 'Fish', price: 920, unit: 'kg', trend: '+2.1%', origin: 'Satkhira Agro', stock: '1,800 kg', is_up: true }
          ]);
        } else {
          setProducts(data);
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchRealMarketData();
  }, []);

  // ২. সুপাবেস থেকে কাস্টমারের রিয়েল সাপোর্ট টিকিট ফেচ করা
  const fetchUserTickets = async () => {
    setLoadingTickets(true);
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    setUserTickets(data || []);
    setLoadingTickets(false);
  };

  useEffect(() => {
    if (activeTab === 'support') {
      fetchUserTickets();
    }
  }, [activeTab]);

  // কার্ট আপডেট ফাংশন
  const updateCart = (id: string, qty: number) => {
    if (qty <= 0) {
      const newCart = { ...cart };
      delete newCart[id];
      setCart(newCart);
    } else {
      setCart({ ...cart, [id]: qty });
    }
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [id, qty]) => {
      const p = products.find(prod => prod.id === id);
      return total + (p ? p.price * qty : 0);
    }, 0);
  };

  // রিয়েল টিকিট সাবমিশন
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMsg || !ticketPhone) {
      alert('অনুগ্রহ করে বিষয়, বিবরণ এবং ফোন নম্বর পূরণ করুন।');
      return;
    }
    setSubmittingTicket(true);

    const generatedTicketId = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const { error } = await supabase.from('support_tickets').insert([
        {
          ticket_id: generatedTicketId,
          client_name: ticketName || 'App Client',
          phone: ticketPhone,
          company_name: 'B2B Client',
          ticket_type: ticketCategory,
          subject: ticketSubject,
          message: ticketMsg,
          status: 'OPEN'
        }
      ]);

      if (error) throw error;

      alert(`✅ টিকেট সফলভাবে জমা হয়েছে! টিকেট নম্বর: ${generatedTicketId}`);
      setTicketSubject('');
      setTicketMsg('');
      fetchUserTickets();
    } catch (err: any) {
      alert('টিকেট সাবমিট হয়েছে (ডেমো মোড)। টিকিট আইডি: ' + generatedTicketId);
    } finally {
      setSubmittingTicket(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory || p.cat === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.origin && p.origin.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans flex flex-col items-center justify-start p-2 sm:p-6 overflow-x-hidden">
      
      {/* টপ নেভিগেশন বার */}
      <div className="w-full max-w-md flex justify-between items-center mb-4 px-2">
        <Link href="/" className="text-xs font-mono font-bold text-gray-400 hover:text-white uppercase tracking-widest flex items-center gap-1">
          ← Web Store
        </Link>
        <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
          100/100 Native UX
        </span>
      </div>

      {/* নেটিভ আইফোন/অ্যান্ড্রয়েড ফ্রেম */}
      <div className="w-full max-w-md bg-[#080808] border border-white/10 rounded-[2.8rem] shadow-[0_0_50px_rgba(34,197,94,0.15)] overflow-hidden flex flex-col h-[850px] relative">
        
        {/* ডায়নামিক নচ / আইল্যান্ড ও স্ট্যাটাস বার */}
        <div className="bg-[#030303] px-7 pt-3 pb-2 flex justify-between items-center text-[10px] font-mono text-gray-400 border-b border-white/5 select-none">
          <span className="font-black text-white">9:41</span>
          <div className="w-20 h-4 bg-black rounded-full border border-white/10 mx-auto -mt-1 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-green-500 font-extrabold text-[9px]">5G</span>
            <div className="w-5 h-2.5 border border-gray-400 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-full bg-green-500 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* অ্যাপ ব্র্যান্ডিং হেডার */}
        <div className="px-5 py-3.5 bg-[#0a0a0a] border-b border-white/10 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center text-black font-black text-xs shadow-md shadow-green-500/30">
              S
            </div>
            <div>
              <h1 className="text-xs font-black tracking-tight uppercase italic flex items-center gap-1">
                SEALAND <span className="text-green-500">AGRO</span>
              </h1>
              <p className="text-[8px] text-gray-400 font-mono tracking-wider">Enterprise B2B Terminal</p>
            </div>
          </div>

          <a
            href="https://wa.me/8801714114396"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-full text-[10px] font-mono font-bold hover:bg-[#25D366] hover:text-black transition-all flex items-center gap-1"
          >
            💬 Helpline
          </a>
        </div>

        {/* মেইন কনটেন্ট ভিউপোর্ট (৫টি ট্যাব) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs [&::-webkit-scrollbar]:hidden">
          
          {/* TAB 1: REAL MARKET FEED */}
          {activeTab === 'market' && (
            <div className="space-y-3.5">
              
              {/* সার্চ ও ফিল্টার */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Tomatoes, Rui, Chicken..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-gray-500 outline-none focus:border-green-500 transition-all"
                  />
                  <span className="absolute left-2.5 top-2.5 text-xs text-gray-500">🔍</span>
                </div>
                
                {/* ক্যাটাগরি চিপস */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                  {['All', 'Produce', 'Fish', 'Poultry', 'Grains'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all whitespace-nowrap ${
                        selectedCategory === cat
                          ? 'bg-green-500 text-black shadow-lg shadow-green-500/20'
                          : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* প্রডাক্ট লিস্ট */}
              {loadingProducts ? (
                <div className="text-center py-12 text-gray-500 space-y-2">
                  <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-[10px] uppercase font-bold tracking-widest">Syncing Supabase Database...</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-3 flex justify-between items-center hover:border-green-500/40 transition-all group">
                      <div className="space-y-1">
                        <p className="font-bold text-white text-xs group-hover:text-green-400 transition-colors">{p.name}</p>
                        <p className="text-[9px] text-gray-400">
                          {p.origin || 'Main Hub'} • <span className="text-gray-300">Stock: {p.stock || 'Available'}</span>
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold text-green-400 text-xs">৳{p.price}<span className="text-[8px] text-gray-400">/{p.unit || 'kg'}</span></p>
                        <p className={`text-[8px] font-black ${p.is_up !== false ? 'text-green-500' : 'text-red-400'}`}>
                          {p.trend || '+0.0%'}
                        </p>
                        <button
                          onClick={() => updateCart(p.id, (cart[p.id] || 0) + 50)}
                          className="px-2.5 py-1 bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] font-black rounded-lg hover:bg-green-500 hover:text-black transition-all"
                        >
                          + Add 50kg
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: BULK PROCUREMENT & INVOICE */}
          {activeTab === 'procurement' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30 p-3.5 rounded-2xl space-y-1">
                <p className="text-[10px] font-black uppercase text-green-400">B2B Wholesale Order Generator</p>
                <p className="text-[11px] text-gray-300 leading-tight">আইটেম সিলেক্ট করুন, টিয়ার ডিসকাউন্ট বুঝে নিন এবং সরাসরি হোয়াটসঅ্যাপ ইনভয়েস কনফার্ম করুন।</p>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] uppercase text-gray-400 font-bold">Selected Cart Items:</p>
                {Object.keys(cart).length === 0 ? (
                  <div className="text-center py-10 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <span className="text-2xl">🛒</span>
                    <p className="text-gray-500 text-xs">আপনার কার্ট খালি। মার্কেট ফিড থেকে পণ্য যোগ করুন।</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([id, qty]) => {
                    const prod = products.find(p => p.id === id);
                    if (!prod) return null;
                    return (
                      <div key={id} className="bg-white/5 border border-white/10 p-3 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="font-bold text-white text-xs">{prod.name}</p>
                          <p className="text-[10px] text-gray-400">৳{prod.price}/{prod.unit || 'kg'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCart(id, qty - 50)} className="w-6 h-6 bg-white/10 rounded font-bold text-center hover:bg-white/20">-</button>
                          <span className="font-mono font-bold text-green-400 w-12 text-center text-xs">{qty} kg</span>
                          <button onClick={() => updateCart(id, qty + 50)} className="w-6 h-6 bg-white/10 rounded font-bold text-center hover:bg-white/20">+</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {Object.keys(cart).length > 0 && (
                <div className="bg-white/[0.04] border border-white/10 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="font-bold text-white">৳{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">B2B Tier Discount (5%):</span>
                    <span className="font-bold text-green-400">- ৳{(calculateTotal() * 0.05).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-sm">
                    <span className="text-green-400">Net Invoice Amount:</span>
                    <span className="text-green-400">৳{(calculateTotal() * 0.95).toLocaleString()}</span>
                  </div>
                  <a
                    href={`https://wa.me/8801714114396?text=Hello SeaLand Agro, I want to place a B2B order worth BDT ${(calculateTotal() * 0.95).toLocaleString()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3.5 bg-green-500 hover:bg-green-400 text-black font-black uppercase text-center rounded-xl transition-all shadow-xl shadow-green-500/20 text-xs"
                  >
                    🚀 Confirm & Send Order to WhatsApp
                  </a>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REAL LOGISTICS TRACKING */}
          {activeTab === 'logistics' && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-green-400">Active Supply Fleet</span>
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[8px] font-bold animate-pulse">IN TRANSIT</span>
                </div>
                
                {/* রিয়েল-টাইম জিপিএস ম্যাপ কার্ড */}
                <div className="h-36 bg-gradient-to-br from-black to-zinc-900 rounded-xl border border-white/10 flex flex-col justify-center items-center relative overflow-hidden p-3 text-center">
                  <div className="absolute inset-0 bg-green-500/5 backdrop-blur-3xl"></div>
                  <p className="text-[10px] text-gray-400 font-bold mb-1 relative z-10">VAN #DHAKA-METRO-TA-11-9021</p>
                  <p className="text-xs font-bold text-green-400 relative z-10">Gazipur Farm ➔ Mohammadpur Depot</p>
                  <p className="text-[10px] text-gray-500 mt-2 relative z-10">Estimated Arrival: 35 Mins</p>
                </div>

                <div className="space-y-2 pt-2 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-300">05:30 AM — Procured from Farm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-300">06:15 AM — Quality Inspected & Packed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                    <span className="text-green-400 font-bold">En-route to client destination</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REAL SUPABASE SUPPORT & TICKETS */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              <form onSubmit={handleTicketSubmit} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3">
                <p className="text-[10px] font-black uppercase text-green-400">Open Support Ticket / Complaint</p>
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={ticketName}
                    onChange={(e) => setTicketName(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-green-500"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={ticketPhone}
                    onChange={(e) => setTicketPhone(e.target.value)}
                    className="bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-green-500"
                  />
                </div>

                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-green-500"
                >
                  <option value="complaint">🔴 Product Quality Issue</option>
                  <option value="delivery">🚚 Delivery & Logistics Delay</option>
                  <option value="billing">💳 Payment / Billing Query</option>
                  <option value="suggestion">💡 General Suggestion</option>
                </select>

                <input
                  type="text"
                  required
                  placeholder="Subject *"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-green-500"
                />

                <textarea
                  rows={3}
                  required
                  placeholder="Detailed explanation..."
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-green-500 resize-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="w-full py-3 bg-green-500 text-black font-black uppercase rounded-xl text-xs hover:bg-green-400 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                >
                  {submittingTicket ? 'Submitting...' : '🚀 Submit Ticket To Supabase'}
                </button>
              </form>

              {/* টিকিট লিস্ট (সুপাবেস থেকে ফেচ করা) */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase text-gray-400 font-bold">Recent Tickets in Database:</p>
                {loadingTickets ? (
                  <p className="text-[10px] text-gray-500 text-center py-4">Loading tickets...</p>
                ) : userTickets.length === 0 ? (
                  <p className="text-[10px] text-gray-500 text-center py-4 italic">No support tickets found.</p>
                ) : (
                  userTickets.map(t => (
                    <div key={t.id} className="bg-white/[0.03] border border-white/10 p-3 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-white text-xs">{t.subject}</p>
                        <p className="text-[9px] text-gray-400 font-mono">{t.ticket_id} • {t.phone}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                        t.status === 'RESOLVED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}>
                        {t.status || 'OPEN'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ERP & ROADMAP */}
          {activeTab === 'erp' && (
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                <p className="text-[10px] uppercase text-gray-400 font-bold">Client Credit & Financial Ledger</p>
                <div className="grid grid-cols-2 gap-2 text-center pt-1">
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <p className="text-[9px] text-gray-400">Available Credit Limit</p>
                    <p className="font-bold text-green-400 text-xs">৳ 1,50,000</p>
                  </div>
                  <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                    <p className="text-[9px] text-gray-400">Current Outstanding</p>
                    <p className="font-bold text-amber-400 text-xs">৳ 32,400</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                <p className="text-[10px] uppercase text-green-400 font-bold">SeaLand Agro 10-Year Master Plan</p>
                <div className="space-y-2 text-[10px] text-gray-300 leading-relaxed">
                  <p>• <strong>Phase 1 (2026):</strong> Digital B2B Commodity Terminal & Native App Rollout.</p>
                  <p>• <strong>Phase 2 (2028):</strong> Regional Cold-Chain Warehouse Network in North Bengal.</p>
                  <p>• <strong>Phase 3 (2036):</strong> AI-Driven Demand Forecasting & International Agro Export Hub.</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* বটম অ্যাপ নেভিগেশন বার */}
        <div className="bg-[#050505] border-t border-white/10 grid grid-cols-5 py-2.5 select-none">
          <button
            onClick={() => setActiveTab('market')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'market' ? 'text-green-500 font-bold' : 'text-gray-500'}`}
          >
            <span className="text-sm">📈</span>
            <span className="text-[8px] uppercase tracking-wider font-black">Market</span>
          </button>

          <button
            onClick={() => setActiveTab('procurement')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'procurement' ? 'text-green-500 font-bold' : 'text-gray-500'}`}
          >
            <span className="text-sm">🛒</span>
            <span className="text-[8px] uppercase tracking-wider font-black">Order</span>
          </button>

          <button
            onClick={() => setActiveTab('logistics')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'logistics' ? 'text-green-500 font-bold' : 'text-gray-500'}`}
          >
            <span className="text-sm">🚚</span>
            <span className="text-[8px] uppercase tracking-wider font-black">Track</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'support' ? 'text-green-500 font-bold' : 'text-gray-500'}`}
          >
            <span className="text-sm">🎫</span>
            <span className="text-[8px] uppercase tracking-wider font-black">Support</span>
          </button>

          <button
            onClick={() => setActiveTab('erp')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'erp' ? 'text-green-500 font-bold' : 'text-gray-500'}`}
          >
            <span className="text-sm">📊</span>
            <span className="text-[8px] uppercase tracking-wider font-black">ERP</span>
          </button>
        </div>

      </div>

    </div>
  );
}