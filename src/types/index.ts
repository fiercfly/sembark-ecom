export const APP_TYPES = '1.0';

export type Category = {
  id: number;
  name: string;
  image: string;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
};

export type CartItem = Product & {
  quantity: number;
};

export type CartState = {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
};

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

export type FilterParams = {
  categoryId?: number[];
  price_min?: number;
  price_max?: number;
  title?: string;
  sort?: SortOption;
};
