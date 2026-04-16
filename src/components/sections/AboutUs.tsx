// src/components/sections/AboutUs.tsx
import React from 'react';

const AboutUs = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Visual Element: আপনার অপারেশন বা কোনো ভালো ছবি */}
          <div className="w-full lg:w-1/2">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://plus.unsplash.com/premium_photo-1661547834236-448efea7a444?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="SeaLand Agro Sourcing" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute bottom-6 left-6 bg-green-600 text-white p-6 rounded-2xl shadow-lg">
                <p className="text-3xl font-bold">৩০০+</p>
                <p className="text-sm">প্রতিদিনের ফ্রেশ ডেলিভারি</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-sm font-bold tracking-widest text-green-600 uppercase">
              আমাদের সম্পর্কে
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              খামার থেকে আপনার কিচেনে— <br/>
              একটি আস্থার নাম SeaLand Agro
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              আমরা শুধু সবজি বা মাছ সরবরাহ করি না, আমরা নিশ্চিত করি গুণগত মান এবং স্বচ্ছতা। 
              আমাদের লক্ষ্য হলো ঢাকার মোহাম্মদপুর ও ঢাকা উদ্যান থেকে শুরু করে সারা দেশের 
              বড় বড় রিসোর্ট এবং হাসপাতালে প্রিমিয়াম এগ্রো-পণ্য পৌঁছে দেওয়া।
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-700 font-bold">✓</div>
                <div>
                  <h4 className="font-bold text-gray-900">সরাসরি সোর্সিং</h4>
                  <p className="text-sm text-gray-600">কোনো মিডলম্যান ছাড়া সরাসরি কৃষক ও সোর্স থেকে পণ্য সংগ্রহ।</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-100 rounded-lg text-green-700 font-bold">✓</div>
                <div>
                  <h4 className="font-bold text-gray-900">প্রযুক্তিগত পরিচালনা</h4>
                  <p className="text-sm text-gray-600">আমাদের "SEALAND VAULT" ERP সিস্টেমের মাধ্যমে নির্ভুল ইনভেন্টরি ম্যানেজমেন্ট।</p>
                </div>
              </div>
            </div>

            <button className="mt-6 px-10 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-black transition-all">
              আমাদের ভিশন জানুন
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;