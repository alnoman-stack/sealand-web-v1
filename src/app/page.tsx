'use client';
import { useState, useEffect } from 'react';
import { useHomePageLogic } from '@/hooks/useHomePageLogic';
import { useAuth } from '@/components/sections/context/AuthContext';
import { supabase } from '@/lib/supabase'; // ডাটাবেস চেক করার জন্য সুপাবেস ইমপোর্ট
import Link from 'next/link';

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

export default function HomePage() {
  const logic = useHomePageLogic();
  const { user, loading: authLoading } = useAuth();
  
  // নতুন স্টেট: ইউজারের রোল রাখার জন্য
  const [userRole, setUserRole] = useState<string | null>(null);

  // --- ১. ডাইনামিক রোল চেক লজিক ---
  // ডাটাবেসের 'profiles' টেবিল থেকে ইউজারের বর্তমান রোল নিয়ে আসা হচ্ছে
  useEffect(() => {
    async function getUserRole() {
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();
          
          if (!error && data) {
            // রোলটি ছোট হাতের অক্ষরে ট্রিম করে নেওয়া হচ্ছে যেন বানানে ভুল থাকলেও কাজ করে
            setUserRole(data.role.toLowerCase().trim());
          }
        } catch (err) {
          console.error("Role fetching error:", err);
        }
      }
    }
    getUserRole();
  }, [user]);

  // এডমিন চেক: এখন এটি ইমেইল নয়, বরং রোলের ওপর নির্ভর করে
  const isAdmin = userRole === 'admin' || userRole === 'staff';

  // --- Explore Catalog ফাংশন ---
  const handleExploreCatalog = () => {
    if (logic.setShowProducts) {
      logic.setShowProducts(true);
    }

    if (logic.setSelectedCategory) {
      logic.setSelectedCategory('All');
    }

    // স্ক্রলিং লজিক
    setTimeout(() => {
      const element = document.getElementById('catalog-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300); 
  };

  // লোডিং স্টেট
  if (logic.loading || authLoading) return (
    <div className="p-10 text-center text-green-700 font-bold italic text-xl min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
        <img src="/final.png" alt="Logo" className="absolute inset-0 m-auto h-6 w-auto" />
      </div>
      <p className="animate-pulse uppercase tracking-[0.2em] text-xs font-black text-gray-400">SeaLand Agro is loading...</p>
    </div>
  );

  return (
    <main className="bg-gray-50 min-h-screen text-gray-900 overflow-x-hidden relative">
      
      {/* --- ২. গোপন এডমিন বাটন --- */}
      {/* এটি এখন আপনি বা শাফিন ভাই (যাদের রোল admin) লগইন করলেই দেখা যাবে */}
      {isAdmin && (
        <Link 
          href="/admin-panel" 
          className="fixed bottom-24 right-6 z-[60] bg-red-600 hover:bg-black text-white px-5 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all flex items-center gap-3 border border-red-500 active:scale-95"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Admin Dashboard
        </Link>
      )}

      {/* ১. Hero Section */}
      <Hero onExplore={handleExploreCatalog} />
      
      {/* ২. মিডল সেকশনসমূহ */}
      <CategoryBar onCategoryClick={logic.handleCategorySelect} />
      <Features />
      <AboutUs />
      <Stats />
      <Clients />
      
      {/* ৩. প্রোডাক্ট সেকশন */}
      <div id="catalog-section" className="bg-white">
        <ProductSection 
          isVisible={logic.showProducts}
          catalogRef={logic.catalogRef}
          products={logic.products}
          searchTerm={logic.searchTerm}
          selectedCategory={logic.selectedCategory}
          onAdd={(product) => logic.addItem(product, 0)}
          setSearchTerm={logic.setSearchTerm}
          setSelectedCategory={logic.setSelectedCategory}
          currentUser={user} // বিটুবি ডাটা হ্যান্ডলিং
        />
      </div>

      <Contact />
      <Footer />

      {/* ৪. কার্ট সিস্টেম */}
      <CartIcon count={logic.cartItems.length} onClick={() => logic.setIsDrawerOpen(true)} />
      
      <CartDrawer 
        isOpen={logic.isDrawerOpen} 
        onClose={() => logic.setIsDrawerOpen(false)}
        items={logic.cartItems}
        addItem={logic.addItem}
        removeItem={logic.removeItem}
        // ইউজার লগইন থাকলে ডাটাবেস থেকে নাম-ঠিকানা অটো নিবে
        userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || logic.userName || ""}
        userLocation={logic.userLocation || ""}
        setUserName={logic.setUserName}
        setUserLocation={logic.setUserLocation}
        onOrder={logic.handleWhatsAppOrder}
      />
    </main>
  );
}