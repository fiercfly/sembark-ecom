import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Category } from '../types';
import { X } from 'lucide-react';
import '../styles/FilterSidebar.css';

const FilterSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const selectedCategories = searchParams.getAll('categoryId').map(Number);
  const currentSort = searchParams.get('sort') || '';
  
  const [localMin, setLocalMin] = useState(searchParams.get('price_min') || '');
  const [localMax, setLocalMax] = useState(searchParams.get('price_max') || '');

  useEffect(() => {
    setLocalMin(searchParams.get('price_min') || '');
    setLocalMax(searchParams.get('price_max') || '');
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      let changed = false;

      const urlMin = searchParams.get('price_min') || '';
      const urlMax = searchParams.get('price_max') || '';

      if (localMin !== urlMin) {
        if (localMin) newParams.set('price_min', localMin);
        else newParams.delete('price_min');
        changed = true;
      }

      if (localMax !== urlMax) {
        if (localMax) newParams.set('price_max', localMax);
        else newParams.delete('price_max');
        changed = true;
      }

      if (changed) {
        setSearchParams(newParams);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [localMin, localMax, setSearchParams]); // Removed searchParams from deps to prevent re-runs on every change

  const handleCategoryChange = (categoryId: number) => {
    const newSelected = [...selectedCategories];
    const index = newSelected.indexOf(categoryId);
    
    if (index > -1) {
      newSelected.splice(index, 1);
    } else {
      newSelected.push(categoryId);
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.delete('categoryId');
    newSelected.forEach(id => newParams.append('categoryId', id.toString()));
    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set('sort', e.target.value);
    } else {
      newParams.delete('sort');
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setLocalMin('');
    setLocalMax('');
    setSearchParams(new URLSearchParams());
  };

  return (
    <aside className={`filter-sidebar glass ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>Filters</h3>
        <button onClick={onClose} className="close-btn mobile-only">
          <X size={24} />
        </button>
      </div>

      <div className="filter-group">
        <h4>Sort By</h4>
        <select value={currentSort} onChange={handleSortChange} className="filter-select">
          <option value="">Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>

      <div className="filter-group">
        <h4>Price Range</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
          />
        </div>
      </div>

      <div className="filter-group">
        <h4>Categories</h4>
        <div className="category-list">
          {loading ? (
            <div className="loading-placeholder">Loading...</div>
          ) : (
            categories.slice(0, 8).map((category) => (
              <label key={category.id} className={`category-item ${selectedCategories.includes(category.id) ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <button onClick={clearFilters} className="btn btn-outline clear-btn">
        Clear All
      </button>
    </aside>
  );
};

export default FilterSidebar;
