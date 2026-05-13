import type { Product, Category, FilterParams } from '../types';

const BASE_URL = 'https://api.escuelajs.co/api/v1';

export const api = {
  async getProducts(params: FilterParams): Promise<Product[]> {
    const { categoryId, price_min, price_max, title, sort } = params;
    
    if (categoryId && categoryId.length > 0) {
      const fetchPromises = categoryId.map(async (id) => {
        const queryParams = new URLSearchParams();
        queryParams.append('categoryId', id.toString());
        if (price_min) queryParams.append('price_min', price_min.toString());
        if (price_max) queryParams.append('price_max', price_max.toString());
        if (title) queryParams.append('title', title);
        
        const response = await fetch(`${BASE_URL}/products?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
      });
      
      const results = await Promise.all(fetchPromises);
      let products: Product[] = results.filter(r => Array.isArray(r)).flat();
      
      const uniqueProducts = Array.from(new Map(products.map(p => [p.id, p])).values());
      
      return this.sortProducts(uniqueProducts, sort);
    }
    
    const queryParams = new URLSearchParams();
    if (price_min) queryParams.append('price_min', price_min.toString());
    if (price_max) queryParams.append('price_max', price_max.toString());
    if (title) queryParams.append('title', title);
    
    const response = await fetch(`${BASE_URL}/products?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch products');
    const data = await response.json();
    const products: Product[] = Array.isArray(data) ? data : [];
    
    return this.sortProducts(products, sort);
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) throw new Error('Product not found');
    const product: Product = await response.json();
    return {
      ...product,
      images: product.images.map(img => this.cleanImageUrl(img))
    };
  },

  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  },

  sortProducts(products: Product[], sort?: string): Product[] {
    const processed = products.map(p => ({
      ...p,
      images: p.images.map(img => this.cleanImageUrl(img))
    }));

    if (!sort) return processed;
    
    const sorted = [...processed];
    switch (sort) {
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name_asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'name_desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return sorted;
    }
  },

  cleanImageUrl(url: string): string {
    try {
      if (url.startsWith('[') && url.endsWith(']')) {
        const parsed = JSON.parse(url);
        if (Array.isArray(parsed)) return parsed[0];
        return parsed;
      }
      return url;
    } catch {
      return url;
    }
  }
};
