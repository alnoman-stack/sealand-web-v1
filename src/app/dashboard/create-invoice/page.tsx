'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/sections/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name_en: string;
  price: number;
  b2b_price: number;
  unit: string;
  current_stock: number;
}

export default function POSInvoiceB2B() {
  const { user } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'billing'>('inventory');
  const [customerAddress, setCustomerAddress] = useState('');

  useEffect(() => {
    if (!user) return;

    async function loadData() {
      // ১. ইনভেন্টরি প্রোডাক্টস লোড করা
      const { data: prodData } = await supabase
        .from('products')
        .select('*')
        .order('name_en', { ascending: true });
      if (prodData) setProducts(prodData);

      // ২. কাস্টমারের আগের অর্ডারের অ্যাড্রেস অটো-লোড করা
      const { data: lastInvoice } = await supabase
        .from('invoices')
        .select('customer_address')
        .eq('customer_id', user?.id)
        .order('inserted_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastInvoice?.customer_address) {
        setCustomerAddress(lastInvoice.customer_address);
      } else if (user?.user_metadata?.address) {
        setCustomerAddress(user.user_metadata.address);
      }
    }
    
    loadData();
  }, [user]);

  const addToCart = (product: Product) => {
    if (product.current_stock <= 0) {
      alert("Stock out!");
      return;
    }

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { 
        ...product, 
        qty: 1, 
        active_price: product.b2b_price || product.price,
        unit: product.unit || 'pcs' 
      }]);
    }
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (isNaN(newQty) || newQty < 0) return;
    setCart(cart.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.active_price * (Number(item.qty) || 0)), 0);

  const handleFinalizeAndSave = async () => {
    if (cart.length === 0) return alert("Please add items to your invoice!");
    if (!customerAddress.trim()) return alert("দয়া করে ডেলিভারি ঠিকানা দিন!");

    setLoading(true);

    try {
      const invoiceNo = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

      // ১. ইনভয়েস টেবিল এন্ট্রি 
      const { data: invoiceData, error: invError } = await supabase
        .from('invoices')
        .insert([{ 
          invoice_number: invoiceNo,
          customer_name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'B2B Partner',
          customer_address: customerAddress, 
          total_amount: totalAmount,
          received_amount: 0,
          due_amount: totalAmount,
          status: 'pending',
          customer_id: user?.id
        }])
        .select()
        .single();

      if (invError) {
        console.error("Invoice Insert Error Details:", invError);
        throw invError;
      }

      // ২. ইনভয়েস আইটেম এবং স্টক আপডেট
      for (const item of cart) {
        const { error: itemError } = await supabase.from('invoice_items').insert({
          invoice_id: invoiceData.id,
          product_name: `${item.name_en} (${item.qty} ${item.unit})`, 
          qty: item.qty, 
          unit_price: item.active_price,
          total: item.qty * item.active_price 
        });

        if (itemError) {
          console.error("Invoice Items Insert Error:", itemError);
        }

        const { data: currentProd } = await supabase
          .from('products')
          .select('current_stock')
          .eq('id', item.id)
          .single();

        if (currentProd) {
          await supabase.from('products')
            .update({ current_stock: Math.max(0, (currentProd.current_stock || 0) - item.qty) })
            .eq('id', item.id);
        }
      }

      // ৩. ইউজারের প্রোফাইলে total_spending আপডেট করা
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('total_spending')
        .eq('id', user?.id)
        .maybeSingle();

      const prevSpending = Number(currentProfile?.total_spending || 0);
      await supabase
        .from('profiles')
        .update({ total_spending: prevSpending + totalAmount })
        .eq('id', user?.id);

      alert(`অর্ডার সফল হয়েছে! ইনভয়েস নম্বর: ${invoiceNo}`);
      setCart([]);
      setActiveTab('inventory');
      router.push('/dashboard');

    } catch (error: any) {
      console.error("Finalize Order Exception:", error);
      alert(`সেভ করতে সমস্যা হয়েছে: ${error.message || 'আবার চেষ্টা করুন।'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* মোবাইল নেভিগেশন */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/15 z-50 flex justify-around p-3 shadow-2xl backdrop-blur-md">
        <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'inventory' ? 'text-green-400 scale-105' : 'text-gray-400'}`}>
          <span className="text-xl">📦</span>
          <span className="text-[10px] font-black uppercase tracking-wider">Stock</span>
        </button>
        <button onClick={() => setActiveTab('billing')} className={`flex flex-col items-center gap-1 relative transition-all ${activeTab === 'billing' ? 'text-green-400 scale-105' : 'text-gray-400'}`}>
          <span className="text-xl">📄</span>
          <span className="text-[10px] font-black uppercase tracking-wider">Bill</span>
          {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
        </button>
      </div>

      {/* বাম পাশ: Inventory */}
      <div className={`${activeTab === 'inventory' ? 'flex' : 'hidden'} lg:flex lg:w-1/3 border-r border-white/10 flex-col p-4 sm:p-6 bg-[#0A0A0A] h-full overflow-hidden`}>
        <button onClick={() => router.push('/dashboard')} className="mb-4 sm:mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group shrink-0">
          <span className="bg-white/5 p-2 rounded-lg group-hover:bg-green-600">←</span> Dashboard
        </button>
        <h2 className="text-green-500 font-black italic uppercase mb-4 text-lg sm:text-xl tracking-tighter shrink-0">Inventory Feed</h2>
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full bg-white/5 border border-white/10 p-3.5 sm:p-4 rounded-xl outline-none focus:border-green-500 text-xs sm:text-sm mb-4 sm:mb-6 text-white shrink-0" 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <div className="flex-1 overflow-y-auto space-y-3 pb-24 lg:pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {products.filter(p => p.name_en?.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
            <div key={product.id} className="bg-white/5 p-3 sm:p-4 rounded-2xl flex justify-between items-center border border-white/5 transition-all hover:bg-white/10 gap-3">
              <div className="flex-1 truncate">
                <p className="text-[11px] font-black uppercase text-gray-300 truncate">{product.name_en}</p>
                <p className="text-green-400 font-black text-xs sm:text-sm mt-0.5">৳{product.b2b_price || product.price} / <span className="text-[10px] text-gray-400">{product.unit || 'pcs'}</span></p>
              </div>
              <button onClick={() => addToCart(product)} className="bg-green-600 hover:bg-green-500 text-white w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">+</button>
            </div>
          ))}
        </div>
      </div>

      {/* ডান পাশ: Billing */}
      <div className={`${activeTab === 'billing' ? 'flex' : 'hidden'} lg:flex flex-1 bg-white flex-col m-2 sm:m-4 rounded-[25px] sm:rounded-[30px] overflow-hidden text-black h-full`}>
        <div className="p-4 sm:p-8 md:p-10 flex-1 flex flex-col overflow-hidden pb-28 lg:pb-6">
          <div className="flex justify-between items-start mb-4 sm:mb-6 shrink-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-black italic text-green-900 uppercase">Sealand Agro</h1>
              <p className="text-[8px] font-black text-gray-400 uppercase mt-1 sm:mt-2 tracking-widest">A Commitment to Freshness</p>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-[9px] font-black text-green-900">{new Date().toLocaleDateString('en-GB')}</div>
          </div>

          <div className="bg-green-50/50 p-3 sm:p-4 rounded-2xl mb-4 sm:mb-6 border border-green-100/50 shrink-0">
            <p className="text-[8px] uppercase font-black text-green-600 mb-1 tracking-widest">Customer Details:</p>
            <h3 className="font-black text-xs sm:text-sm md:text-xl uppercase italic text-green-950 mb-2 sm:mb-3 leading-none truncate">
              {user?.user_metadata?.full_name || 'B2B Partner'}
            </h3>
            <div className="relative group">
              <span className="absolute left-3 top-3 text-xs">📍</span>
              <input 
                type="text" 
                placeholder="Delivery Address..." 
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="w-full bg-white/80 border border-green-100 pl-8 p-2.5 sm:p-3 rounded-xl text-[11px] font-black text-green-900 outline-none focus:border-green-400 focus:bg-white transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-green-900 text-white p-2.5 sm:p-3 rounded-xl flex text-[8px] sm:text-[9px] font-black uppercase mb-3 shrink-0">
              <div className="flex-[3]">Description & Unit</div>
              <div className="flex-1 text-center">Qty / Amount</div>
              <div className="flex-1 text-right">Total</div>
              <div className="w-8"></div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {cart.map((item) => (
                <div key={item.id} className="flex p-2.5 sm:p-3 border-b border-gray-100 text-[11px] font-bold items-center gap-2">
                  <div className="flex-[3] uppercase text-green-950 truncate">
                    {item.name_en} <span className="text-[9px] text-gray-500 font-normal">({item.unit})</span>
                  </div>
                  
                  {/* পরিমাণ বা কেজি সরাসরি টাইপ করে বা ইনক্রিমেন্ট করে এডিট করার সুবিধা */}
                  <div className="flex-1 flex justify-center items-center gap-1">
                    <button onClick={() => updateQuantity(item.id, Number((item.qty - (item.unit === 'kg' ? 0.5 : 1)).toFixed(2)))} className="text-gray-400 font-bold px-1 hover:text-black">-</button>
                    <input 
                      type="number" 
                      step={item.unit === 'kg' ? "0.1" : "1"}
                      min="0" 
                      value={item.qty} 
                      onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value) || 0)}
                      className="w-14 bg-gray-100 text-center py-1 rounded text-xs font-black outline-none border border-transparent focus:border-green-500"
                    />
                    <button onClick={() => updateQuantity(item.id, Number((item.qty + (item.unit === 'kg' ? 0.5 : 1)).toFixed(2)))} className="text-gray-400 font-bold px-1 hover:text-black">+</button>
                  </div>

                  <div className="flex-1 text-right text-green-900 font-black">৳{(item.qty * item.active_price).toFixed(2)}</div>
                  <button onClick={() => removeFromCart(item.id)} className="w-8 text-red-400 text-right font-bold hover:text-red-600">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t-2 border-dashed border-gray-100 shrink-0">
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payable</p>
             <h2 className="text-3xl sm:text-4xl md:text-6xl font-black italic text-green-900 leading-none">৳{totalAmount.toLocaleString()}</h2>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 fixed bottom-14 left-2 right-2 rounded-2xl lg:rounded-none lg:relative lg:bottom-0 lg:left-0 lg:right-0 shadow-2xl shrink-0 z-40">
           <button onClick={handleFinalizeAndSave} disabled={loading} className="w-full lg:flex-[2] bg-black text-white py-3.5 sm:py-4 rounded-xl lg:rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 disabled:opacity-50 transition-all">
             {loading ? 'SAVING...' : 'CONFIRM B2B ORDER'}
           </button>
           <button onClick={() => window.print()} className="w-full lg:flex-1 bg-green-600 text-white py-3.5 sm:py-4 rounded-xl lg:rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-green-700 transition-all">Print</button>
        </div>
      </div>
    </div>
  );
}