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
        active_price: product.b2b_price || product.price 
      }]);
    }
  };

  const updateQuantity = (id: string, newQty: number) => {
    if (newQty < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.active_price * item.qty), 0);

  const handleFinalizeAndSave = async () => {
    if (cart.length === 0) return alert("Please add items to your invoice!");
    if (!customerAddress.trim()) return alert("দয়া করে ডেলিভারি ঠিকানা দিন!");

    setLoading(true);

    try {
      const invoiceNo = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

      // ১. ইনভয়েস টেবিল এন্ট্রি (inserted_at ব্যবহার করা হয়েছে)
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
          customer_id: user?.id,
          inserted_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (invError) throw invError;

      // ২. ইনভয়েস আইটেম এবং স্টক আপডেট (Batch Processing)
      const itemPromises = cart.map(async (item) => {
        await supabase.from('invoice_items').insert({
          invoice_id: invoiceData.id,
          product_name: item.name_en, 
          qty: item.qty, 
          unit_price: item.active_price,
          total: item.qty * item.active_price 
        });

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
      });

      await Promise.all(itemPromises);

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
      console.error(error);
      alert("সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white overflow-hidden font-sans">
      
      {/* মোবাইল নেভিগেশন */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/10 z-50 flex justify-around p-3">
        <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center gap-1 ${activeTab === 'inventory' ? 'text-green-500' : 'text-gray-500'}`}>
          <span className="text-xl">📦</span>
          <span className="text-[10px] font-black uppercase">Stock</span>
        </button>
        <button onClick={() => setActiveTab('billing')} className={`flex flex-col items-center gap-1 relative ${activeTab === 'billing' ? 'text-green-500' : 'text-gray-500'}`}>
          <span className="text-xl">📄</span>
          <span className="text-[10px] font-black uppercase">Bill</span>
          {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
        </button>
      </div>

      {/* বাম পাশ: Inventory */}
      <div className={`${activeTab === 'inventory' ? 'flex' : 'hidden'} md:flex md:w-1/3 border-r border-white/10 flex-col p-4 bg-[#0A0A0A] h-full`}>
        <button onClick={() => router.push('/dashboard')} className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group">
          <span className="bg-white/5 p-2 rounded-lg group-hover:bg-green-600">←</span> Dashboard
        </button>
        <h2 className="text-green-500 font-black italic uppercase mb-4 text-xl tracking-tighter">Inventory Feed</h2>
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-green-500 text-sm mb-6 text-white" 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-24 md:pb-0">
          {products.filter(p => p.name_en?.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
            <div key={product.id} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center border border-white/5 transition-all hover:bg-white/10">
              <div className="flex-1">
                <p className="text-[11px] font-black uppercase text-gray-300">{product.name_en}</p>
                <p className="text-green-400 font-black text-sm">৳{product.b2b_price || product.price}</p>
              </div>
              <button onClick={() => addToCart(product)} className="bg-green-600 hover:bg-green-500 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold">+</button>
            </div>
          ))}
        </div>
      </div>

      {/* ডান পাশ: Billing */}
      <div className={`${activeTab === 'billing' ? 'flex' : 'hidden'} md:flex flex-1 bg-white flex-col m-2 md:m-4 rounded-[30px] overflow-hidden text-black h-full`}>
        <div className="p-6 md:p-10 flex-1 flex flex-col overflow-hidden pb-32 md:pb-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-black italic text-green-900 uppercase">Sealand Agro</h1>
              <p className="text-[8px] font-black text-gray-400 uppercase mt-2 tracking-widest">A Commitment to Freshness</p>
            </div>
            <div className="bg-gray-100 px-3 py-1 rounded-full text-[9px] font-black text-green-900">{new Date().toLocaleDateString('en-GB')}</div>
          </div>

          <div className="bg-green-50/50 p-4 rounded-2xl mb-6 border border-green-100/50">
            <p className="text-[8px] uppercase font-black text-green-600 mb-1 tracking-widest">Customer Details:</p>
            <h3 className="font-black text-sm md:text-2xl uppercase italic text-green-950 mb-3 leading-none">
                {user?.user_metadata?.full_name || 'B2B Partner'}
            </h3>
            <div className="relative group">
                <span className="absolute left-3 top-3 text-xs">📍</span>
                <input 
                    type="text" 
                    placeholder="Delivery Address..." 
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-white/80 border border-green-100 pl-8 p-3 rounded-xl text-[11px] font-black text-green-900 outline-none focus:border-green-400 focus:bg-white transition-all shadow-sm"
                />
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-green-900 text-white p-3 rounded-xl flex text-[8px] font-black uppercase mb-4">
              <div className="flex-[3]">Description</div>
              <div className="flex-1 text-center">Qty</div>
              <div className="flex-1 text-right">Total</div>
              <div className="w-8"></div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex p-3 border-b border-gray-50 text-[11px] font-bold items-center">
                  <div className="flex-[3] uppercase text-green-950 truncate">{item.name_en}</div>
                  <div className="flex-1 flex justify-center items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="text-gray-400 font-bold px-1">-</button>
                    <span className="bg-gray-100 px-2 py-0.5 rounded italic text-[9px]">{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="text-gray-400 font-bold px-1">+</button>
                  </div>
                  <div className="flex-1 text-right text-green-900 font-black">৳{item.qty * item.active_price}</div>
                  <button onClick={() => removeFromCart(item.id)} className="w-8 text-red-400 text-right font-bold">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-100">
             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payable</p>
             <h2 className="text-4xl md:text-7xl font-black italic text-green-900 leading-none">৳{totalAmount.toLocaleString()}</h2>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t flex flex-col md:flex-row gap-3 absolute bottom-16 md:relative md:bottom-0 left-0 right-0 shadow-2xl">
           <button onClick={handleFinalizeAndSave} disabled={loading} className="w-full md:flex-[2] bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] disabled:opacity-50">
             {loading ? 'SAVING...' : 'CONFIRM B2B ORDER'}
           </button>
           <button onClick={() => window.print()} className="w-full md:flex-1 bg-green-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px]">Print</button>
        </div>
      </div>
    </div>
  );
}