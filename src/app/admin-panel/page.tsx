'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<any[]>([]);
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

      const { data, error } = await supabase
        .from('b2b_requests')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (!error) setRequests(data || []);
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">
              SeaLand <span className="text-green-600">Admin</span>
            </h1>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Partnership Management</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Logged in as</p>
            <p className="text-xs font-bold text-green-700">{currentUserEmail}</p>
          </div>
        </header>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Pending Requests</h2>
            <div className="flex items-center gap-2">
               <span className="h-2 w-2 bg-green-500 rounded-full animate-ping"></span>
               <span className="bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                {requests.length} New
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">Company & Type</th>
                  <th className="px-8 py-5">Contact Person</th>
                  <th className="px-8 py-5">Email Address</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-green-500"></div>
                        <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Syncing with database...</p>
                      </div>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <p className="text-gray-300 font-black uppercase tracking-widest text-sm">No pending requests at the moment</p>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-green-50/30 transition-all duration-300 group">
                      <td className="px-8 py-6">
                        <p className="font-black text-gray-800 uppercase text-sm group-hover:text-green-700 transition-colors">{req.company_name}</p>
                        <span className="inline-block mt-1 text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter">
                          {req.business_type}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-700 text-sm">{req.contact_person}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{req.phone}</p>
                      </td>
                      <td className="px-8 py-6 font-medium text-gray-500 text-sm">{req.email}</td>
                      <td className="px-8 py-6">
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleApprove(req.email, req.company_name)}
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-green-600/20 active:scale-95"
                          >
                            Approve
                          </button>
                          <a 
                            href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}?text=Hello ${req.contact_person}, your B2B partnership request for ${req.company_name} has been approved by SeaLand Agro!`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase transition-all flex items-center gap-2 shadow-lg shadow-gray-900/10 active:scale-95"
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
        
        <footer className="mt-10 text-center">
          <button 
            onClick={() => router.push('/')}
            className="text-[10px] font-black uppercase text-gray-400 hover:text-green-600 tracking-[0.3em] transition-all"
          >
            ← Back to Main Website
          </button>
        </footer>
      </div>
    </div>
  );
}