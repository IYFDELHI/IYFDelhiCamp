'use client';

import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

interface StickyFooterProps {
  onRegisterClick?: () => void;
  isPopupOpen?: boolean;
}

export default function StickyFooter({ onRegisterClick, isPopupOpen }: StickyFooterProps) {
  if (isPopupOpen) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600/95 via-teal-600/95 to-emerald-600/95 backdrop-blur-md border-t border-white/20 shadow-lg"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          {/* Centered Registration Button */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={onRegisterClick}
              className="bg-gradient-to-r from-saffron to-sacred-orange text-white px-6 py-3 rounded-full font-semibold text-sm sm:text-base flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Now</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}