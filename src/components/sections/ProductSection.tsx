'use client';
import React from 'react'; // React ইমপোর্ট নিশ্চিত করুন
import ProductList from './ProductList';
import { Product } from '@/types/product';

interface ProductSectionProps {
  isVisible: boolean;
  // এখানে টাইপটি HTMLDivElement | null করে দেওয়া হলো যাতে Ref টাইপ ম্যাচ করে
  catalogRef: React.RefObject<HTMLDivElement | null>; 
  products: Product[];
  searchTerm: string;
  selectedCategory: string;
  onAdd: (product: Product) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (cat: string) => void;
  currentUser?: any; 
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
  currentUser 
}: ProductSectionProps) {
  
  if (!isVisible) return null;

  return (
    <div 
      id="catalog-section" 
      // @ts-ignore - যদি খুব বেশি সমস্যা করে তবেই এটি দিবেন, নতুবা শুধু ref={catalogRef} ঠিক আছে
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
        currentUser={currentUser} 
      />
    </div>
  );
}