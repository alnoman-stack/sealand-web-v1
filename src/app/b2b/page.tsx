'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function B2BPage() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    business_type: 'Resort',
    email: '',
    phone: ''
  });

  useEffect(() => {
    const checkAuthAndRequest = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setIsLoggedIn(true);
        setSubmittedEmail(user.email || '');

        const { data: reqData } = await supabase
          .from('b2b_requests')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();

        if (reqData) {
          setExistingRequest(reqData);
        }
      }
      setLoading(false);
    };

    checkAuthAndRequest();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userEmail = user ? user.email : formData.email;

      const { error } = await supabase
        .from('b2b_requests')
        .insert([{
          ...formData,
          email: userEmail,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;
      
      setSubmittedEmail(userEmail || '');
      setSubmitted(true);

    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-mono text-xs uppercase text-gray-400 animate-pulse">
        Checking Portal Access...
      </div>
    );
  }

  if (isLoggedIn && existingRequest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <div className="text-center p-10 bg-white rounded-[3rem] shadow-xl max-w-md border border-gray-100">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black mb-4">
            ℹ
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase">আবেদন ইতিমধ্যে জমা আছে</h2>
          <p className="mt-3 text-xs text-gray-600 leading-relaxed">
            আপনার প্রতিষ্ঠান <span className="font-bold text-gray-900">{existingRequest.company_name}</span>-এর পক্ষ থেকে বিটুবি রিকোয়েস্ট পাঠানো হয়েছে। 
          </p>
          <div className="mt-4 p-3 bg-gray-50 rounded-2xl text-[11px] font-mono text-gray-500 uppercase">
            Status: <span className="text-yellow-600 font-bold">{existingRequest.status}</span>
          </div>
          <Link href="/dashboard" className="mt-6 inline-block bg-gray-900 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all w-full">
            ড্যাশবোর্ডে যান →
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
        <div className="text-center p-10 bg-white rounded-[3rem] shadow-xl max-w-md border border-gray-100">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black mb-4">
            ✓
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase">ধন্যবাদ!</h2>
          <p className="mt-3 text-xs text-gray-600 leading-relaxed">
            আপনার বিটুবি পার্টনারশিপ আবেদনটি সফলভাবে জমা হয়েছে। এখন অ্যাকাউন্ট তৈরি করতে পারেন।
          </p>
          <Link 
            href={`/signup?email=${encodeURIComponent(submittedEmail)}`}
            className="mt-6 inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg transition-all w-full"
          >
            Create Account Now →
          </Link>
          <Link href="/" className="mt-4 inline-block text-[10px] text-gray-400 hover:text-gray-900 font-bold uppercase tracking-wider">
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-xl max-w-xl w-full border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase">B2B Partnership</h1>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-8">SeaLand Agro B2B Procurement Portal</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Company / Resort Name</label>
            <input name="company_name" required onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 outline-none text-sm font-bold focus:ring-2 focus:ring-green-500 border border-gray-100" placeholder="e.g. Bhawal Resort & Spa" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Contact Person</label>
              <input name="contact_person" required onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 outline-none text-sm font-bold focus:ring-2 focus:ring-green-500 border border-gray-100" placeholder="Manager Name" />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Business Type</label>
              <select name="business_type" onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 outline-none text-sm font-bold focus:ring-2 focus:ring-green-500 border border-gray-100">
                <option value="Resort">Resort</option>
                <option value="Hotel">Hotel</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Wholesaler">Wholesaler</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Business Email</label>
            <input type="email" name="email" required onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 outline-none text-sm font-bold focus:ring-2 focus:ring-green-500 border border-gray-100" placeholder="business@company.com" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Phone / WhatsApp</label>
            <input name="phone" required onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 outline-none text-sm font-bold focus:ring-2 focus:ring-green-500 border border-gray-100" placeholder="+880..." />
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-gray-900 hover:bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl disabled:bg-gray-300 mt-2">
            {loading ? 'Processing...' : 'Submit Partnership Request'}
          </button>
        </form>
      </div>
    </div>
  );
}