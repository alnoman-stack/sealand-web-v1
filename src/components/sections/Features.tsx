// src/components/sections/Features.tsx
import React from 'react';

const Features = () => {
  const coreFeatures = [
    {
      title: "৩৬৩ দিন সার্ভিস",
      desc: "বছরে মাত্র ২ দিন ঈদ ছুটি বাদে আমরা সবসময় আপনার সেবায় নিয়োজিত।",
      icon: "📅",
    },
    {
      title: "২-ঘণ্টার গ্যারান্টি",
      desc: "ড্যামেজ বা কোয়ালিটি সমস্যা থাকলে ২ ঘণ্টার মধ্যে দ্রুত রিপ্লেসমেন্ট।",
      icon: "⚡",
    },
    {
      title: "লাইভ ইনভেন্টরি",
      desc: "আমাদের SEALAND VAULT থেকে সরাসরি রিড করা টাটকা পণ্যের আপডেট।",
      icon: "📊",
    },
    {
      title: "২৪/৭ কন্টাক্ট",
      desc: "বিটুবি ক্লায়েন্টদের জন্য সার্বক্ষণিক সাপোর্ট এবং কোটেশন সুবিধা।",
      icon: "📞",
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreFeatures.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;