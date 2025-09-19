'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import RegistrationForm from './RegistrationForm';

interface RegistrationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationPopup = ({ isOpen, onClose }: RegistrationPopupProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <RegistrationForm isOpen={isOpen} onClose={onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Auto-popup hook
export const useAutoPopup = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPopupOpen(true);
    }, 90000); // 1 minute 30 seconds (90 seconds)

    return () => clearInterval(interval);
  }, []);

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  return { isPopupOpen, closePopup, openPopup };
};

export default RegistrationPopup;