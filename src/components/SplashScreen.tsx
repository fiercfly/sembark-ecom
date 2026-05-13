import React from 'react';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';
import '../styles/SplashScreen.css';

const SplashScreen: React.FC = () => {
  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="splash-content">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="splash-logo"
        >
          <Store size={64} strokeWidth={2.5} />
        </motion.div>
        
        <motion.div className="splash-text-container">
          {"SEMBARK".split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="splash-char"
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
        
        <motion.div 
          className="splash-loader-bar"
          initial={{ width: 0 }}
          animate={{ width: "200px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

export default SplashScreen;
