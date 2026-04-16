'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function B2BPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // ডাটাবেসে পাঠানোর জন্য অবজেক্ট তৈরি
    const requestData = {
      company_name: formData.get('company_name'),
      contact_person: formData.get('contact_person'),
      business_type: formData.get('business_type'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      status: 'pending' // ডিফল্ট স্ট্যাটাস
    };

    const { error } = await supabase
      .from('b2b_requests')
      .insert([requestData]);

    setLoading(false);

    if (error) {
      alert("দুঃখিত, আবেদনটি পাঠানো সম্ভব হয়নি। আবার চেষ্টা করুন।");
      console.error(error);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white rounded-[3rem] shadow-xl border border-green-100">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800">ধন্যবাদ!</h2>
          <p className="text-gray-500 mt-2">আপনার পার্টনারশিপ রিকোয়েস্টটি সফলভাবে জমা হয়েছে।</p>
          <Link href="/" className="mt-6 inline-block bg-green-600 text-white px-8 py-3 rounded-full font-bold">
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-sm max-w-xl w-full border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2">B2B Partnership Request</h1>
        <p className="text-gray-500 mb-8 text-sm">
          SeaLand Agro-এর সাথে যুক্ত হয়ে আপনার প্রতিষ্ঠানের সাপ্লাই চেইন শক্তিশালী করুন।
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-2">Company Name</label>
            <input 
              name="company_name" 
              required 
              placeholder="e.g. Bhawal Resort & Spa" 
              className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-2">Contact Person</label>
              <input 
                name="contact_person" 
                required 
                placeholder="Name" 
                className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-black-400 mb-1 ml-2">Business Type</label>
              <select 
                name="business_type" 
                className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 appearance-none"
              >
                <option value="Resort">Resort</option>
                <option value="Hotel">Hotel</option>
                <option value="Hospital">Hospital</option>
                <option value="Restaurant">Restaurant</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-2">Email Address</label>
            <input 
              name="email" 
              type="email" 
              required 
              placeholder="business@email.com" 
              className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-1 ml-2">Phone / WhatsApp</label>
            <input 
              name="phone" 
              required 
              placeholder="+880" 
              className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-green-600/20 mt-4"
          >
            {loading ? 'Submitting...' : 'Submit Partnership Request'}
          </button>
        </form>
      </div>
    </div>
  );
}