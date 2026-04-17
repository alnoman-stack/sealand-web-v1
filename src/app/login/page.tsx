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

    // ১. Supabase Auth দিয়ে সাইন ইন
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg('দুঃখিত, ইমেইল বা পাসওয়ার্ডটি সঠিক নয়।');
      setLoading(false);
      return;
    }

    // ২. সেশন রিফ্রেশ করে হোমপেজে পাঠানো
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 max-w-md w-full border border-gray-100">
        
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-block bg-white p-2 rounded-xl border border-gray-100 mb-4 shadow-sm">
               <img src="/final.png" alt="SeaLand Logo" className="h-10 w-auto" />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight uppercase">Welcome Back</h1>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Partner Portal Access</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[10px] mb-6 font-black uppercase border border-red-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-2 tracking-widest">Email Address</label>
            <input 
              type="email" required placeholder="business@company.com" 
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm font-medium"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-2 tracking-widest">Password</label>
            <input 
              type="password" required placeholder="••••••••" 
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm font-medium"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl mt-4 disabled:bg-gray-300"
          >
            {loading ? 'Verifying...' : 'Secure Sign In'}
          </button>
        </form>

        {/* --- অ্যাকাউন্ট নেই এবং সাইন আপ লিঙ্ক সেকশন --- */}
        <div className="mt-8 text-center border-t border-gray-50 pt-8 space-y-3">
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            SeaLand-এ নতুন? 
            <Link href="/signup" className="text-green-600 font-black ml-2 hover:underline tracking-tighter">
               Create New Account
            </Link>
          </p>
          
          <div className="flex items-center justify-center gap-2">
            <div className="h-px bg-gray-100 w-10"></div>
            <span className="text-[9px] text-gray-300 font-black uppercase">OR</span>
            <div className="h-px bg-gray-100 w-10"></div>
          </div>

          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
            Business Partner হতে চান? 
            <Link href="/b2b" className="text-gray-900 font-black ml-2 hover:underline tracking-tighter">
               B2B Request পাঠান
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}