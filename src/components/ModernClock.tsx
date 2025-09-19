'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TimeUnit {
  value: number;
  label: string;
}

const ModernClock = () => {
  const [time, setTime] = useState<TimeUnit[]>([
    { value: 0, label: 'Days' },
    { value: 0, label: 'Hours' },
    { value: 0, label: 'Minutes' },
    { value: 0, label: 'Seconds' }
  ]);

  useEffect(() => {
    // Set target date for Kartik Braj Camp 2025 (December 15, 2025)
    const targetDate = new Date('2025-12-15T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTime([
          { value: days, label: 'Days' },
          { value: hours, label: 'Hours' },
          { value: minutes, label: 'Minutes' },
          { value: seconds, label: 'Seconds' }
        ]);
      } else {
        // If the target date has passed, show zeros
        setTime([
          { value: 0, label: 'Days' },
          { value: 0, label: 'Hours' },
          { value: 0, label: 'Minutes' },
          { value: 0, label: 'Seconds' }
        ]);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-8 shadow-2xl border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-white mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            THE COUNTDOWN BEGINS
          </motion.h2>
          <motion.p
            className="text-gray-400 text-sm md:text-base"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Kartik Braj Camp 2025
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {time.map((unit, index) => (
            <motion.div
              key={unit.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 md:p-6 border border-gray-600 shadow-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="text-4xl md:text-6xl font-bold text-white mb-2 font-mono"
                  key={unit.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {formatNumber(unit.value)}
                </motion.div>
                <div className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">
                  {unit.label}
                </div>
              </motion.div>
              
              {index < time.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-500 text-2xl font-bold">
                  :
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-saffron/20 to-sacred-orange/20 px-4 py-2 rounded-full border border-saffron/30">
            <div className="w-2 h-2 bg-saffron rounded-full animate-pulse"></div>
            <span className="text-saffron text-sm font-medium">Live Countdown</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModernClock;