import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import emptyCartImg from '../assets/empty-cart.png';
import '../styles/Cart.css';

const Cart: React.FC = () => {
  const { items, totalAmount, totalQuantity, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page container empty-cart">
        <motion.div 
          className="empty-content glass"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.img 
            src={emptyCartImg} 
            alt="Empty Cart" 
            className="empty-cart-img"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <h2 className="text-gradient">Your cart is empty</h2>
          <p>Explore our collections and add some items to your cart.</p>
          <Link to="/" className="btn btn-primary">
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Your Shopping Cart</h1>
      <p className="cart-subtitle">{totalQuantity} items in your cart</p>

      <div className="cart-grid">
        <div className="cart-items-list">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={item.id} 
                className="cart-item glass"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                <div className="item-image">
                  <img src={item.images[0]} alt={item.title} />
                </div>
                
                <div className="item-info">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="item-title">{item.title}</h3>
                  </Link>
                  <p className="item-category">{item.category.name}</p>
                </div>

                <div className="item-actions">
                  <div className="item-quantity">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-btn"
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="cart-summary glass">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          
          <button className="btn btn-primary checkout-btn">
            Checkout
            <ArrowRight size={20} />
          </button>

          <Link to="/" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
