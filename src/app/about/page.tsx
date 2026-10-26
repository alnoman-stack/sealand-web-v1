'use client';
import React from 'react';
import Link from 'next/link';

export default function AboutVisionPage() {
  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans flex flex-col justify-between relative pt-20">
      
      {/* ব্যাকগ্রাউন্ড ড্যাশবোর্ড থিমড গ্লো ইফেক্টস */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-green-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* 📌 ১০০% ফিক্সড নেভিগেশন হেডার (Fixed Position Active) */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#080808]/95 backdrop-blur-2xl px-6 py-4 shadow-2xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-white/20 to-white/5 p-2 rounded-2xl border border-white/20 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
              <img src="/icon.png" alt="SeaLand Logo" className="h-7 w-auto object-contain drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]" />
            </div>
            <span className="text-white font-black text-sm uppercase tracking-tight">
              SEALAND <span className="text-green-500 italic">AGRO</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/market-feed">
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                📈 Market Feed
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="px-4 py-2 bg-green-500 hover:bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg">
                📊 ERP Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* মেইন কনটেন্ট সেকশন */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16 relative z-10 flex-1">
        
        {/* HERO TITLE */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 text-green-400 rounded-full text-[10px] font-mono font-bold tracking-widest border border-green-500/20 uppercase">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            About SeaLand Agro & Strategic Master Plan
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight italic leading-tight">
            A Commitment To <span className="text-green-500">Freshness & Technology</span>
          </h1>
          
          <p className="text-xs md:text-sm text-gray-400 font-mono leading-relaxed">
            কৃষিভিত্তিক সাপ্লাই চেইনকে আধুনিকীকরণ, গ্লোবাল এক্সপোর্ট-ইমপোর্ট এবং B2B বাণিজ্যিক প্রতিষ্ঠানগুলোর জন্য টেকসই ও স্বচ্ছ সরবরাহ নিশ্চিত করাই আমাদের লক্ষ্য।
          </p>
        </div>

        {/* 3 CORE BLOCKS: VISION, MISSION, WHY SEALAND */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* BLOCK 1: OUR VISION */}
          <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-green-500/40 p-8 rounded-[2.5rem] space-y-5 transition-all duration-300 group backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-2xl font-bold">
                🎯
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-green-400 transition-colors">
                Our Vision
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                To establish SeaLand Agro as a globally recognized symbol of uncompromised purity, delivering fresh, chemical-free, and traceable produce from sustainable local origins to consumer tables across the world[cite: 1].
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-green-500 font-bold tracking-widest uppercase">
              // 10-Year Global Mandate
            </div>
          </div>

          {/* BLOCK 2: OUR MISSION */}
          <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-green-500/40 p-8 rounded-[2.5rem] space-y-5 transition-all duration-300 group backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-2xl font-bold">
                🚀
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-green-400 transition-colors">
                Our Mission
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-mono">
                হোটেল, রেস্টুরেন্ট, সুপারশপ এবং B2B কাস্টমারদের জন্য ১০০% ফ্রেশ শাকসবজি, মাছ ও পোল্ট্রি পণ্যের নিরবচ্ছিন্ন সরবরাহ নিশ্চিত করা। রিয়েল-টাইম মার্কেট রেট ও অটোমেটেড ERP সিস্টেমের মাধ্যমে প্রকিউরমেন্টকে দ্রুত ও সহজ করা।
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-green-500 font-bold tracking-widest uppercase">
              // Operational Excellence
            </div>
          </div>

          {/* BLOCK 3: WHY SEALAND AGRO? */}
          <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-green-500/40 p-8 rounded-[2.5rem] space-y-5 transition-all duration-300 group backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-2xl font-bold">
                💎
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-white group-hover:text-green-400 transition-colors">
                Why SeaLand Agro?
              </h3>
              <ul className="text-xs text-gray-400 space-y-2.5 font-mono">
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> রিয়েল-টাইম পাইকারি দর ও স্টক ভিজিবিলিটি
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> গ্রেড-এ প্রিমিয়াম কোয়ালিটি কন্ট্রোল
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> অটোমেটেড B2B ইনভয়েসিং ও ERP সুবিধা
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">✓</span> ক্রস-বর্ডার এক্সপোর্ট-আমপোর্ট কমপ্লায়েন্স
                </li>
              </ul>
            </div>
            <div className="pt-4 border-t border-white/5 text-[9px] font-mono text-green-500 font-bold tracking-widest uppercase">
              // B2B & Global Advantage
            </div>
          </div>

        </div>

        {/* 4 STRATEGIC PILLARS SECTION */}
        <div className="bg-gradient-to-r from-white/[0.03] to-white/[0.01] border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 backdrop-blur-2xl">
          <div className="text-center space-y-2">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic text-green-400">
              4 Strategic Execution Pillars (2026-2036)
            </h3>
            <p className="text-xs text-gray-400 font-mono">এগ্রো সাপ্লাই চেইনকে বিশ্বমানের করতে আমাদের দীর্ঘমেয়াদী কৌশলগত পদক্ষেপসমূহ</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-2">
              <span className="text-green-400 font-mono text-xs font-bold">01. B2B FOUNDATION</span>
              <p className="text-xs text-gray-300 font-mono">রিসোর্ট, হোটেল ও হাসপাতালের সাথে এন্টারপ্রাইজ সাপ্লাই কন্ট্রাক্টের মাধ্যমে স্থিতিশীল ক্যাশ-ফ্লো নিশ্চিতকরণ[cite: 1] ।</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-2">
              <span className="text-green-400 font-mono text-xs font-bold">02. B2C INTEGRATION</span>
              <p className="text-xs text-gray-300 font-mono">হাই-মার্জিন রিটেইল ডিস্ট্রিবিউশন এবং সরাসরি কনজুমার সাবস্ক্রিপশন অপারেশন সম্প্রসারণ[cite: 1] ।</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-2">
              <span className="text-green-400 font-mono text-xs font-bold">03. GLOBAL TRADE</span>
              <p className="text-xs text-gray-300 font-mono">আন্তর্জাতিক এক্সপোর্ট-আমপোর্ট কমপ্লায়েন্স, হেসপ/আইএসও এবং ক্রস-বর্ডার ডিস্ট্রিবিউশন[cite: 1] ।</p>
            </div>
            <div className="bg-black/40 border border-white/5 p-6 rounded-2xl space-y-2">
              <span className="text-green-400 font-mono text-xs font-bold">04. BACKWARD AGRI</span>
              <p className="text-xs text-gray-300 font-mono">বাংলাদেশে নিজস্ব খামার প্রতিষ্ঠার মাধ্যমে ভার্টিক্যাল ইন্টিগ্রেশন ও শতভাগ কোয়ালিটি কন্ট্রোল[cite: 1] ।</p>
            </div>
          </div>
        </div>

        {/* 10-YEAR HORIZON TIMELINE */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-12 space-y-6 backdrop-blur-2xl">
          <div className="text-center space-y-2">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight italic text-green-400">
              10-Year Global Vision Horizon
            </h3>
            <p className="text-xs text-gray-400 font-mono">পরিকল্পিত ধাপে ধাপে বৈশ্বিক বাজারে রূপান্তর</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl space-y-3">
              <span className="text-[10px] font-mono font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-md">Years 1-2</span>
              <h4 className="text-sm font-black uppercase">Foundation & Cross-Border Launch</h4>
              <p className="text-xs text-gray-400 font-mono">B2B + B2C + Export/Import Active + Commercial Farming Setup[cite: 2] .</p>
            </div>
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl space-y-3">
              <span className="text-[10px] font-mono font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-md">Years 3-5</span>
              <h4 className="text-sm font-black uppercase">Regional Dominance & Agritech</h4>
              <p className="text-xs text-gray-400 font-mono">Large-scale contract farming across Bangladesh; exporting to Middle East & Southeast Asia[cite: 2] .</p>
            </div>
            <div className="bg-black/40 border border-white/10 p-6 rounded-2xl space-y-3">
              <span className="text-[10px] font-mono font-bold text-green-500 bg-green-500/10 px-2.5 py-1 rounded-md">Years 6-10</span>
              <h4 className="text-sm font-black uppercase">Global Brand & Worldwide Distribution</h4>
              <p className="text-xs text-gray-400 font-mono">SeaLand Agro premium outlets established across North America, Europe & Asia[cite: 2] .</p>
            </div>
          </div>
        </div>

        {/* BOTTOM STATS / TRUST BANNER */}
        <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row justify-around items-center gap-6 text-center backdrop-blur-2xl">
          <div className="space-y-1">
            <h4 className="text-2xl md:text-3xl font-black italic text-green-400">Direct Farm-to-Global</h4>
            <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Transparent Supply Chain</p>
          </div>
          <div className="w-full md:w-px h-px md:h-10 bg-white/10"></div>
          <div className="space-y-1">
            <h4 className="text-xl md:text-2xl font-black italic text-green-400">Abdullah Al Noman</h4>
            <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Managing Director & Founder[cite: 1]</p>
          </div>
        </div>

      </main>

      {/* ফুটার */}
      <footer className="border-t border-white/10 py-6 text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-[#050505]">
        © {new Date().getFullYear()} SeaLand Agro. All Rights Reserved.
      </footer>

    </div>
  );
}