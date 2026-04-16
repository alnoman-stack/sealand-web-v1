// src/components/sections/Clients.tsx
export default function Clients() {
  return (
    <section className="py-16 bg-white border-b">
      <div className="text-center mb-10">
        <p className="text-gray-400 font-bold tracking-widest uppercase text-xs">Trusted By Industry Leaders</p>
      </div>
      <div className="flex flex-wrap justify-center gap-12 grayscale opacity-60 hover:opacity-100 transition-all cursor-pointer">
        {/* এখানে লোগোগুলো বসবে */}
        <span className="text-2xl font-bold text-gray-800 italic">Bhawal Resort</span>
        <span className="text-2xl font-bold text-gray-800 italic">Sara Resort</span>
        <span className="text-2xl font-bold text-gray-800 italic">Dera Resort</span>
        <span className="text-2xl font-bold text-gray-800 italic">Care Hospital</span>
      </div>
    </section>
  );
}