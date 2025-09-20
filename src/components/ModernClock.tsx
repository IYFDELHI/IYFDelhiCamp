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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const targetDate = new Date('2025-10-12T23:59:59');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

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
  }, [isClient]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {isClient && (
        <motion.div
          className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 shadow-lg border border-white/40"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
        <div className="text-center mb-8">
          <motion.h2
            className="text-2xl md:text-3xl font-bold text-emerald-800 mb-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            viewport={{ once: true }}
          >
            Registrations are Open Till
          </motion.h2>
          <motion.p
            className="text-emerald-600 text-sm md:text-base"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            viewport={{ once: true }}
          >
            Don&apos;t miss your chance to join this transformative spiritual journey
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {time.map((unit, index) => (
            <motion.div
              key={unit.label}
              className="text-center bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 shadow-inner border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index + 0.2, duration: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="text-4xl md:text-6xl font-bold text-saffron mb-1"
                key={unit.value}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {formatNumber(unit.value)}
              </motion.div>
              <div className="text-emerald-700 text-xs md:text-sm font-medium uppercase tracking-wider">
                {unit.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      )}
    </div>
  );
};

export default ModernClock;