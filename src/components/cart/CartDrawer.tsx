import { Product } from '@/types/product';
import { useRef, useEffect } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  addItem: (product: any, qty: number) => void;
  removeItem: (id: string) => void;
  userName: string;
  setUserName: (val: string) => void;
  userLocation: string;
  setUserLocation: (val: string) => void;
  onOrder: () => void;
}

const CartDrawer = ({ isOpen, onClose, items, addItem, removeItem, userName, setUserName, userLocation, setUserLocation, onOrder }: CartDrawerProps) => {
  const cartEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) cartEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [items, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-green-800">Your Quotation</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl hover:text-red-500">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {items.length === 0 ? (
            <div className="text-center mt-20 text-gray-400 italic">No items added.</div>
          ) : (
            items.map((item) => {
              const step = item.unit?.toLowerCase().includes('kg') ? 0.25 : 1;
              return (
                <div key={item.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-3">
                  <div className="flex justify-between font-bold">
                    <span>{item.name_en}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-300 hover:text-red-500">✕</button>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2">
                      <button onClick={() => item.quantity > step ? addItem(item, -step) : removeItem(item.id)} className="w-8 h-8 bg-gray-100 rounded hover:bg-red-50">-</button>
                      <span className="w-12 text-center font-bold text-green-800">{item.quantity}</span>
                      <span className="text-[10px] text-gray-400 uppercase">{item.unit}</span>
                      <button onClick={() => addItem(item, step)} className="w-8 h-8 bg-gray-100 rounded hover:bg-green-50">+</button>
                    </div>
                    <span className="font-black text-green-700">৳{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={cartEndRef} />
        </div>

        {items.length > 0 && (
          <div className="mt-6 border-t pt-6 space-y-4 bg-white">
            <input placeholder="Your Name" className="w-full p-3 rounded-xl border bg-gray-50 focus:border-green-500 outline-none" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <input placeholder="Location" className="w-full p-3 rounded-xl border bg-gray-50 focus:border-green-500 outline-none" value={userLocation} onChange={(e) => setUserLocation(e.target.value)} />
            <div className="flex justify-between text-2xl font-black text-green-700">
              <span>Total:</span>
              <span>৳{items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}</span>
            </div>
            <button onClick={onOrder} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-green-700 active:scale-95 transition-all">
              Send to WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;