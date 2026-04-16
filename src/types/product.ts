export interface Product {
  id: number;
  name_en: string;
  price: number;
  unit: string;
  is_out_of_stock: boolean | null;
  category: string | null;
  current_stock: number;
  image_url: string | null; // এই লাইনটি যোগ করুন
}