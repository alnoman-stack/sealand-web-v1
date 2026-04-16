'use client';
import { RefObject } from 'react';
import ProductList from './ProductList';
import { Product } from '@/types/product';

interface ProductSectionProps {
  isVisible: boolean;
  catalogRef: React.RefObject<HTMLDivElement | null>;
  products: Product[];
  searchTerm: string;
  selectedCategory: string;
  onAdd: (product: Product) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (cat: string) => void;
  currentUser?: any; // আমরা আগে যে বিটুবি প্রপসটি যোগ করেছিলাম
}

export default function ProductSection({
  isVisible,
  catalogRef,
  products,
  searchTerm,
  selectedCategory,
  onAdd,
  setSearchTerm,
  setSelectedCategory,
  currentUser // এটিও এখানে রিসিভ করতে হবে
}: ProductSectionProps) {
  if (!isVisible) return null;

  return (
    /* ১. এখানে id="catalog-section" যোগ করা হয়েছে */
    /* ২. scroll-mt-20 দেওয়া হয়েছে যাতে স্ক্রল করার পর একদম উপরে লেগে না থাকে */
    <div 
      id="catalog-section" 
      ref={catalogRef} 
      className="scroll-mt-20 animate-in fade-in slide-in-from-bottom-5 duration-700"
    >
      <ProductList 
        products={products}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onAdd={onAdd}
        setSearchTerm={setSearchTerm}
        setSelectedCategory={setSelectedCategory}
        currentUser={currentUser} // ProductList-এ ডাটা পাস করা হচ্ছে
      />
    </div>
  );
}