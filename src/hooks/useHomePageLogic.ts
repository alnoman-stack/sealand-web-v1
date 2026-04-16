'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/context/AuthContext'; // AuthContext থেকে ইউজার ডাটা আনা

export function useHomePageLogic() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { items: cartItems, addItem, removeItem } = useCartStore();
  const { user } = useAuth(); // বর্তমানে লগইন করা ইউজারের তথ্য
  const catalogRef = useRef<HTMLDivElement>(null);
  
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showProducts, setShowProducts] = useState(false);
  const [loading, setLoading] = useState(true);

  // অটোমেটিক ইউজারের নাম এবং লোকেশন সেট করা (যদি লগইন থাকে)
  useEffect(() => {
    if (user) {
      setUserName(user.name || '');
      setUserLocation(user.address || '');
    }
  }, [user]);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name_en', { ascending: true });
      if (!error && data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setShowProducts(true);
    setTimeout(() => {
      catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  const handleWhatsAppOrder = () => {
    if (!userName || !userLocation) return alert("দয়া করে আপনার নাম এবং লোকেশন লিখুন!");
    if (cartItems.length === 0) return alert("আপনার কার্ট খালি!");

    const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // আইটেম লিস্ট তৈরি
    const itemDetails = cartItems.map(i => 
      `• *${i.name_en}* - ${i.quantity} ${i.unit} (৳${(i.price * i.quantity).toFixed(0)})`
    ).join('\n');

    // বিটুবি চেক
    const userType = user?.is_b2b ? '💎 B2B Partner' : 'Retail Customer';

    // হোয়াটসঅ্যাপ মেসেজ ফরম্যাট (sealandagro.com ব্র্যান্ডিং সহ)
    const message = `*New Order from SeaLandAgro.com* 🛒
---------------------------------------
👤 *Customer:* ${userName}
📍 *Location:* ${userLocation}
🏷️ *Type:* ${userType}
---------------------------------------
*Items Detail:*
${itemDetails}

---------------------------------------
💰 *Total Estimated: ৳${totalPrice.toFixed(0)}*
---------------------------------------
✅ Please confirm availability.
_Sent via sealandagro.com_`;

    window.open(`https://wa.me/8801714114396?text=${encodeURIComponent(message)}`, '_blank');
  };

  return {
    isDrawerOpen, 
    setIsDrawerOpen, 
    cartItems, 
    addItem, 
    removeItem,
    catalogRef, 
    userName, 
    setUserName, 
    userLocation, 
    setUserLocation,
    products, 
    searchTerm, 
    setSearchTerm, 
    selectedCategory, 
    setSelectedCategory,
    showProducts, 
    setShowProducts,
    loading, 
    handleCategorySelect, 
    handleWhatsAppOrder,
    user // ইউজার অবজেক্টটি রিটার্ন করা হলো
  };
}