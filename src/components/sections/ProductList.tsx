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
  products, 
  searchTerm, 
  selectedCategory, 
  onAdd, 
  setSearchTerm, 
  setSelectedCategory,
  currentUser 
}: ProductListProps) => {

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
    return ['All', ...uniqueCategories];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const productName = product.name_en?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    const matchesSearch = productName.includes(search);
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      selectedCategory === '' ||
      product.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
      
    return matchesSearch && matchesCategory;
  });

  // --- B2B Logic (ধাপ ১ ও ৪): ইউজার B2B হলে b2b_price রিটার্ন করবে ---
  const getFinalPrice = (product: Product) => {
    if (currentUser?.is_b2b && product.b2b_price) {
      return Number(product.b2b_price);
    }
    return Number(product.price);
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
            onClick={() => setSelectedCategory(cat!)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase transition-all ${
              selectedCategory.toLowerCase() === (cat?.toLowerCase() || '')
                ? 'bg-green-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
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
          placeholder={`Search products...`}
          className="w-full p-4 pl-12 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute left-4 top-4 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
              <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl border border-gray-50 group transition-all duration-300 flex flex-col h-full relative">
                
                {/* B2B Badge (ধাপ ৩) */}
                {isB2B && (
                  <div className="absolute top-4 left-4 z-10 bg-green-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
                    B2B SPECIAL
                  </div>
                )}

                <div className="aspect-square bg-gray-50 relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name_en} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100 italic font-black">SeaLand</div>
                  )}
                </div>

                <div className="p-4 md:p-6 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-gray-800 mb-1 line-clamp-1">{product.name_en}</h3>
                  <p className="text-gray-400 text-[10px] mb-3">{product.name_bn || 'Fresh Produce'}</p>
                  
                  {/* Visual Comparison & Price (ধাপ ২) */}
                  <div className="flex flex-col mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black text-gray-900">৳{finalPrice}</span>
                      <span className="text-gray-400 text-xs">/ {product.unit}</span>
                    </div>
                    {isB2B && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-400 line-through">Retail: ৳{product.price}</span>
                        <span className="text-[10px] text-green-600 font-bold">Save ৳{Number(product.price) - Number(product.b2b_price)}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Logic (ধাপ ৪): onAdd এ আপডেট করা প্রাইস পাঠানো হচ্ছে */}
                  <button 
                    onClick={() => onAdd({ ...product, price: finalPrice })} 
                    className="w-full mt-auto py-3 rounded-2xl font-bold bg-gray-900 text-white hover:bg-green-600 active:scale-95 transition-all shadow-md"
                  >
                    Add to Quote
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-gray-500 italic">No items found in this category.</p>
          <button onClick={() => setSelectedCategory('All')} className="mt-4 text-green-600 font-bold underline">Show All Products</button>
        </div>
      )}
    </div>
  );
};

export default ProductList;