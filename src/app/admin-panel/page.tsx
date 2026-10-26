'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState<'partners' | 'orders'>('partners');
  const [loading, setLoading] = useState(true);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      setCurrentUserEmail(user.email || null);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || (profile?.role !== 'admin' && profile?.role !== 'staff')) {
        alert("Unauthorized Access! শুধুমাত্র এডমিনরা এখানে প্রবেশ করতে পারবেন।");
        router.push('/');
        return;
      }

      // ১. বিটুবি পার্টনারশিপ রিকোয়েস্ট ফেচ করা
      const { data: reqData } = await supabase
        .from('b2b_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      setRequests(reqData || []);

      // ২. সব অর্ডার বা ইনভয়েস ফেচ করা (স্ট্যাটাস ম্যানেজমেন্টের জন্য)
      const { data: invData } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      setInvoices(invData || []);
      setLoading(false);
    };

    checkAdminAndFetch();
  }, [router]);

  const handleApprove = async (email: string, name: string) => {
    const confirmApprove = confirm(`Are you sure you want to approve ${name} (${email})?`);
    if (!confirmApprove) return;

    const { error } = await supabase.rpc('approve_b2b_request', { target_email: email });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Partner approved successfully!");
      setRequests(requests.filter(req => req.email !== email));
    }
  };

  // অর্ডারের স্ট্যাটাস আপডেট করার ফাংশন (pending, processing, shipped, delivered)
  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    const { error } = await supabase
      .from('invoices')
      .update({ status: newStatus })
      .eq('id', invoiceId);

    if (error) {
      alert("Failed to update status: " + error.message);
    } else {
      setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status: newStatus } : inv));
      alert(`Order status updated to "${newStatus.toUpperCase()}" successfully!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">
              SeaLand <span className="text-green-600">ERP & Admin</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Supply Chain & Order Management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
              <p className="text-xs font-bold text-green-700">{currentUserEmail}</p>
            </div>
            <button 
              onClick={() => router.push('/')}
              className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md"
            >
              ← Back to Shop
            </button>
          </div>
        </header>

        {/* ট্যাব সিলেকশন */}
        <div className="flex gap-3 mb-6">
          <button 
            onClick={() => setActiveAdminTab('partners')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeAdminTab === 'partners' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            👥 B2B Partner Requests ({requests.length})
          </button>
          <button 
            onClick={() => setActiveAdminTab('orders')}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
              activeAdminTab === 'orders' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            📦 B2B Orders & Status Control ({invoices.length})
          </button>
        </div>

        {/* ১. পার্টনার রিকোয়েস্ট ট্যাব */}
        {activeAdminTab === 'partners' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-white">
              <h2 className="text-lg md:text-xl font-black text-gray-800 uppercase tracking-tight">Pending Partnership Requests</h2>
              <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {requests.length} New
              </span>
            </div>

            <div className="max-h-[450px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 md:px-8 py-5">Company & Type</th>
                    <th className="px-6 md:px-8 py-5">Contact Person</th>
                    <th className="px-6 md:px-8 py-5">Email Address</th>
                    <th className="px-6 md:px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-gray-400 font-bold uppercase text-xs">Syncing with database...</td>
                    </tr>
                  ) : requests.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-20 text-center text-gray-300 font-black uppercase tracking-widest text-xs">No pending requests at the moment</td>
                    </tr>
                  ) : (
                    requests.map((req) => (
                      <tr key={req.id} className="hover:bg-green-50/30 transition-all">
                        <td className="px-6 md:px-8 py-5">
                          <p className="font-black text-gray-800 uppercase text-sm">{req.company_name}</p>
                          <span className="inline-block mt-1 text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-black uppercase">
                            {req.business_type}
                          </span>
                        </td>
                        <td className="px-6 md:px-8 py-5">
                          <p className="font-bold text-gray-700 text-sm">{req.contact_person}</p>
                          <p className="text-[10px] text-gray-400">{req.phone}</p>
                        </td>
                        <td className="px-6 md:px-8 py-5 font-medium text-gray-500 text-sm">{req.email}</td>
                        <td className="px-6 md:px-8 py-5 text-right">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => handleApprove(req.email, req.company_name)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md"
                            >
                              Approve
                            </button>
                            <a 
                              href={`https://wa.me/${req.phone?.replace(/[^0-9]/g, '')}?text=Hello ${req.contact_person}, your B2B partnership request for ${req.company_name} has been approved!`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-900 hover:bg-black text-white px-3 py-2 rounded-xl font-black text-[10px] uppercase"
                            >
                              💬 WA
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ২. অর্ডার ও স্ট্যাটাস ম্যানেজমেন্ট ট্যাব (কার্ডের ভেতরে স্ক্রলযোগ্য টেবিল) */}
        {activeAdminTab === 'orders' && (
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-white">
              <h2 className="text-lg md:text-xl font-black text-gray-800 uppercase tracking-tight">B2B Orders & Status Control</h2>
              <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {invoices.length} Total Orders
              </span>
            </div>

            {/* কার্ডের ভেতরে ডেটা স্ক্রল করার জন্য max-height ও overflow-y-auto দেওয়া হয়েছে */}
            <div className="max-h-[480px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 md:px-8 py-5">Invoice No</th>
                    <th className="px-6 md:px-8 py-5">Customer / Outlet</th>
                    <th className="px-6 md:px-8 py-5">Amount</th>
                    <th className="px-6 md:px-8 py-5">Current Status</th>
                    <th className="px-6 md:px-8 py-5 text-right">Change Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-medium">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase">No orders found.</td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/50 transition-all">
                        <td className="px-6 md:px-8 py-5 font-mono font-bold text-gray-700">{inv.invoice_number}</td>
                        <td className="px-6 md:px-8 py-5 font-bold text-gray-900">{inv.customer_name}</td>
                        <td className="px-6 md:px-8 py-5 font-black text-green-600">৳{Number(inv.total_amount || 0).toLocaleString()}</td>
                        <td className="px-6 md:px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${
                            inv.status?.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-800 border-green-200' :
                            inv.status?.toLowerCase() === 'shipped' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                            inv.status?.toLowerCase() === 'processing' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            {inv.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-6 md:px-8 py-5 text-right">
                          <select 
                            value={inv.status || 'pending'}
                            onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                            className="bg-gray-100 border border-gray-200 text-gray-800 text-[10px] font-black uppercase tracking-wider p-2 rounded-xl outline-none focus:border-green-500 cursor-pointer"
                          >
                            <option value="pending">Pending (Editable)</option>
                            <option value="processing">Processing (Locked)</option>
                            <option value="shipped">Shipped (Locked)</option>
                            <option value="delivered">Delivered (Locked)</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}