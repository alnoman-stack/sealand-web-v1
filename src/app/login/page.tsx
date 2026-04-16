'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('দুঃখিত, ইমেইল বা পাসওয়ার্ডটি সঠিক নয়। অনুগ্রহ করে আবার যাচাই করুন।');
      setLoading(false);
    } else {
      // লগইন সফল হলে সরাসরি হোমপেজে রিডাইরেক্ট করবে
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 max-w-md w-full border border-gray-100">
        
        {/* লোগো সেকশন */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-block bg-white p-2 rounded-xl border border-gray-100 mb-4 shadow-sm">
               <img src="/final.png" alt="SeaLand Logo" className="h-10 w-auto" />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-gray-400 text-sm font-medium">SeaLand Agro পার্টনার পোর্টালে লগইন করুন</p>
        </div>

        {/* এরর মেসেজ */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs mb-6 font-bold border border-red-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-2 tracking-widest">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="name@company.com" 
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-2 tracking-widest">Password</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 mt-4 disabled:bg-gray-300 disabled:shadow-none"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-50 pt-8">
          <p className="text-gray-400 text-xs font-medium">অ্যাকাউন্ট নেই? 
            <Link href="/b2b" className="text-green-600 font-black ml-1 hover:text-green-700 transition-colors uppercase tracking-tighter">
               B2B পার্টনার রিকোয়েস্ট পাঠান
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}