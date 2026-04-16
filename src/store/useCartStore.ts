import { create } from 'zustand';
import { Product } from '@/types/product';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, amount: number) => void;
  setQuantity: (productId: string, amount: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  
  addItem: (product, amount) => set((state) => {
    const existingItem = state.items.find((item) => item.id === product.id);
    
    // ইউনিট চেক: kg থাকলে ০.২৫ এর লজিক, না থাকলে (পিস হলে) ১ এর লজিক
    const isKg = product.unit?.toLowerCase().includes('kg');
    const minLimit = isKg ? 0.25 : 1;

    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.max(minLimit, item.quantity + amount) }
            : item
        ),
      };
    }

    // প্রথমবার যুক্ত করার সময় কেজি বা পিস যাই হোক, ১ ইউনিট হিসেবে যোগ হবে
    // কিন্তু মাইনাস করতে করতে কেজি হলে ০.২৫ এবং পিস হলে ১ পর্যন্ত নামা যাবে
    return { 
      items: [...state.items, { ...product, quantity: 1 }] 
    };
  }),

  setQuantity: (productId, amount) => set((state) => ({
    items: state.items.map((item) => {
      if (item.id === productId) {
        const isKg = item.unit?.toLowerCase().includes('kg');
        const minLimit = isKg ? 0.25 : 1;
        return { ...item, quantity: Math.max(minLimit, amount) };
      }
      return item;
    }),
  })),

  removeItem: (productId) => set((state) => ({
    items: state.items.filter((item) => item.id !== productId),
  })),

  clearCart: () => set({ items: [] }),
}));