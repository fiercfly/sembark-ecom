import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Product, FilterParams, SortOption } from '../types';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/Home.css';

const Home: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('title') || '');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: FilterParams = {
          categoryId: searchParams.getAll('categoryId').map(Number),
          price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
          price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
          title: searchParams.get('title') || undefined,
          sort: (searchParams.get('sort') as SortOption) || undefined,
        };

        const data = await api.getProducts(params);
        setProducts(data);
      } catch (err) {
        setError('Unable to load products. Please check your connection.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm) {
      newParams.set('title', searchTerm);
    } else {
      newParams.delete('title');
    }
    setSearchParams(newParams);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  return (
    <div className="home-page container">
      <header className="home-header">
        <div className="header-info">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gradient"
          >
            Curated Collections
          </motion.h1>
          <p>Discover high-quality electronics and lifestyle essentials.</p>
        </div>

        <div className="header-actions">
          <form onSubmit={handleSearch} className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="submit" className="search-btn-icon" aria-label="Submit search">
                <ArrowRight size={18} />
              </button>
            )}
          </form>

          <button 
            className="btn-filter-mobile mobile-only"
            onClick={() => setIsSidebarOpen(true)}
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>
      </header>

      <div className="home-content">
        <FilterSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />

        <div className="main-content">
          {loading ? (
            <div className="status-container">
              <div className="loader"></div>
            </div>
          ) : error ? (
            <div className="status-container error">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="btn btn-outline mt-4">Try Again</button>
            </div>
          ) : products.length === 0 ? (
            <div className="status-container empty">
              <h3>No products found</h3>
              <p>Try adjusting your filters or search term.</p>
              <button onClick={() => setSearchParams(new URLSearchParams())} className="btn btn-primary mt-4">Clear all filters</button>
            </div>
          ) : (
            <motion.div 
              className="product-grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
