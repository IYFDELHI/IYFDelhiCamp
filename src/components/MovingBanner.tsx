'use client';

import { motion } from 'framer-motion';

const MovingBanner = () => {
  const bannerText = "REGISTER NOW FOR KARTIK BRAJ CAMP 2025 | EXPERIENCE DIVINE BLISS | LIMITED SEATS AVAILABLE | ";

  return (
    <div className="w-full bg-gradient-to-r from-saffron via-sacred-orange to-saffron overflow-hidden py-3 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -2000],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 25,
            ease: "linear",
          },
        }}
      >
        {/* First set */}
        <div className="flex items-center space-x-8 px-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-8">
              <span className="text-white font-bold text-lg md:text-xl tracking-wide">
                {bannerText}
              </span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
        
        {/* Duplicate set for seamless loop */}
        <div className="flex items-center space-x-8 px-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={`duplicate-${index}`} className="flex items-center space-x-8">
              <span className="text-white font-bold text-lg md:text-xl tracking-wide">
                {bannerText}
              </span>
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Gradient edges for smooth fade effect */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-saffron to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-saffron to-transparent pointer-events-none"></div>
    </div>
  );
};

export default MovingBanner;