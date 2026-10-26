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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); 
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [posTab, setPosTab] = useState<'inventory' | 'billing'>('inventory');
  const [customerAddress, setCustomerAddress] = useState('');

  // সংখ্যাকে কথায় রূপান্তর করার ছোট ফাংশন
  const numberToWords = (num: number): string => {
    if (isNaN(num) || num === 0) return 'Zero Taka Only';
    return `${num.toLocaleString()} Taka Only`;
  };

  const fetchInvoices = async () => {
    if (!user) {
      setLoading(false);
      setInvoices([]);
      return;
    }

    setLoading(true);
    const userName = user.user_metadata?.full_name || user.email?.split('@')[0];

    let query = supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (user.id) {
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
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const currentMonthInvoices = data.filter((item: any) => {
        if (!item.created_at) return false;
        const invDate = new Date(item.created_at);
        return invDate.getFullYear() === currentYear && invDate.getMonth() === currentMonth;
      });

      setInvoices(currentMonthInvoices);
    }
    setLoading(false);
  };

  const handleViewDetails = async (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
    setLoadingDetails(true);

    const { data, error } = await supabase
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoice.id);

    if (data && !error) {
      setInvoiceItems(data);
    } else {
      setInvoiceItems([]);
    }
    setLoadingDetails(false);
  };

  const loadPOSData = async () => {
    if (!user) return;

    const { data: prodData } = await supabase
      .from('products')
      .select('*')
      .order('name_en', { ascending: true });
    if (prodData) setProducts(prodData);

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
    if (isNaN(newQty) || newQty < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalAmount = cart.reduce((acc, item) => acc + (item.active_price * (Number(item.qty) || 0)), 0);

  const handleFinalizeAndSave = async () => {
    if (cart.length === 0) return alert("Please add items to your invoice!");
    if (!customerAddress.trim()) return alert("দয়া করে ডেলিভারি ঠিকানা দিন!");

    setSavingInvoice(true);

    try {
      const invoiceNo = `INV-${Math.floor(100000 + Math.random() * 900000)}`;

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
      
      {/* INVOICES LIST TABLE */}
      <div className="border border-white/5 rounded-[20px] sm:rounded-[25px] bg-white/[0.01] overflow-hidden">
        {loading ? (
          <div className="p-8 sm:p-10 text-center text-gray-500 text-[10px] uppercase tracking-widest">
            Syncing with SeaLand ERP...
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-8 sm:p-10 text-center text-gray-500 text-[10px] uppercase tracking-widest leading-loose">
            No records found for the current month. <br/>
            <span className="text-[8px] opacity-50">Click "+ CREATE INVOICE" above to add your first entry.</span>
          </div>
        ) : (
          <div className="max-h-[300px] overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <table className="w-full text-left border-collapse min-w-[600px] sm:min-w-full">
              <thead className="bg-white/5 text-[8px] sm:text-[9px] uppercase font-black tracking-widest text-gray-500 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="p-4 sm:p-6 whitespace-nowrap">Invoice No.</th>
                  <th className="p-4 sm:p-6">Customer / Outlet</th>
                  <th className="p-4 sm:p-6">Total Amount</th>
                  <th className="p-4 sm:p-6">Status</th>
                  <th className="p-4 sm:p-6">Date</th>
                  <th className="p-4 sm:p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-[11px] sm:text-[12px] font-medium">
                {invoices.map((item) => (
                  <tr key={item.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-6 font-mono text-gray-300 whitespace-nowrap">
                      {item.invoice_number || `#INV-${item.id}`}
                    </td>
                    <td className="p-4 sm:p-6 font-bold text-white">
                      {item.customer_name || 'N/A'}
                    </td>
                    <td className="p-4 sm:p-6 font-black text-green-500 whitespace-nowrap">
                      ৳{Number(item.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="p-4 sm:p-6">
                      <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[7px] sm:text-[8px] font-black uppercase tracking-tighter border whitespace-nowrap ${
                        item.status?.toLowerCase() === 'paid' 
                          ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                          : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      }`}>
                        {item.status || 'pending'}
                      </span>
                    </td>
                    <td className="p-4 sm:p-6 text-[9px] sm:text-[10px] text-gray-500 whitespace-nowrap">
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 sm:p-6 text-right">
                      <button 
                        onClick={() => handleViewDetails(item)}
                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-green-500 hover:text-black text-white text-[9px] sm:text-[10px] font-black uppercase rounded-xl transition-all whitespace-nowrap"
                      >
                        View / Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ERP EXACT DESIGN INVOICE & DIGITAL SIGNATURE MODAL */}
      {isDetailModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white text-black w-full max-w-3xl rounded-[25px] sm:rounded-[30px] overflow-hidden flex flex-col max-h-[95vh] shadow-2xl">
            
            <div className="p-3 sm:p-4 bg-gray-100 border-b flex justify-between items-center shrink-0">
              <span className="text-[9px] sm:text-[10px] font-black uppercase text-gray-500 tracking-widest">Official ERP Invoice Preview</span>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-black font-black text-sm bg-gray-200 hover:bg-red-500 hover:text-white w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all">✕</button>
            </div>

            <div className="p-5 sm:p-8 md:p-12 overflow-y-auto space-y-6 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-blue-900 pb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-blue-900 uppercase tracking-tighter">SEALAND AGRO</h1>
                  <p className="text-[8px] sm:text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-1">A COMMITMENT TO FRESHNESS!</p>
                  <p className="text-[8px] sm:text-[9px] text-gray-500 mt-0.5">House # 3, Road # Nobinagar 16, Dhaka Uddan, Mohammadpur</p>
                  <p className="text-[8px] sm:text-[9px] text-gray-500">Mobile: +8801714114396 | Email: sealandagro@gmail.com</p>
                </div>
                <div className="text-left sm:text-right">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-widest text-gray-200">INVOICE</h2>
                  <p className="text-[9px] sm:text-[10px] text-gray-500 mt-1">Date: {new Date(selectedInvoice.created_at).toLocaleDateString('en-GB')}</p>
                  <p className="text-xs font-black text-blue-900 mt-0.5"># {selectedInvoice.invoice_number}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">BILL TO:</p>
                  <h3 className="text-sm sm:text-base md:text-xl font-black uppercase text-blue-950">{selectedInvoice.customer_name}</h3>
                </div>
                <div className="sm:text-right">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">CUSTOMER ADDRESS:</p>
                  <p className="text-[10px] sm:text-[11px] font-bold text-gray-700 max-w-xs">{selectedInvoice.customer_address || 'Dhaka, Bangladesh'}</p>
                </div>
              </div>

              <div>
                <div className="bg-blue-900 text-white p-2.5 sm:p-3 rounded-none flex text-[8px] sm:text-[9px] font-black uppercase">
                  <div className="w-10 sm:w-12 text-center">SL</div>
                  <div className="flex-[3]">PRODUCT DESCRIPTION</div>
                  <div className="flex-1 text-center">QTY</div>
                  <div className="flex-1 text-right">UNIT PRICE</div>
                  <div className="flex-1 text-right">TOTAL</div>
                </div>

                <div className="max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {loadingDetails ? (
                    <p className="text-center py-6 text-xs font-mono text-gray-400">Loading items...</p>
                  ) : invoiceItems.length === 0 ? (
                    <p className="text-center py-6 text-xs font-mono text-gray-400">No items found.</p>
                  ) : (
                    invoiceItems.map((prod, i) => (
                      <div key={i} className="flex p-2.5 sm:p-3 border-b border-gray-100 text-[10px] sm:text-[11px] font-bold items-center">
                        <div className="w-10 sm:w-12 text-center text-gray-500 font-mono">{i + 1}</div>
                        <div className="flex-[3] uppercase text-gray-900 truncate pr-2">{prod.product_name}</div>
                        <div className="flex-1 text-center font-mono">{prod.qty}</div>
                        <div className="flex-1 text-right text-gray-600 font-mono">{prod.unit_price} TK</div>
                        <div className="flex-1 text-right text-blue-950 font-black">{prod.total} TK</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-6 border-t-2 border-gray-100 flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="w-full md:w-2/3 bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2">
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">In Words:</p>
                  <p className="text-xs font-bold italic text-gray-800">
                    {numberToWords(Number(selectedInvoice.total_amount || 0))}
                  </p>
                </div>

                <div className="w-full md:w-1/3 text-right space-y-4">
                  <div>
                    <p className="text-[8px] sm:text-[9px] font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
                    <h2 className="text-3xl sm:text-4xl font-black italic text-blue-900 leading-none mt-1">
                      {Number(selectedInvoice.total_amount || 0).toLocaleString()} <span className="text-xs sm:text-sm not-italic">TK</span>
                    </h2>
                  </div>

                  <div className="pt-4 sm:pt-6 flex flex-col items-end">
                    <div className="w-32 sm:w-36 border-b border-dashed border-gray-400 pb-1 mb-1 text-center">
                      <span className="font-serif italic text-blue-950 font-bold text-xs sm:text-sm tracking-widest">Abdullah Al Noman</span>
                    </div>
                    <p className="text-[7px] sm:text-[8px] font-black text-gray-500 uppercase tracking-widest">Authorized Signature</p>
                    <p className="text-[7px] text-green-600 font-bold mt-0.5">✔ Digitally Verified by SeaLand ERP</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="p-3 sm:p-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-3 shrink-0">
              <button 
                onClick={() => window.print()} 
                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl font-black uppercase text-[10px] sm:text-xs transition-all shadow-md text-center"
              >
                🖨️ Print / Download Official Invoice
              </button>
              <button 
                onClick={() => setIsDetailModalOpen(false)} 
                className="px-6 bg-gray-200 hover:bg-gray-300 text-black py-3 rounded-xl font-black uppercase text-[10px] sm:text-xs text-center"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="flex justify-between items-center p-3 bg-[#111] rounded-2xl border border-white/10 mb-3 shrink-0">
            <h2 className="text-green-500 font-black italic uppercase text-xs sm:text-sm md:text-lg tracking-tighter">
              B2B POS & Billing Console
            </h2>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all"
            >
              Close [✕]
            </button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 bg-black text-white overflow-hidden rounded-[20px] sm:rounded-[25px] border border-white/10 h-[calc(100vh-100px)]">
            
            <div className="md:hidden bg-[#111] border-b border-white/10 flex justify-around p-2 shrink-0">
              <button onClick={() => setPosTab('inventory')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase ${posTab === 'inventory' ? 'bg-green-500 text-black' : 'text-gray-400'}`}>
                📦 Stock List
              </button>
              <button onClick={() => setPosTab('billing')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase relative ${posTab === 'billing' ? 'bg-green-500 text-black' : 'text-gray-400'}`}>
                📄 Cart/Bill {cart.length > 0 && `(${cart.length})`}
              </button>
            </div>

            <div className={`${posTab === 'inventory' ? 'flex' : 'hidden'} md:flex md:w-1/3 border-r border-white/10 flex-col p-4 bg-[#0A0A0A] h-full overflow-hidden`}>
              <h3 className="text-gray-400 font-bold uppercase text-[10px] mb-3 tracking-widest shrink-0">Select Items</h3>
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none focus:border-green-500 text-xs mb-4 text-white shrink-0" 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <div className="flex-1 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pr-1">
                {products.filter(p => p.name_en?.toLowerCase().includes(searchTerm.toLowerCase())).map(product => (
                  <div key={product.id} className="bg-white/5 p-3 rounded-2xl flex justify-between items-center border border-white/5 hover:bg-white/10 transition-all gap-2">
                    <div className="flex-1 truncate">
                      <p className="text-[11px] font-black uppercase text-gray-300 truncate">{product.name_en}</p>
                      <p className="text-green-400 font-black text-xs">৳{product.b2b_price || product.price}</p>
                    </div>
                    <button onClick={() => addToCart(product)} className="bg-green-600 hover:bg-green-500 text-white w-8 h-8 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">+</button>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${posTab === 'billing' ? 'flex' : 'hidden'} md:flex flex-1 bg-white flex-col m-1 md:m-3 rounded-[20px] sm:rounded-[25px] overflow-hidden text-black h-full`}>
              <div className="p-4 md:p-8 flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-start mb-4 shrink-0">
                  <div>
                    <h1 className="text-xl md:text-2xl font-black italic text-green-900 uppercase">Sealand Agro</h1>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">A Commitment to Freshness</p>
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-full text-[9px] font-black text-green-900">{new Date().toLocaleDateString('en-GB')}</div>
                </div>

                <div className="bg-green-50/50 p-3 rounded-2xl mb-4 border border-green-100/50 shrink-0">
                  <p className="text-[8px] uppercase font-black text-green-600 mb-1 tracking-widest">Customer Details:</p>
                  <h3 className="font-black text-xs md:text-lg uppercase italic text-green-950 mb-2 leading-none truncate">
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
                  <div className="bg-green-900 text-white p-2.5 rounded-xl flex text-[8px] font-black uppercase mb-3 shrink-0">
                    <div className="flex-[3]">Description</div>
                    <div className="flex-1 text-center">Qty</div>
                    <div className="flex-1 text-right">Total</div>
                    <div className="w-6"></div>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {cart.map((item) => (
                      <div key={item.id} className="flex p-2 border-b border-gray-100 text-[10px] font-bold items-center gap-2">
                        <div className="flex-[3] uppercase text-green-950 truncate">{item.name_en}</div>
                        <div className="flex-1 flex justify-center items-center gap-1">
                          <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="text-gray-400 font-bold px-1">-</button>
                          <input 
                            type="number" 
                            min="1" 
                            value={item.qty} 
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-10 bg-gray-100 text-center py-0.5 rounded text-[10px] font-black outline-none border border-transparent focus:border-green-500"
                          />
                          <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="text-gray-400 font-bold px-1">+</button>
                        </div>
                        <div className="flex-1 text-right text-green-900 font-black">৳{item.qty * item.active_price}</div>
                        <button onClick={() => removeFromCart(item.id)} className="w-6 text-red-400 text-right font-bold">×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t-2 border-dashed border-gray-100 shrink-0">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payable</p>
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black italic text-green-900 leading-none">৳{totalAmount.toLocaleString()}</h2>
                </div>
              </div>

              <div className="p-3 bg-gray-50 border-t flex flex-col sm:flex-row gap-2 shrink-0">
                <button 
                  onClick={handleFinalizeAndSave} 
                  disabled={savingInvoice} 
                  className="w-full sm:flex-[2] bg-black text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-800 disabled:opacity-50 text-center"
                >
                  {savingInvoice ? 'SAVING...' : 'CONFIRM B2B ORDER'}
                </button>
                <button onClick={() => window.print()} className="w-full sm:flex-1 bg-green-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] text-center">Print</button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}