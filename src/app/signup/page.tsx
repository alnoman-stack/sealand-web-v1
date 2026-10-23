'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // বিটুবি পেজ থেকে ইমেইল পাস করলে সেটি অটো ফিল হয়ে যাবে
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      // ১. সিকিউরিটি চেক: এই ইমেইল দিয়ে B2B Request পাঠানো হয়েছে কিনা যাচাই করা
      const { data: b2bCheck, error: checkError } = await supabase
        .from('b2b_requests')
        .select('email, status')
        .eq('email', email)
        .maybeSingle();

      if (checkError || !b2bCheck) {
        setMsg({ 
          type: 'error', 
          text: 'দুঃখিত! অ্যাকাউন্ট তৈরির আগে আপনাকে অবশ্যই B2B Request পাঠাতে হবে।' 
        });
        setLoading(false);
        // ৩ সেকেন্ড পর বিটুবি পেজে রিডাইরেক্ট করে দেওয়া
        setTimeout(() => router.push('/b2b'), 2500);
        return;
      }

      // ২. যদি রিকোয়েস্ট থাকে, তবে সুপাবেস অথ সাইন আপ সম্পন্ন করা
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      });

      if (error) throw error;

      setMsg({ type: 'success', text: 'Account created successfully! Redirecting to login...' });
      setTimeout(() => router.push('/login'), 2000);

    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-gray-200/60 max-w-md w-full border border-gray-100">
        
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-[2rem] blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative bg-white px-6 py-4 rounded-[1.8rem] border border-gray-100 shadow-xl flex items-center justify-center">
                 <img src="icon.png" alt="SeaLand Agro Logo" className="h-16 md:h-20 w-auto object-contain" />
              </div>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mt-6 mb-2 uppercase tracking-tight">Create Account</h1>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">B2B Partner Verification Required</p>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-2xl text-[10px] mb-6 font-black uppercase border flex items-center gap-2 ${msg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
            <span className={`w-2 h-2 rounded-full ${msg.type === 'error' ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-2 tracking-widest">Business Email Address</label>
            <input 
              type="email" required placeholder="business@company.com" 
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm font-medium shadow-inner"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 ml-2 tracking-widest">Password</label>
            <input 
              type="password" required placeholder="•••••••• (Min 6 chars)" 
              className="w-full p-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 transition-all outline-none text-sm font-medium shadow-inner"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl mt-4 disabled:bg-gray-300"
          >
            {loading ? 'Verifying Request...' : 'Sign Up Now'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6 space-y-3">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Already have an account? <Link href="/login" className="text-green-600 font-black ml-1 hover:underline">Login</Link>
          </p>
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Business Partner হতে চান? <Link href="/b2b" className="text-gray-900 font-black ml-1 hover:underline">B2B Request পাঠান</Link>
          </p>
        </div>
      </div>
    </div>
  );
}