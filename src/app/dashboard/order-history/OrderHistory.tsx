'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/sections/context/AuthContext';

interface Product {
  id: string;
  name_en: string;
  price: number;
  b2b_price: number;
  unit: string;
  current_stock: number;
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // POS / Create Invoice States
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [posTab, setPosTab] = useState<'inventory' | 'billing'>('inventory');
  const [customerAddress, setCustomerAddress] = useState('');

  // ১. ইনভয়েস ফেচ করা (স্মার্ট ফিল্টারিং: ইউজার আইডি অথবা ইউজার নেম/ইমেইল দিয়ে ম্যাচ করা)
  const fetchInvoices = async () => {
    if (!user) {
      setLoading(false);
      setInvoices([]);
      return;
    }

    setLoading(true);

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0];

    // সুপাবেস থেকে বর্তমান ইউজারের id অথবা নাম দিয়ে ফিল্টার করা
    let query = supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (user.id) {
      // যদি customer_id অথবা customer_name ম্যাচ করে
      if (userName) {
        query = query.or(`customer_id.eq.${user.id},customer_name.ilike.%${userName}%`);
      } else {
        query = query.eq('customer_id', user.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database Connection Error:", error.message);
    } else if (data) {
      setInvoices(data);
    }
    setLoading(false);
  };

  // ২. ইনভেন্টরি ও ইউজারের ঠিকানা লোড করা (POSModal খোলার সময়)
  const loadPOSData = async () => {
    if (!user) return;

    // প্রোডাক্টস লোড
    const { data: prodData } = await supabase
      .from('products')
      .select('*')
      .order('name_en', { ascending: true });
    if (prodData) setProducts(prodData);

    // আগের অর্ডারের ঠিকানা অটো-লোড
    const { data: lastInvoice } = await supabase
      .from('invoices')
      .select('customer_address')
      .eq('customer_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (lastInvoice?.customer_address) {
      setCustomerAddress(lastInvoice.customer_address);
    } else if (user?.user_metadata?.address) {
      setCustomerAddress(user.user_metadata.address);
    }
  };

  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  const handleOpenCreateInvoice = () => {
    setIsModalOpen(true);
    loadPOSData();
  };

  // Cart Functions
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

  // Finalize B2B Order
  const handleFinalizeAndSave = async () => {
    if (cart.length === 0) return alert("Please add items to your invoice!");
    if (!customerAddress.trim()) return alert("দয়া করে ডেলিভারি ঠিকানা দিন!");

    setSavingInvoice(true);

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
          customer_id: user?.id || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (invError) throw invError;

      // ২. ইনভয়েস আইটেম এবং স্টক আপডেট
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

      // ৩. ইউজারের প্রোফাইলে total_spending আপডেট
      if (user?.id) {
        const { data: currentProfile } = await supabase
          .from('profiles')
          .select('total_spending')
          .eq('id', user.id)
          .maybeSingle();

        const prevSpending = Number(currentProfile?.total_spending || 0);
        await supabase
          .from('profiles')
          .update({ total_spending: prevSpending + totalAmount })
          .eq('id', user.id);
      }

      alert(`অর্ডার সফল হয়েছে! ইনভয়েস নম্বর: ${invoiceNo}`);
      setCart([]);
      setIsModalOpen(false);
      await fetchInvoices(); 

    } catch (error: any) {
      console.error(error);
      alert("সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setSavingInvoice(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* FAST INVOICE ENTRY BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-green-500/5 border border-green-500/10 p-6 rounded-[25px] md:rounded-[35px] gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-lg font-black uppercase text-green-500 leading-none mb-1">Fast Invoice Entry</h3>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">Sync with SeaLand ERP System</p>
        </div>
        <button 
          onClick={handleOpenCreateInvoice}
          className="w-full md:w-auto px-10 py-4 bg-green-500 text-black rounded-xl md:rounded-full font-black text-xs uppercase hover:scale-105 transition-all shadow-lg shadow-green-500/20"
        >
          + Create Invoice
        </button>
      </div>

      {/* POS CREATE INVOICE FULL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 md:p-6 overflow-hidden">
          
          {/* Modal Header */}
          <div className="flex justify-between items-center p-3 bg-[#111] rounded-2xl border border-white/10 mb-3">
            <h2 className="text-green-500 font-black italic uppercase text-sm md:text-lg tracking-tighter">
              B2B POS & Billing Console
            </h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-black uppercase transition-all"
            >
              Close [✕]
            </button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 bg-black text-white overflow-hidden rounded-[25px] border border-white/10">
            
            {/* মোবাইল নেভিগেশন */}
            <div className="md:hidden bg-[#111] border-b border-white/10 flex justify-around p-2">
              <button onClick={() => setPosTab('inventory')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${posTab === 'inventory' ? 'bg-green-500 text-black' : 'text-gray-400'}`}>
                📦 Stock List
              </button>
              <button onClick={() => setPosTab('billing')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase relative ${posTab === 'billing' ? 'bg-green-500 text-black' : 'text-gray-400'}`}>
                📄 Cart/Bill {cart.length > 0 && `(${cart.length})`}
              </button>
            </div>

            {/* বাম পাশ: Inventory */}
            <div className={`${posTab === 'inventory' ? 'flex' : 'hidden'} md:flex md:w-1/3 border-r border-white/10 flex-col p-4 bg-[#0A0A0A] h-full`}>
              <h3 className="text-gray-400 font-bold uppercase text-[10px] mb-3 tracking-widest">Select Items</h3>
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-green-500 text-xs mb-4 text-white" 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar pr-1">
                {products.filter(p => p.name_en?.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                  <div key={product.id} className="bg-white/5 p-3 rounded-2xl flex justify-between items-center border border-white/5 hover:bg-white/10 transition-all">
                    <div className="flex-1">
                      <p className="text-[11px] font-black uppercase text-gray-300">{product.name_en}</p>
                      <p className="text-green-400 font-black text-xs">৳{product.b2b_price || product.price}</p>
                    </div>
                    <button onClick={() => addToCart(product)} className="bg-green-600 hover:bg-green-500 text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold text-lg">+</button>
                  </div>
                ))}
              </div>
            </div>

            {/* ডান পাশ: Billing Receipt */}
            <div className={`${posTab === 'billing' ? 'flex' : 'hidden'} md:flex flex-1 bg-white flex-col m-1 md:m-3 rounded-[25px] overflow-hidden text-black h-full`}>
              <div className="p-4 md:p-8 flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-black italic text-green-900 uppercase">Sealand Agro</h1>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">A Commitment to Freshness</p>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-[9px] font-black text-green-900">{new Date().toLocaleDateString('en-GB')}</div>
                </div>

                <div className="bg-green-50/50 p-3 rounded-2xl mb-4 border border-green-100/50">
                  <p className="text-[8px] uppercase font-black text-green-600 mb-1 tracking-widest">Customer Details:</p>
                  <h3 className="font-black text-xs md:text-lg uppercase italic text-green-950 mb-2 leading-none">
                    {user?.user_metadata?.full_name || 'B2B Partner'}
                  </h3>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs">📍</span>
                    <input 
                      type="text" 
                      placeholder="Delivery Address..." 
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-white/80 border border-green-100 pl-8 p-2 rounded-xl text-[11px] font-black text-green-900 outline-none focus:border-green-400 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="bg-green-900 text-white p-2.5 rounded-xl flex text-[8px] font-black uppercase mb-3">
                    <div className="flex-[3]">Description</div>
                    <div className="flex-1 text-center">Qty</div>
                    <div className="flex-1 text-right">Total</div>
                    <div className="w-6"></div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
                    {cart.map((item) => (
                      <div key={item.id} className="flex p-2 border-b border-gray-100 text-[10px] font-bold items-center">
                        <div className="flex-[3] uppercase text-green-950 truncate">{item.name_en}</div>
                        <div className="flex-1 flex justify-center items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="text-gray-400 font-bold px-1">-</button>
                          <span className="bg-gray-100 px-2 py-0.5 rounded italic text-[9px]">{item.qty}</span>
                          <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="text-gray-400 font-bold px-1">+</button>
                        </div>
                        <div className="flex-1 text-right text-green-900 font-black">৳{item.qty * item.active_price}</div>
                        <button onClick={() => removeFromCart(item.id)} className="w-6 text-red-400 text-right font-bold">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-100">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payable</p>
                  <h2 className="text-3xl md:text-5xl font-black italic text-green-900 leading-none">৳{totalAmount.toLocaleString()}</h2>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border-t flex gap-2">
                <button 
                  onClick={handleFinalizeAndSave} 
                  disabled={savingInvoice} 
                  className="flex-[2] bg-black text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 disabled:opacity-50"
                >
                  {savingInvoice ? 'SAVING...' : 'CONFIRM B2B ORDER'}
                </button>
                <button onClick={() => window.print()} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px]">Print</button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* INVOICES LIST TABLE */}
      <div className="overflow-x-auto border border-white/5 rounded-[25px] bg-white/[0.01]">
        {loading ? (
          <div className="p-10 text-center text-gray-500 text-[10px] uppercase tracking-widest">
            Syncing with SeaLand ERP...
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-10 text-center text-gray-500 text-[10px] uppercase tracking-widest leading-loose">
            No records found for your account. <br/>
            <span className="text-[8px] opacity-50">Click "+ CREATE INVOICE" above to add your first entry.</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-[9px] uppercase font-black tracking-widest text-gray-500 border-b border-white/5">
              <tr>
                <th className="p-5 md:p-6 whitespace-nowrap">Invoice No.</th>
                <th className="p-5 md:p-6">Customer / Outlet</th>
                <th className="p-5 md:p-6">Total Amount</th>
                <th className="p-5 md:p-6">Status</th>
                <th className="p-5 md:p-6">Date</th>
              </tr>
            </thead>
            <tbody className="text-[12px] font-medium">
              {invoices.map((item) => (
                <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-5 md:p-6 font-mono text-gray-300">
                    {item.invoice_number || `#INV-${item.id}`}
                  </td>
                  <td className="p-5 md:p-6 font-bold text-white">
                    {item.customer_name || 'N/A'}
                  </td>
                  <td className="p-5 md:p-6 font-black text-green-500">
                    ৳{Number(item.total_amount || 0).toLocaleString()}
                  </td>
                  <td className="p-5 md:p-6">
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter border ${
                      item.status?.toLowerCase() === 'paid' 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                    }`}>
                      {item.status || 'pending'}
                    </span>
                  </td>
                  <td className="p-5 md:p-6 text-[10px] text-gray-500">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}