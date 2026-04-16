// src/components/sections/B2BSection.tsx
export default function B2BSection() {
  return (
    <section className="bg-gray-900 text-white py-20 px-6 rounded-[3rem] my-10 mx-4 overflow-hidden relative">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-black mb-6">Partner with <span className="text-green-500">SeaLand Agro</span></h2>
        <p className="text-gray-400 text-lg mb-10">
          Supplying premium vegetables, seafood, and fruits to Bangladesh's leading resorts, hotels, and hospitals.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h4 className="font-bold text-green-500 mb-2">Bulk Pricing</h4>
            <p className="text-sm text-gray-400">Customized rates for large volume orders.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h4 className="font-bold text-green-500 mb-2">Quality Control</h4>
            <p className="text-sm text-gray-400">Strict hygiene and freshness standards.</p>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h4 className="font-bold text-green-500 mb-2">Priority Delivery</h4>
            <p className="text-sm text-gray-400">Scheduled early morning delivery to your location.</p>
          </div>
        </div>

        <button className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-full font-bold text-xl transition-all shadow-xl shadow-green-600/20">
          Become a Partner
        </button>
      </div>
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-600/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-600/5 blur-[100px] rounded-full"></div>
    </section>
  );
}