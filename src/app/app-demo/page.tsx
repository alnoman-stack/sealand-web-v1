'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Package, ShoppingCart, BarChart3, Globe, 
  Search, Bell, ShieldCheck, ChevronRight, RefreshCw, Send, CheckCircle2, 
  Truck, Layers, ArrowUpRight, Award, Filter, Sparkles, PhoneCall, Building2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('market');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(100);
  const [toastMessage, setToastMessage] = useState('');
  const [activeRoadmapPhase, setActiveRoadmapPhase] = useState(1);

  // Commodity Items
  const commodities = [
    { id: 1, name: 'Grade-A Roma Tomatoes', category: 'Fresh Produce', price: 45, unit: 'kg', change: +4.2, stock: '12,500 kg', supplier: 'Bogura Hub', grade: 'Grade A+' },
    { id: 2, name: 'Fresh Water Rui Fish (3kg+)', category: 'Fish & Seafood', price: 340, unit: 'kg', change: -1.8, stock: '4,200 kg', supplier: 'Jessore Enclosure', grade: 'Export Grade' },
    { id: 3, name: 'Broiler Chicken (Dressed)', category: 'Poultry', price: 185, unit: 'kg', change: +0.5, stock: '8,000 kg', supplier: 'Gazipur Farm', grade: 'HACCP Cert' },
    { id: 4, name: 'Najirshail Fine Rice', category: 'Grains', price: 78, unit: 'kg', change: 0.0, stock: '45,000 kg', supplier: 'Dinajpur Mill', grade: 'Premium' },
    { id: 5, name: 'Organic Red Onions', category: 'Fresh Produce', price: 62, unit: 'kg', change: +8.5, stock: '18,200 kg', supplier: 'Pabna Depot', grade: 'Grade A' },
    { id: 6, name: 'Black Tiger Shrimp (20/30)', category: 'Fish & Seafood', price: 920, unit: 'kg', change: +2.1, stock: '1,800 kg', supplier: 'Satkhira Agro', grade: 'IQF Export' },
  ];

  // Active B2B Procurement Orders
  const b2bOrders = [
    { id: 'ORD-8921', client: 'Chuti Resort Gazipur', items: 'Tomatoes (200kg), Rui Fish (150kg)', total: 57000, status: 'In Transit', ETA: '11:40 AM Today', driver: 'Kabir Hossain (Dhaka-Metro-M-12)' },
    { id: 'ORD-8918', client: 'Bhawal Resort & Spa', items: 'Dressed Chicken (300kg)', total: 55500, status: 'Delivered', ETA: 'Completed 08:30 AM', driver: 'Sumon Mia (Dhaka-Metro-N-44)' },
    { id: 'ORD-8924', client: 'Oceanic Hotel Cox’s Bazar', items: 'Black Tiger Shrimp (100kg)', total: 92000, status: 'Processing', ETA: 'Tomorrow 07:00 AM', driver: 'Assigned to Depot-3' },
  ];

  // Roadmap Data
  const roadmapPhases = [
    {
      phase: 1,
      years: '2026 - 2027',
      title: 'B2B Foundation & Core Logistics',
      description: 'Stabilizing supply lines for major resorts, hotels, and corporate cafeterias. Launching automated ERP & instant quote terminal.',
      milestones: ['50+ Enterprise Hotel Contracts', 'Gazipur & Bogura Cold Hubs Active', 'Automated B2B Quoting Engine']
    },
    {
      phase: 2,
      years: '2028 - 2029',
      title: 'B2C Integration & Retail Outlets',
      description: 'High-margin direct consumer subscription box model and premium flagship agro-fresh outlets in Dhaka and Chittagong.',
      milestones: ['100,000 Household Subscriptions', '15 Tech-Enabled Physical Outlets', 'IoT Cold-Chain Fleet']
    },
    {
      phase: 3,
      years: '2030 - 2032',
      title: 'Global Export & Regional Trade',
      description: 'Cross-border export compliance (HACCP/ISO). Exporting premium Bangladeshi aquaculture and fresh produce to GCC & ASEAN.',
      milestones: ['GCC Trade Hubs in Dubai & Qatar', 'Global ISO-22000 Certification', '$15M+ Annual Export Volume']
    },
    {
      phase: 4,
      years: '2033 - 2036',
      title: 'Backward Agro Integration',
      description: 'Establishing SeaLand owned high-tech hi-density smart farms, vertical greenhouses, and hatcheries across Bangladesh.',
      milestones: ['500+ Acres Hi-Tech Farming', 'Zero-Chemical Guarantee Pipeline', '100% Traceability From Seed to Export']
    }
  ];

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredCommodities = commodities.filter(c => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center p-3 sm:p-6 font-sans">
      
      {/* Top Demo Header Banner */}
      <header className="max-w-md w-full mb-4 text-center space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Interactive Mobile Terminal Demo
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight italic">
          SeaLand <span className="text-emerald-500">Agro</span> Mobile
        </h1>
        <p className="text-xs text-gray-400 font-mono">Enterprise B2B Commodity Procurement & Strategic Platform</p>
      </header>

      {/* SMARTPHONE FRAME CONTAINER */}
      <div className="relative w-full max-w-[390px] h-[780px] bg-[#080808] border-4 border-gray-800 rounded-[48px] shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden">
        
        {/* Phone Speaker Notch & Status Bar */}
        <div className="bg-[#080808] pt-3 pb-2 px-6 flex justify-between items-center text-[11px] font-mono text-gray-400 z-30 border-b border-white/5 select-none">
          <span>9:41</span>
          <div className="w-20 h-4 bg-black rounded-full border border-white/10 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-emerald-500/80 rounded-full animate-ping"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <div className="w-4 h-2.5 border border-gray-400 rounded-sm p-0.5 flex">
              <div className="h-full w-full bg-emerald-400 rounded-xs"></div>
            </div>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-12 left-4 right-4 z-50 bg-emerald-500 text-black font-bold text-xs p-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* SCREEN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto px-4 pt-3 pb-24 scrollbar-none relative">
          
          {/* TAB 1: LIVE COMMODITY MARKET FEED */}
          {activeTab === 'market' && (
            <div className="space-y-4">
              
              {/* Header Info */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-1.5">
                    Market Feed <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </h2>
                  <p className="text-[10px] text-gray-400 font-mono">Live B2B Wholesale Ticker (Dhaka & Bogura)</p>
                </div>
                <button 
                  onClick={() => triggerToast('Refreshing live prices from wholesale mandis...')}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-emerald-400 active:scale-95 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search Tomatoes, Rui Fish, Rice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Category Chips */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {['All', 'Fresh Produce', 'Fish & Seafood', 'Poultry', 'Grains'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-mono whitespace-nowrap transition-all border ${
                      selectedCategory === cat 
                        ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-lg shadow-emerald-500/20' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Commodities List */}
              <div className="space-y-2.5">
                {filteredCommodities.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => setSelectedProduct(item)}
                    className="bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition active:scale-[0.98]"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{item.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 font-mono">{item.grade}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                        <span>{item.supplier}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">Avail: {item.stock}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black font-mono text-emerald-400">
                        ৳{item.price}<span className="text-[10px] text-gray-400 font-normal">/{item.unit}</span>
                      </div>
                      <div className={`text-[10px] font-mono font-bold flex items-center justify-end gap-0.5 ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {item.change >= 0 ? `+${item.change}%` : `${item.change}%`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order / Quick Quote Drawer Simulation */}
              {selectedProduct && (
                <div className="mt-4 p-4 bg-gradient-to-br from-emerald-950/40 to-black border border-emerald-500/30 rounded-3xl space-y-3 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold">Quick Procurement Drawer</span>
                      <h3 className="text-sm font-bold">{selectedProduct.name}</h3>
                    </div>
                    <button 
                      onClick={() => setSelectedProduct(null)} 
                      className="text-gray-400 hover:text-white text-xs font-bold px-2 py-0.5 bg-white/10 rounded-full"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-black/60 p-2.5 rounded-xl border border-white/10 font-mono text-xs">
                    <span className="text-gray-400">Order Vol (KG):</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setOrderQuantity(Math.max(50, orderQuantity - 50))}
                        className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-bold text-emerald-400"
                      >-</button>
                      <span className="font-bold text-white">{orderQuantity}</span>
                      <button 
                        onClick={() => setOrderQuantity(orderQuantity + 50)}
                        className="w-6 h-6 bg-white/10 rounded flex items-center justify-center font-bold text-emerald-400"
                      >+</button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono pt-1">
                    <span className="text-gray-400">Estimated Total:</span>
                    <span className="text-sm font-black text-emerald-400">৳{(selectedProduct.price * orderQuantity).toLocaleString()} BDT</span>
                  </div>

                  <button 
                    onClick={() => {
                      triggerToast(`Broadcast Quote for ${orderQuantity}kg ${selectedProduct.name} generated!`);
                      setSelectedProduct(null);
                    }}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Request WhatsApp Quote
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ACTIVE B2B PROCUREMENT ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">Active Deliveries</h2>
                <p className="text-[10px] text-gray-400 font-mono">Real-Time Cold Chain Fleet Dispatch Tracking</p>
              </div>

              <div className="space-y-3">
                {b2bOrders.map((ord) => (
                  <div key={ord.id} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {ord.id}
                        </span>
                        <h3 className="text-xs font-bold text-white mt-1">{ord.client}</h3>
                      </div>
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                        ord.status === 'In Transit' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                        ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-300 font-mono">{ord.items}</p>

                    <div className="pt-2 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-gray-400">
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3 text-emerald-400" />
                        <span>ETA: {ord.ETA}</span>
                      </div>
                      <span className="font-bold text-white">৳{ord.total.toLocaleString()} BDT</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instant WhatsApp Broadcast Call-to-Action */}
              <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-black border border-emerald-500/30 rounded-2xl text-center space-y-2">
                <p className="text-xs font-bold text-white">Need Customized Wholesale Dispatch?</p>
                <p className="text-[10px] text-gray-400 font-mono">Connect directly with ourGazipur Logistics Dispatcher</p>
                <button 
                  onClick={() => triggerToast('Connecting with SeaLand Logistics Terminal...')}
                  className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold rounded-xl transition flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Dispatch Desk
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: ERP COMMODITY ANALYTICS */}
          {activeTab === 'erp' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight">ERP Dashboard</h2>
                <p className="text-[10px] text-gray-400 font-mono">Volume Metrics & Procurement Analytics</p>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-white/[0.03] border border-white/10 p-3 rounded-2xl space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 uppercase">Monthly Volume</span>
                  <div className="text-base font-black font-mono text-emerald-400">142.5 Tons</div>
                  <span className="text-[9px] text-emerald-400 font-mono">+12.4% vs last mo</span>
                </div>
                <div className="bg-white/[0.03] border border-white/10 p-3 rounded-2xl space-y-1">
                  <span className="text-[9px] font-mono text-gray-400 uppercase">B2B Clients</span>
                  <div className="text-base font-black font-mono text-white">38 Active</div>
                  <span className="text-[9px] text-emerald-400 font-mono">4 Hotels pending</span>
                </div>
              </div>

              {/* Simulated Chart Container */}
              <div className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase font-mono">7-Day Supply Volume (Tons)</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Live ERP</span>
                </div>
                
                {/* Bar Chart Bars */}
                <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 border-b border-white/10">
                  {[
                    { day: 'M', val: 65, bg: 'bg-emerald-500/40' },
                    { day: 'T', val: 80, bg: 'bg-emerald-500/60' },
                    { day: 'W', val: 45, bg: 'bg-emerald-500/30' },
                    { day: 'T', val: 95, bg: 'bg-emerald-500' },
                    { day: 'F', val: 75, bg: 'bg-emerald-500/70' },
                    { day: 'S', val: 110, bg: 'bg-emerald-400' },
                    { day: 'S', val: 85, bg: 'bg-emerald-500/60' }
                  ].map((b, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div 
                        className={`w-full ${b.bg} rounded-t-md transition-all duration-500 hover:opacity-80`} 
                        style={{ height: `${b.val}%` }}
                      ></div>
                      <span className="text-[9px] font-mono text-gray-400">{b.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Volatility Alert Box */}
              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-amber-300">Price Stability Buffer Active</h4>
                  <p className="text-[10px] text-gray-300 font-mono">SeaLand price lock protection guarantees rate stability for locked contracts during seasonal spikes.</p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: 10-YEAR STRATEGIC ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-black uppercase tracking-tight italic text-emerald-400">
                  Strategic Horizon
                </h2>
                <p className="text-[10px] text-gray-400 font-mono">10-Year Master Plan (2026 - 2036)</p>
              </div>

              {/* Phase Selector Tabs */}
              <div className="grid grid-cols-4 gap-1 bg-black/60 p-1 rounded-xl border border-white/10 font-mono text-[9px]">
                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    onClick={() => setActiveRoadmapPhase(p)}
                    className={`py-1.5 rounded-lg font-bold transition ${
                      activeRoadmapPhase === p 
                        ? 'bg-emerald-500 text-black shadow' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Phase {p}
                  </button>
                ))}
              </div>

              {/* Active Roadmap Phase Details Card */}
              {(() => {
                const pData = roadmapPhases.find(p => p.phase === activeRoadmapPhase);
                return (
                  <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-emerald-500/30 p-4 rounded-3xl space-y-3 relative overflow-hidden">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {pData.years}
                      </span>
                      <span className="text-[9px] font-mono text-gray-500 uppercase">Phase 0{pData.phase} / 04</span>
                    </div>

                    <h3 className="text-sm font-black uppercase tracking-tight text-white">{pData.title}</h3>
                    <p className="text-xs text-gray-300 font-mono leading-relaxed">{pData.description}</p>

                    <div className="space-y-1.5 pt-2 border-t border-white/10">
                      <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold">Key Deliverables:</span>
                      {pData.milestones.map((m, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-gray-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl text-center">
                <p className="text-[10px] font-mono text-gray-400">
                  Founder & MD: <span className="text-white font-bold">Abdullah Al Noman</span>
                </p>
              </div>

            </div>
          )}

        </div>

        {/* FLOATING BOTTOM NAVIGATION BAR */}
        <div className="absolute bottom-3 left-4 right-4 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex justify-around items-center z-40 shadow-2xl">
          {[
            { id: 'market', label: 'Market', icon: ShoppingCart },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'erp', label: 'ERP Analytics', icon: BarChart3 },
            { id: 'roadmap', label: 'Roadmap', icon: Globe }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'text-emerald-400 bg-emerald-500/10 font-bold scale-105 border border-emerald-500/20' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[9px] font-mono tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-600 rounded-full opacity-40"></div>

      </div>

    </div>
  );
}