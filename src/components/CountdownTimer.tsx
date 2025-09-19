'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const targetDate = new Date('2025-10-17T00:00:00').getTime();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days, color: 'from-emerald-500 to-teal-600' },
    { label: 'Hours', value: timeLeft.hours, color: 'from-blue-500 to-indigo-600' },
    { label: 'Minutes', value: timeLeft.minutes, color: 'from-purple-500 to-pink-600' },
    { label: 'Seconds', value: timeLeft.seconds, color: 'from-orange-500 to-red-600' }
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full">
            <Clock className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">Camp Countdown</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Kartik Braj Camp 2025
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Join us for a transformational spiritual journey in the sacred land of Braj. 
            Register now to secure your place in this divine experience.
          </p>
        </motion.div>

        {/* Countdown Display */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`bg-gradient-to-br ${unit.color} p-6 rounded-2xl shadow-lg text-white text-center transform hover:scale-105 transition-all duration-300`}>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
                  {unit.value.toString().padStart(2, '0')}
                </div>
                <div className="text-sm sm:text-base font-medium opacity-90">
                  {unit.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Registration Section */}
        <motion.div
          className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 sm:p-12 shadow-xl border border-white/50 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            Why Register for Kartik Braj Camp?
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Sacred Places</h4>
              <p className="text-slate-600 text-sm">Visit holy sites like Govardhan, Radha Kund, and other divine locations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Spiritual Community</h4>
              <p className="text-slate-600 text-sm">Connect with like-minded devotees and spiritual seekers</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800 mb-2">Kartik Month</h4>
              <p className="text-slate-600 text-sm">Experience the most auspicious month in the holy land of Braj</p>
            </div>
          </div>

          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Register Now - Limited Seats
          </Button>
          
          <p className="text-sm text-slate-500 mt-4">
            Early bird registration closes soon. Secure your spiritual journey today!
          </p>
        </motion.div>
      </div>
    </section>
  );
}