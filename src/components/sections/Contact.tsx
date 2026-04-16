// src/components/sections/Contact.tsx
import React from 'react';

const Contact = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-green-900 rounded-[3rem] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-800 rounded-full -mr-20 -mt-20 opacity-50" />
          
          <div className="relative z-10 text-white max-w-lg text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black mb-6">আমাদের সাথে যোগাযোগ করুন</h2>
            <p className="text-green-100 text-lg mb-8">
              আপনি কি কোনো রিসোর্ট বা হাসপাতালের পক্ষ থেকে বাল্ক অর্ডারের জন্য ভাবছেন? আমাদের টিম ২৪/৭ প্রস্তুত।
            </p>
            <div className="space-y-4">
              <p className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-2xl">📞</span> +880 1714-114396
              </p>
              <p className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-2xl">📍</span> House-03;Road-16,Nobinagar Dhaka Uddan | Mohammadpur, Dhaka, Bangladesh
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <button className="w-full md:w-auto px-12 py-5 bg-white text-green-900 rounded-full font-bold text-xl hover:shadow-2xl transition-all scale-100 hover:scale-105">
              WhatsApp Us Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;