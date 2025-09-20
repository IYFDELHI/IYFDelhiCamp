'use client';

import { motion } from 'framer-motion';
import { Heart, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-orange-900 via-amber-800 to-orange-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 relative z-10">
        <div className="text-center space-y-4">
          {/* Camp Query Section */}
          <div className="mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-orange-100 mb-3">
              Camp Queries & Information
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm md:text-base">
              <a 
                href="tel:+919643958303" 
                className="flex items-center gap-2 text-orange-200 hover:text-white transition-colors duration-300"
              >
                <Phone className="w-4 h-4" />
                <span>+91 9643958303</span>
              </a>
              <a 
                href="mailto:gaurangagovindaked@gmail.com" 
                className="flex items-center gap-2 text-orange-200 hover:text-white transition-colors duration-300"
              >
                <Mail className="w-4 h-4" />
                <span>gaurangagovindaked@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-orange-300/50 to-transparent mx-auto"></div>

          {/* Made with Love Section */}
          <motion.div 
            className="flex items-center justify-center gap-2 text-orange-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-sm md:text-base">Made with</span>
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="text-sm md:text-base">by</span>
            <span className="font-semibold text-orange-100">ISKCON Youth Forum Delhi</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}