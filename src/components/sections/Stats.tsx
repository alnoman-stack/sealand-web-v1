// src/components/sections/Stats.tsx
import React from 'react';

const Stats = () => {
  const stats = [
    { label: "Daily Fresh Delivery", value: "500+ KG" },
    { label: "B2B Partners", value: "50+" },
    { label: "Direct Sourcing", value: "100+ Farmers" },
    { label: "Service Hours", value: "24/7" },
  ];

  return (
    <section className="bg-green-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i} className="text-white">
              <p className="text-3xl md:text-5xl font-black mb-2">{stat.value}</p>
              <p className="text-green-300 text-sm md:text-base font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;