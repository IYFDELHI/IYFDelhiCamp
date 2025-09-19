'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-emerald-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-bold mb-4 text-emerald-200">
              ISKCON Youth Forum
            </h3>
            <p className="text-emerald-100 mb-6 leading-relaxed">
              Connecting young hearts with Krishna consciousness through spiritual camps and community service.
            </p>
            
            {/* Social Media */}
            <div className="flex justify-center md:justify-start space-x-4">
              {[
                { icon: Facebook, href: '#', color: 'hover:text-blue-300' },
                { icon: Instagram, href: '#', color: 'hover:text-pink-300' },
                { icon: Youtube, href: '#', color: 'hover:text-red-300' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm text-emerald-200 ${social.color} transition-all duration-300 border border-white/20`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h4 className="text-xl font-semibold mb-6 text-emerald-200 flex items-center justify-center md:justify-start">
              <Heart className="w-5 h-5 mr-2 text-orange-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/register', label: 'Register for Camp' },
                { href: '/gallery', label: 'Photo Gallery' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-emerald-100 hover:text-emerald-50 transition-all duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h4 className="text-xl font-semibold mb-6 text-emerald-200 flex items-center justify-center md:justify-start">
              <MapPin className="w-5 h-5 mr-2 text-orange-400" />
              Contact Us
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Phone className="w-4 h-4 text-orange-400" />
                <span className="text-emerald-100">+91 98765 43210</span>
              </div>
              
              <div className="flex items-center justify-center md:justify-start space-x-3">
                <Mail className="w-4 h-4 text-orange-400" />
                <a 
                  href="mailto:info@iskonyouthforum.org" 
                  className="text-emerald-100 hover:text-emerald-50 transition-colors"
                >
                  info@iskonyouthforum.org
                </a>
              </div>
              
              <div className="flex items-start justify-center md:justify-start space-x-3">
                <MapPin className="w-4 h-4 text-orange-400 mt-1" />
                <div className="text-emerald-100">
                  <p>ISKCON Temple</p>
                  <p>Braj Region, India</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-emerald-700/50 mt-12 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-emerald-200 text-sm">
            © 2025 ISKCON Youth Forum. All rights reserved. | Hare Krishna 🙏
          </p>
        </motion.div>
      </div>
    </footer>
  );
}