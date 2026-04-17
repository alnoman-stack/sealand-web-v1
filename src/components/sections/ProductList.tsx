'use client';
import React, { useMemo } from 'react';
import { Product } from '@/types/product';

interface ProductListProps {
  products: Product[];
  searchTerm: string;
  selectedCategory: string;
  onAdd: (product: Product) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (cat: string) => void;
  currentUser?: any; 
}

const ProductList = ({ 
  products = [], // ডিফল্ট খালি অ্যারে যাতে এরর না হয়
  searchTerm = "", // ডিফল্ট খালি স্ট্রিং
  selectedCategory = "All", 
  onAdd, 
  setSearchTerm, 
  setSelectedCategory,
  currentUser 
}: ProductListProps) => {

  // ১. ইউনিক ক্যাটাগরি লিস্ট তৈরি (Space-safe)
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map(p => p.category?.trim()).filter(Boolean))
    );
    return ['All', ...uniqueCategories];
  }, [products]);

  // ২. ফিল্টারিং লজিক আপডেট (Safely handling undefined/null values)
  const filteredProducts = products.filter((product) => {
    // পজিটিভ চেক: ভ্যালু না থাকলে খালি স্ট্রিং ধরবে
    const productName = (product.name_en || "").toLowerCase();
    const search = (searchTerm || "").toLowerCase();
    const matchesSearch = productName.includes(search);
    
    const currentCategory = (product.category || "").trim();
    const targetCategory = (selectedCategory || "All").trim();

    const matchesCategory = 
      targetCategory === 'All' || 
      targetCategory === '' ||
      currentCategory.toLowerCase() === targetCategory.toLowerCase();
      
    return matchesSearch && matchesCategory;
  });

  // ৩. বিটুবি প্রাইস লজিক (Number conversion safety)
  const getFinalPrice = (product: Product) => {
    if (currentUser?.is_b2b && product.b2b_price) {
      return Number(product.b2b_price) || 0;
    }
    return Number(product.price) || 0;
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <header className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-green-900 mb-4 capitalize">
          {selectedCategory === 'All' ? 'Our Catalog' : `${selectedCategory} Collection`}
        </h2>
        <div className="w-24 h-1.5 bg-green-500 mx-auto rounded-full"></div>
        
        {currentUser?.is_b2b && (
          <p className="mt-4 text-green-600 font-bold flex items-center justify-center gap-2 animate-pulse">
            <span>💎</span> Special B2B Wholesale Pricing Active
          </p>
        )}
      </header>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat || 'All')}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              (selectedCategory || 'All').trim().toLowerCase() === (cat?.trim().toLowerCase() || '')
                ? 'bg-green-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-12 max-w-md mx-auto relative group">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-4 pl-12 rounded-2xl border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white transition-all text-gray-800"
          value={searchTerm || ""}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute left-4 top-4 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 pb-24">
          {filteredProducts.map((product) => {
            const finalPrice = getFinalPrice(product);
            const isB2B = currentUser?.is_b2b && product.b2b_price;

            return (
              <div key={product.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100/50 group transition-all duration-500 flex flex-col h-full relative">
                
                {isB2B && (
                  <div className="absolute top-4 left-4 z-10 bg-green-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg tracking-widest uppercase animate-bounce">
                    B2B Deal
                  </div>
                )}

                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50 italic font-black text-xs uppercase text-center p-4">SeaLand Agro</div>
                  )}
                </div>

                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <h3 className="text-sm font-black text-gray-800 mb-1 line-clamp-1 uppercase tracking-tight">{product.name_en}</h3>
                  <p className="text-gray-400 text-[10px] mb-4 font-bold">{product.name_bn || 'Fresh Produce'}</p>
                  
                  <div className="flex flex-col mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-gray-900">৳{finalPrice}</span>
                      <span className="text-gray-400 text-[10px] font-bold uppercase">/ {product.unit}</span>
                    </div>
                    {isB2B && (
                      <div className="flex items-center gap-2 mt-1 bg-green-50 p-1.5 rounded-lg border border-green-100 w-fit">
                        <span className="text-[10px] text-gray-400 line-through font-bold">৳{product.price}</span>
                        <span className="text-[10px] text-green-600 font-black tracking-tighter uppercase">Save ৳{Number(product.price) - Number(product.b2b_price)}</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => onAdd({ ...product, price: finalPrice })} 
                    className="w-full mt-auto py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-gray-900 text-white hover:bg-green-600 active:scale-95 transition-all shadow-xl shadow-gray-200"
                  >
                    Add to Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No items found.</p>
          <button onClick={() => setSelectedCategory('All')} className="mt-4 text-green-600 font-black uppercase text-[10px] tracking-widest hover:underline">Show All Products</button>
        </div>
      )}
    </div>
  );
};

export default ProductList;