'use client';
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface OverviewProps {
  orders: any[];
  loyaltyPoints: number;
}

export default function Overview({ orders, loyaltyPoints }: OverviewProps) {
  
  // ১. ডাইনামিক চার্ট ডেটা প্রসেসিং (গত ৬ মাস)
  const chartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentMonthIndex = new Date().getMonth();
    
    return months.map((month, index) => {
      const monthTotal = orders
        .filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate.getMonth() === (currentMonthIndex - (5 - index) + 12) % 12;
        })
        .reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      return { name: month, amount: monthTotal };
    });
  }, [orders]);

  // ২. ডাইনামিক লাইফসাইকেল লজিক
  const latestOrder = orders[0];
  const status = latestOrder?.status?.toLowerCase() || 'none';

  const lifecycleSteps = [
    { 
      label: 'Farm Sourcing', 
      status: ['pending', 'processing', 'shipped', 'delivered'].includes(status) ? 'Completed' : 'Pending', 
      color: ['pending', 'processing', 'shipped', 'delivered'].includes(status) ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-white/10' 
    },
    { 
      label: 'Quality Control', 
      status: status === 'processing' ? 'In Progress' : (['shipped', 'delivered'].includes(status) ? 'Completed' : 'Pending'), 
      color: ['processing', 'shipped', 'delivered'].includes(status) ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : (status === 'pending' ? 'bg-yellow-500 shadow-[0_0_15px_#eab308]' : 'bg-white/10') 
    },
    { 
      label: 'Cold Transit', 
      status: status === 'shipped' ? 'In Progress' : (status === 'delivered' ? 'Completed' : 'Pending'), 
      color: status === 'delivered' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : (status === 'shipped' ? 'bg-yellow-500 shadow-[0_0_15px_#eab308]' : 'bg-white/10') 
    },
  ];

  const totalSpending = orders.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* ৩টি মেইন স্ট্যাট কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-8 rounded-[40px] relative overflow-hidden group hover:border-green-500/30 transition-all duration-500">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all"></div>
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-3">Total Spending</p>
          <h3 className="text-4xl font-black italic text-white tracking-tighter">৳{totalSpending.toLocaleString()}</h3>
          <p className="text-[9px] text-green-500 mt-3 font-bold uppercase flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> 
            Verified Procurement
          </p>
        </div>

        <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 p-8 rounded-[40px] relative overflow-hidden group hover:border-green-500/30 transition-all duration-500">
          <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-3">Loyalty Points</p>
          <h3 className="text-4xl font-black text-green-500 italic tracking-tighter">{loyaltyPoints}</h3>
          <p className="text-[9px] text-gray-500 mt-3 font-bold uppercase tracking-widest">Partner Status: Gold</p>
        </div>

        <div className="bg-green-500 p-8 rounded-[40px] relative overflow-hidden group shadow-[0_20px_50px_rgba(34,197,94,0.2)] hover:scale-[1.02] transition-all duration-500">
          <div className="absolute top-0 right-0 p-6 opacity-20 rotate-12 group-hover:rotate-0 transition-transform">
             <span className="text-5xl font-black italic">⚡</span>
          </div>
          <p className="text-black/60 text-[10px] uppercase font-black tracking-[0.2em] mb-3">Active Savings</p>
          <h3 className="text-3xl font-black italic leading-tight text-black tracking-tighter">15% Seasonal<br />Benefit</h3>
          <p className="text-[9px] text-black/80 mt-3 font-bold uppercase italic">On High-Yield Crops</p>
        </div>
      </div>

      {/* গ্রাফ ও লাইফসাইকেল গ্রিড */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* স্পেন্ডিং গ্রাফ কার্ড */}
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[45px] backdrop-blur-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <div>
               <h4 className="text-[10px] font-black uppercase tracking-[0.3em] italic text-gray-500">Spending Trajectory</h4>
               <p className="text-[8px] text-gray-600 font-bold uppercase mt-1">Real-time analysis</p>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Live Feed</span>
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            </div>
            
          </div>
          
          {/* চার্ট কন্টেইনার - ফিক্সড হাইট এরর সমাধান */}
          <div style={{ height: '300px', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="90%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }}
                  dy={10}
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  cursor={{ stroke: '#22c55e', strokeWidth: 1, strokeDasharray: '5 5' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl">
                          <p className="text-[10px] font-black text-gray-500 uppercase mb-1">{payload[0].payload.name}</p>
                          <p className="text-xl font-black text-green-500 italic">৳{payload[0].value?.toLocaleString()}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#22c55e" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorAmt)"
                  animationDuration={2500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* লাইফসাইকেল ট্র্যাকার কার্ড */}
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[45px] flex flex-col justify-between backdrop-blur-sm">
          <div>
            <div className="flex justify-between items-center mb-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] italic text-gray-500">Fulfillment Lifecycle</h4>
              <span className="text-[8px] bg-white/5 px-2 py-1 rounded-md font-bold text-gray-400 uppercase tracking-tighter">Order Sync: Active</span>
            </div>
            
            <div className="space-y-8 relative">
              {/* প্রগ্রেস লাইন */}
              <div className="absolute left-[5px] top-2 bottom-2 w-[1px] bg-white/5 ml-[0.25rem]"></div>
              
              {lifecycleSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-6 relative z-10 group/item">
                  <div className={`h-3 w-3 rounded-full ${step.color} transition-all duration-1000 group-hover/item:scale-125`}></div>
                  <div className="flex-grow">
                    <p className="text-[11px] font-black uppercase italic leading-none text-white tracking-widest group-hover/item:text-green-500 transition-colors">{step.label}</p>
                    <p className="text-[9px] text-gray-500 mt-2 uppercase font-bold tracking-[0.1em]">{step.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="w-full mt-12 py-5 bg-white/5 border border-white/10 rounded-[25px] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500 shadow-xl group overflow-hidden relative">
             <div className="absolute inset-0 bg-green-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
             <span className="relative z-10 flex items-center justify-center gap-2 transition-colors duration-500 group-hover:text-black">
               {latestOrder ? `TRK: ${latestOrder.id.slice(0,8).toUpperCase()}` : 'NO ACTIVE SESSIONS'}
               <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
             </span>
          </button>
        </div>
      </div>
    </div>
  );
}