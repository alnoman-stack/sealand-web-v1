'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/sections/Navbar';
import { createClient } from '@supabase/supabase-js';

// Supabase Client Config (প্রয়োজনীয় Env Vars থাকলে ব্যবহার করবে, নাহলে ডেমো হিসেবে সাবমিট করবে)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseAnonKey) ? createClient(supabaseUrl, supabaseAnonKey) : null;

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    company: '',
    type: 'complaint', // complaint, suggestion, billing, inquiry
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const ticketNumber = `TICK-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      if (supabase) {
        const { error } = await supabase.from('support_tickets').insert([
          {
            ticket_id: ticketNumber,
            client_name: formData.name,
            phone: formData.phone,
            company_name: formData.company,
            ticket_type: formData.type,
            subject: formData.subject,
            message: formData.message,
            status: 'OPEN'
          }
        ]);

        if (error) throw error;
      } else {
        // ডেমো সাবমিশন সিমুলেশন (সুপাবেস কানেক্ট না থাকলেও ইউজার রেসপন্স পাবে)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setSubmittedTicket(ticketNumber);
      setFormData({
        name: '',
        phone: '',
        company: '',
        type: 'complaint',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Error submitting ticket:', err);
      alert('টিকেট সাবমিট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন বা হোয়াটসঅ্যাপে যোগাযোগ করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans flex flex-col justify-between overflow-x-hidden relative">
      <Navbar />

      {/* ব্যাকগ্রাউন্ড গ্লো */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <main className="max-w-6xl mx-auto px-4 py-12 sm:py-16 space-y-12 relative z-10 flex-1">
        
        {/* টপ ব্যাক লিংক */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold uppercase tracking-widest text-gray-300 hover:bg-white/10 transition-all"
          >
            ← Back To Home
          </Link>
        </div>

        {/* হেডার */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-mono font-bold tracking-widest border border-green-500/20 uppercase">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            24/7 Enterprise Support
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight italic">
            Support, Complaint <span className="text-green-500">& Suggestions</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono leading-relaxed">
            হোটেল, রেস্টুরেন্ট বা B2B অর্ডারের যেকোনো পরামর্শ, লজিস্টিকস কিংবা কোয়ালিটি সংক্রান্ত অভিযোগের জন্য নিচের ফর্মে টিকিটিং ওপেন করুন। আমাদের টিম দ্রুত সমাধান প্রদান করবে।
          </p>
        </div>

        {/* কুইক কন্টাক্ট কার্ড ও হোয়াটসঅ্যাপ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-xl font-bold">
              📞
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Direct Hotline / WhatsApp</p>
              <p className="text-sm font-mono font-black text-white">+880 1714-114396</p>
            </div>
          </div>

          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-xl font-bold">
              📍
            </div>
            <div>
              <p className="text-[10px] uppercase font-mono tracking-widest text-gray-400">Headquarters</p>
              <p className="text-xs text-gray-300 font-mono">Nobinagar, Mohammadpur, Dhaka</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 p-6 rounded-3xl backdrop-blur-xl flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-mono tracking-widest text-green-400 font-bold">Instant Support</p>
              <p className="text-xs text-gray-300 font-mono">Average reply: &lt; 5 Mins</p>
            </div>
            <a
              href="https://wa.me/8801714114396"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
            >
              💬 Chat
            </a>
          </div>
        </div>

        {/* কমপ্লেন ও পরামর্শ টিকিট ফর্ম সেকশন */}
        <div className="bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/10 rounded-[2.5rem] p-6 sm:p-10 backdrop-blur-2xl relative shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-6">
            
            <div className="text-center space-y-2 border-b border-white/10 pb-6">
              <h2 className="text-2xl font-black uppercase italic text-green-400">Submit a Ticket / Complaint</h2>
              <p className="text-xs text-gray-400 font-mono">
                আপনার সমস্যা জমা দিলে একটি ইউনিক টিকিট নম্বর জেনারেট হবে এবং এডমিন প্যানেলে তা তাৎক্ষণিক আপডেট হয়ে যাবে।
              </p>
            </div>

            {submittedTicket ? (
              <div className="bg-green-500/10 border border-green-500/30 p-8 rounded-3xl text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 text-3xl font-bold rounded-full flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h3 className="text-xl font-black uppercase text-green-400">Ticket Submitted Successfully!</h3>
                <p className="text-xs text-gray-300 font-mono">
                  আপনার টিকিট আইডি: <span className="text-green-400 font-bold underline">{submittedTicket}</span>
                </p>
                <p className="text-[11px] text-gray-400 font-mono">
                  আমাদের সাপোর্ট টিম আপনার সাথে যোগাযোগ করবে। জরুরী প্রয়োজনে টিকিট আইডি উল্লেখ করে হোয়াটসঅ্যাপ করুন।
                </p>
                <button
                  onClick={() => setSubmittedTicket(null)}
                  className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-xs font-mono uppercase font-bold tracking-widest rounded-xl transition-all"
                >
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-wider text-[10px]">Your Name / নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abdullah Al Noman"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 focus:border-green-500 rounded-xl px-4 py-3 text-white outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-wider text-[10px]">Phone Number / মোবাইল *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 17XXXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 focus:border-green-500 rounded-xl px-4 py-3 text-white outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-wider text-[10px]">Company / Business Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Chuti Resort / Ocean Breeze Cafe"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 focus:border-green-500 rounded-xl px-4 py-3 text-white outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-gray-400 uppercase tracking-wider text-[10px]">Category / বিষয় *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-black border border-white/10 focus:border-green-500 rounded-xl px-4 py-3 text-white outline-none transition-all"
                    >
                      <option value="complaint">🔴 Product Quality / Freshness Issue</option>
                      <option value="delivery">🚚 Delivery & Logistics Delay</option>
                      <option value="billing">💳 Payment & Invoice Query</option>
                      <option value="suggestion">💡 Service Suggestion / Feedback</option>
                      <option value="inquiry">📦 B2B Bulk Order Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider text-[10px]">Subject / সংক্ষেপে বিষয় *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Received damaged fish package on morning delivery"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 focus:border-green-500 rounded-xl px-4 py-3 text-white outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-400 uppercase tracking-wider text-[10px]">Detailed Message / বিস্তারিত বিবরণ *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="আপনার সমস্যা বা পরামর্শের বিস্তারিত বিবরণ লিখুন..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 focus:border-green-500 rounded-xl px-4 py-3 text-white outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-green-500 hover:bg-green-400 text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Submitting Ticket...' : '🚀 Submit Ticket To Admin'}
                </button>

              </form>
            )}

          </div>
        </div>

      </main>

      {/* ফুটার */}
      <footer className="border-t border-white/10 py-6 text-center text-[10px] font-mono text-gray-500 uppercase tracking-widest bg-[#050505]">
        © {new Date().getFullYear()} SeaLand Agro. All Rights Reserved Managed By SEALAND VAULT.
      </footer>
    </div>
  );
}