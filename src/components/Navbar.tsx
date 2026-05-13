import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Store, Sun, Moon, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';

const Navbar: React.FC = () => {
  const { totalQuantity } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <Store size={24} strokeWidth={2.5} />
          <span>SEMBARK</span>
        </Link>

        <div className="nav-actions">
          <button 
            className="nav-icon-btn" 
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="nav-icon-btn profile-btn" aria-label="Profile">
            <User size={20} />
          </button>

          <Link to="/cart" className="cart-btn" id="navbar-cart-icon">
            <ShoppingBag size={22} />
            {totalQuantity > 0 && (
              <motion.span 
                key={totalQuantity}
                className="cart-badge"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                {totalQuantity}
              </motion.span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
