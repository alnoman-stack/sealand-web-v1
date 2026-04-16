'use client';

import { useHomePageLogic } from '@/hooks/useHomePageLogic';
import { useAuth } from '@/context/AuthContext';

// Sections & Components
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import AboutUs from '@/components/sections/AboutUs';
import Stats from '@/components/sections/Stats';
import Clients from '@/components/sections/Clients';
import CategoryBar from '@/components/sections/CategoryBar';
import ProductSection from '@/components/sections/ProductSection';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import CartIcon from '@/components/cart/CartIcon';
import Link from 'next/link';

export default function HomePage() {
  const logic = useHomePageLogic();
  const { user, loading: authLoading } = useAuth();

  // --- Explore Catalog ফাংশন ---
  const handleExploreCatalog = () => {
    // ১. প্রডাক্ট সেকশনটি অন করা
    if (logic.setShowProducts) {
      logic.setShowProducts(true);
    }

    // ২. ডিফল্ট ক্যাটাগরি 'All' সেট করা
    if (logic.setSelectedCategory) {
      logic.setSelectedCategory('All');
    }

    // ৩. একটু সময় দিয়ে স্ক্রল করা
    setTimeout(() => {
      const element = document.getElementById('catalog-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200); // সময় সামান্য বাড়ানো হলো সেফটির জন্য
  };

  if (logic.loading || authLoading) return (
    <div className="p-10 text-center text-green-700 font-bold italic text-xl min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      SeaLand Agro-এর পণ্যগুলো লোড হচ্ছে...
    </div>
  );

  return (
    <main className="bg-gray-50 min-h-screen text-gray-900">
      {/* টপ বার রিমুভ করা হয়েছে কারণ এটি Hero সেকশনে অলরেডি আছে */}

      {/* ১. Hero Section - এটিই এখন মেইন নেভিগেশন হ্যান্ডেল করবে */}
      <Hero onExplore={handleExploreCatalog} />
      
      {/* ২. বাকি সেকশনসমূহ */}
      <CategoryBar onCategoryClick={logic.handleCategorySelect} />
      <Features />
      <AboutUs />
      <Stats />
      <Clients />
      
      {/* ৩. প্রোডাক্ট সেকশন (ID সহ যাতে স্ক্রল কাজ করে) */}
      <div id="catalog-section">
        <ProductSection 
          isVisible={logic.showProducts}
          catalogRef={logic.catalogRef}
          products={logic.products}
          searchTerm={logic.searchTerm}
          selectedCategory={logic.selectedCategory}
          onAdd={(product) => logic.addItem(product, 0)}
          setSearchTerm={logic.setSearchTerm}
          setSelectedCategory={logic.setSelectedCategory}
          currentUser={user}
        />
      </div>

      <Contact />
      <Footer />

      {/* ৪. কার্ট অপশন */}
      <CartIcon count={logic.cartItems.length} onClick={() => logic.setIsDrawerOpen(true)} />
      <CartDrawer 
        isOpen={logic.isDrawerOpen} 
        onClose={() => logic.setIsDrawerOpen(false)}
        items={logic.cartItems}
        addItem={logic.addItem}
        removeItem={logic.removeItem}
        userName={user?.name || logic.userName}
        setUserName={logic.setUserName}
        userLocation={user?.address || logic.userLocation}
        setUserLocation={logic.setUserLocation}
        onOrder={logic.handleWhatsAppOrder}
      />
    </main>
  );
}