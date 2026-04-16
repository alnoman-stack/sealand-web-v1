// src/components/sections/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="col-span-1 md:col-span-1">
          <h3 className="text-white text-2xl font-bold mb-6">SeaLand <span className="text-green-500">Agro</span></h3>
          <p className="text-sm leading-relaxed">
            খামার থেকে আপনার কিচেন বা রিসোর্টে সরাসরি ফ্রেশ পণ্য পৌঁছে দেওয়াই আমাদের লক্ষ্য। ৩৬৩ দিন আপনার সেবায়।
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-green-500 transition">About Us</a></li>
            <li><a href="#" className="hover:text-green-500 transition">Our Catalog</a></li>
            <li><a href="#" className="hover:text-green-500 transition">B2B Solutions</a></li>
            <li><a href="#" className="hover:text-green-500 transition">Contact</a></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold mb-6">Product Categories</h4>
          <ul className="space-y-4 text-sm">
            <li>Exotic Vegetables</li>
            <li>Fresh Local Fruits</li>
            <li>Seafood Collection</li>
            <li>Organic Products</li>
          </ul>
        </div>

        {/* Social & Rights */}
        <div>
          <h4 className="text-white font-bold mb-6">Follow Us</h4>
          <div className="flex gap-4 text-xl mb-6">
            <span className="cursor-pointer hover:text-white">FB</span>
            <span className="cursor-pointer hover:text-white">LN</span>
            <span className="cursor-pointer hover:text-white">WA</span>
          </div>
          <p className="text-xs uppercase tracking-widest font-bold text-gray-600">
            Operating in Dhaka Uddan & Mohammadpur
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} SeaLand Agro. All Rights Reserved. Managed via SEALAND VAULT.</p>
      </div>
    </footer>
  );
};

export default Footer;