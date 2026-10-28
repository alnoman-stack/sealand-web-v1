import React from 'react';

export default function PrintablePriceList({ items, date }: { items: any[], date: string }) {
  return (
    <div className="hidden print:block bg-white text-black p-8 font-sans">
      {/* হেডার */}
      <div className="text-center border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider">SeaLand Agro</h1>
        <p className="text-xs italic text-gray-600">A commitment to freshness</p>
        <p className="text-sm font-bold mt-2">{date} তারিখের মূল্য তালিকা</p>
      </div>

      {/* টেবিল */}
      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr className="bg-gray-100 border-b border-black text-left">
            <th className="border border-black p-2 w-12 text-center">SI.No</th>
            <th className="border border-black p-2">Items Description</th>
            <th className="border border-black p-2 w-24 text-right">Price</th>
            <th className="border border-black p-2 w-20 text-center">Per</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-300">
              <td className="border border-black p-1.5 text-center font-mono">{String(index + 1).padStart(2, '0')}</td>
              <td className="border border-black p-1.5 font-medium">{item.name_en}</td>
              <td className="border border-black p-1.5 text-right font-bold">
                {item.current_stock === 0 ? 'Stock Out' : `৳${item.b2b_price || item.price}`}
              </td>
              <td className="border border-black p-1.5 text-center uppercase">{item.unit || 'KG'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ফুটার */}
      <div className="mt-8 text-center text-[10px] border-t border-black pt-4 space-y-1">
        <p>www.facebook.com/sealandagro.com | www.sealandagro.com</p>
        <p>HOUSE # 3, ROAD NOBINAGAR # 16, DHAKA UDDAYAN, MOHAMMADPUR, DHAKA</p>
        <p>CELL: 01714-114396, E-mail: sealandagro@gmail.com</p>
      </div>
    </div>
  );
}