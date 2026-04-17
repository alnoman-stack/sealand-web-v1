'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });

    if (error) {
      setMsg({ type: 'error', text: error.message });
    } else {
      setMsg({ type: 'success', text: 'Registration successful! You can now login.' });
      setTimeout(() => router.push('/login'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">Create Account</h1>
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">Join SeaLand Agro Network</p>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-2xl text-[10px] mb-6 font-black uppercase border ${msg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <input 
            type="email" required placeholder="Email Address" 
            className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 outline-none"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" required placeholder="Password (Min 6 chars)" 
            className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 outline-none"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-green-600 disabled:bg-gray-300"
          >
            {loading ? 'Creating Account...' : 'Sign Up Now'}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] font-black uppercase text-gray-400 tracking-widest">
          Already have an account? <Link href="/login" className="text-green-600 ml-1 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}