import React from 'react';

const CategoryBar = ({ onCategoryClick }: { onCategoryClick: (cat: string) => void }) => {
  // আপনার ডিমান্ড অনুযায়ী ক্যাটাগরিগুলো
  const categories = [
    { name: 'Vegetable', icon: '🥬' },
    { name: 'Seafood', icon: '🐟' },
    { name: 'Fruits', icon: '🍎' },
    { name: 'Sauce', icon: '🧴' },
  ];

  return (
    <section className="py-6 bg-white border-b">
      <div className="max-w-6xl mx-auto px-2">
        <h3 className="text-center text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-4">
          Select Category to View Products
        </h3>
        
        {/* এখানে grid-cols-4 ব্যবহার করা হয়েছে যাতে ছোট স্ক্রিনেও সব এক লাইনে থাকে */}
        <div className="grid grid-cols-4 gap-2 md:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryClick(cat.name)}
              className="flex flex-col items-center justify-center p-3 md:p-6 bg-gray-50 rounded-2xl hover:bg-green-50 hover:border-green-200 border border-transparent transition-all group active:scale-95"
            >
              <span className="text-2xl md:text-4xl mb-1 md:mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <span className="font-bold text-[10px] md:text-sm text-gray-700 break-words text-center">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryBar;