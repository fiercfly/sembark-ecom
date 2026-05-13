import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ArrowLeft, ShoppingCart, Star, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getProduct(id);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="status-container"><div className="loader"></div></div>;
  if (error || !product) return (
    <div className="status-container error">
      <h2>{error || 'Something went wrong'}</h2>
      <Link to="/" className="btn btn-primary mt-4">Back to Home</Link>
    </div>
  );

  return (
    <div className="product-detail-page container">
      <button onClick={() => navigate(-1)} className="back-btn" aria-label="Go back">
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="detail-grid">
        <div className="image-section">
          <motion.div 
            className="main-image glass"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img src={product.images[selectedImage]} alt={product.title} />
          </motion.div>
          <div className="thumbnail-list">
            {product.images.map((img, index) => (
              <button 
                key={index} 
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt={`${product.title} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="info-section">
          <div className="category-badge">{product.category.name}</div>
          <h1 className="title">{product.title}</h1>
          
          <div className="rating">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                fill={i < 4 ? "var(--accent)" : "none"} 
                color="var(--accent)" 
              />
            ))}
            <span>(4.5 / 5 - 128 reviews)</span>
          </div>

          <div className="price-tag">${product.price}</div>
          
          <p className="description">{product.description}</p>

          <div className="features">
            <div className="feature-item">
              <Truck size={20} />
              <span>Free Delivery</span>
            </div>
            <div className="feature-item">
              <ShieldCheck size={20} />
              <span>2 Year Warranty</span>
            </div>
          </div>

          <button 
            className="btn btn-primary buy-btn"
            onClick={() => addItem(product)}
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
