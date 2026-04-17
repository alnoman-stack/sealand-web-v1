'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function B2BPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  // ১. ইনপুট ডাটা ধরার জন্য স্টেট
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    business_type: 'Resort',
    phone: ''
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please Login first.");
        router.push('/login');
      } else {
        setUserEmail(user.email || null);
      }
    };
    checkUser();
  }, [router]);

  // ২. ইনপুট চেঞ্জ হ্যান্ডলার
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await supabase
        .from('b2b_requests')
        .insert([{
          ...formData,
          email: user.email,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      setSubmitted(true);

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-[3rem] shadow-xl max-w-md">
          <h2 className="text-3xl font-black text-gray-900">ধন্যবাদ!</h2>
          <p className="mt-4 text-sm">আপনার আবেদনটি সফলভাবে জমা হয়েছে।</p>
          <Link href="/" className="mt-8 inline-block bg-green-600 text-white px-10 py-4 rounded-full font-black uppercase text-xs">হোমপেজে ফিরে যান</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm max-w-xl w-full border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase">B2B Partnership</h1>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-6 text-sm font-bold text-gray-700">
            Applying with: {userEmail || 'Loading...'}
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Company Name</label>
            <input name="company_name" required onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 outline-none text-sm font-bold focus:ring-2 focus:ring-green-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Contact Person</label>
              <input name="contact_person" required onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 outline-none text-sm font-bold focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Business Type</label>
              <select name="business_type" onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 outline-none text-sm font-bold focus:ring-2 focus:ring-green-500 appearance-none">
                <option value="Resort">Resort</option>
                <option value="Hotel">Hotel</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Wholesaler">Wholesaler</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Phone / WhatsApp</label>
            <input name="phone" required onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 outline-none text-sm font-bold focus:ring-2 focus:ring-green-500" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:bg-gray-300">
            {loading ? 'Processing...' : 'Submit Partnership Request'}
          </button>
        </form>
      </div>
    </div>
  );
}