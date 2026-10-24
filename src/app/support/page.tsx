'use client';
import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/sections/Navbar';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* নেভবার কম্পোনেন্ট */}
      <Navbar />

      {/* মেইন কন্টেন্ট */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        
        {/* ব্যাক টু হোম বাটন */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
            ← Back To Home
          </Link>
        </div>

        {/* হেডার */}
        <div className="text-center mb-16">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-green-600 font-bold block mb-2">
            24/7 Dedicated Support
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-4">
            Support & Contact
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            রিটেইলার, হোটেল বা রেস্তোরাঁর কর্পোরেট বুল অর্ডারের জন্য আমাদের কাস্টমার কেয়ার ও লজিস্টিকস টিম সর্বদা প্রস্তুত আপনার সেবায়।
          </p>
        </div>

        {/* কন্টাক্ট কার্ড */}
        <div className="bg-[#0b6623] text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 mb-20">
          
          <div className="space-y-6 max-w-xl">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black mb-3">আমাদের সাথে যোগাযোগ করুন</h2>
              <p className="text-gray-200 text-xs sm:text-sm">
                আপনি কি কোনো প্রডাক্ট বা সাপ্লাইয়ের পেমেন্ট অথবা প্রোডাক্ট কোয়ালিটি নিয়ে জানতে চাচ্ছেন? আমাদের কাস্টমার কেয়ার প্রতিনিধি টিম প্রস্তুত রয়েছে সহায়তার জন্য।
              </p>
            </div>

            <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-white/10">
              <span className="text-xl">📞</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">Call Us / WhatsApp</p>
                <p className="text-base sm:text-lg font-mono font-bold">+880 1714-114396</p>
              </div>
            </div>

            <div className="flex items-start gap-4 bg-black/20 p-4 rounded-2xl border border-white/10">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">Corporate Headquarters</p>
                <p className="text-xs sm:text-sm text-gray-200 font-medium">House-03, Road-18, Nobinagar Housing, Mohammadpur, Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center bg-white text-black p-6 rounded-3xl shadow-xl w-full md:w-auto text-center">
            <a 
              href="https://wa.me/8801714114396" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-green-500/30 mb-3 flex items-center justify-center gap-2"
            >
              <span>💬</span> WhatsApp Us Now
            </a>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              Average Reply Time: Under 5 Mins
            </p>
          </div>

        </div>

      </div>

      {/* ফুটার */}
      <footer className="bg-black text-white py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img src="/final.png" alt="Logo" className="h-6 w-auto bg-white p-1 rounded" />
              <span className="font-black tracking-tight text-lg">SEALAND <span className="text-green-500">AGRO</span></span>
            </div>
            <p className="text-xs text-gray-400">"A Commitment To Freshness"</p>
          </div>
          <div>
            <h3 className="font-bold uppercase text-xs tracking-widest mb-3 text-green-500">Quick Links</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li><Link href="/" className="hover:text-green-400">Home</Link></li>
              <li><Link href="/b2b" className="hover:text-green-400">B2B Procurement</Link></li>
              <li><Link href="/market-feed" className="hover:text-green-400">Market Feed</Link></li>
              <li><Link href="/support" className="hover:text-green-400">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold uppercase text-xs tracking-widest mb-3 text-green-500">Product Categories</h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>Exotic Vegetables</li>
              <li>Fresh Local Fish</li>
              <li>Seafood Collection</li>
              <li>Organic Products</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold uppercase text-xs tracking-widest mb-3 text-green-500">Follow Us</h3>
            <div className="flex gap-4 text-xs font-bold">
              <span>FB</span>
              <span>LN</span>
              <span>WA</span>
            </div>
          </div>
        </div>
        <div className="text-center text-[10px] text-gray-500 border-t border-white/10 pt-6">
          © 2026 Sealand Agro. All Rights Reserved Managed By SEALAND VAULT.
        </div>
      </footer>
    </div>
  );
}