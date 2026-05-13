import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/ProductCard.css';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addItem, items } = useCart();
  const [isFlying, setIsFlying] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isAlreadyInCart = items.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAlreadyInCart) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      addItem(product);
      return;
    }

    setIsFlying(true);
    addItem(product);
    setTimeout(() => setIsFlying(false), 800);
  };

  const cartIcon = document.getElementById('navbar-cart-icon');
  const cartRect = cartIcon?.getBoundingClientRect();
  const cardRect = cardRef.current?.getBoundingClientRect();

  const flyToX = cartRect && cardRect ? cartRect.left - cardRect.left : 0;
  const flyToY = cartRect && cardRect ? cartRect.top - cardRect.top : 0;

  return (
    <motion.div 
      ref={cardRef}
      className={`product-card ${isAlreadyInCart ? 'in-cart' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: isShaking ? [0, -10, 10, -10, 10, 0] : 0
      }}
      transition={{ 
        x: { duration: 0.4, ease: "easeInOut" }
      }}
      whileHover={{ y: -8 }}
    >
      <div className="product-image-wrapper">
        <Link to={`/product/${product.id}`} className="product-image-link">
          <img src={product.images[0]} alt={product.title} loading="lazy" />
        </Link>
        
        <AnimatePresence>
          {isFlying && (
            <motion.div 
              className="fly-ghost"
              initial={{ opacity: 0.8, scale: 1, x: 0, y: 0 }}
              animate={{ 
                opacity: 0,
                scale: 0.2,
                x: flyToX,
                y: flyToY
              }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <img src={product.images[0]} alt="" />
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          className={`quick-add-btn ${isAlreadyInCart ? 'active' : ''}`}
          onClick={handleAddToCart}
          aria-label={isAlreadyInCart ? "Already in cart" : "Add to cart"}
        >
          {isAlreadyInCart ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ fontSize: '10px', fontWeight: 'bold' }}
            >
              ADDED
            </motion.span>
          ) : (
            <Plus size={20} />
          )}
        </button>
      </div>

      <div className="product-details">
        <span className="product-tag">{product.category.name}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.title}</h3>
        </Link>
        <div className="product-pricing">
          <span className="product-price">${product.price}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
