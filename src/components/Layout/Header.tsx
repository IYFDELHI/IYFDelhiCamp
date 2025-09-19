'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Info, UserPlus, Image as ImageIcon, Sparkles, Phone, Mail } from 'lucide-react';

interface HeaderProps {
  onRegisterClick?: () => void;
}

export default function Header({ onRegisterClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside or on link
  const closeMenu = () => setIsMenuOpen(false);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/register', label: 'Register', icon: UserPlus },
    { href: '/gallery', label: 'Gallery', icon: ImageIcon },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 400,
        damping: 40
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { 
      opacity: 1, 
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <>
      <motion.header 
        className={`fixed w-full top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-2' 
            : 'py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className={`glass-strong border border-white/30 transition-all duration-500 ${
              isScrolled 
                ? 'py-3 shadow-2xl' 
                : 'py-4 shadow-xl'
            }`}
            style={{
              borderRadius: '24px',
              background: isScrolled 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              boxShadow: isScrolled 
                ? '0 20px 40px -8px rgba(0, 0, 0, 0.2), 0 8px 16px -4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4)' 
                : '0 16px 32px -8px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
            }}
            whileHover={{
              background: 'rgba(255, 255, 255, 0.95)',
              scale: 1.002,
              boxShadow: '0 24px 48px -8px rgba(0, 0, 0, 0.25), 0 12px 20px -4px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
              transition: { duration: 0.3 }
            }}
          >
            <div className="flex justify-between items-center px-6">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href="/" 
                  className="flex items-center space-x-3 group"
                  onClick={closeMenu}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron to-sacred-orange flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Sparkles className="w-5 h-5 text-white" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold heading-display bg-gradient-to-r from-saffron via-sacred-orange to-amber-600 bg-clip-text text-transparent group-hover:from-amber-500 group-hover:to-saffron transition-all duration-300">
                      ISKCON Youth
                    </span>
                    <span className="text-xs text-amber-600 font-medium -mt-1">
                      Forum
                    </span>
                  </div>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:block">
                <ul className="flex items-center space-x-1">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        href={item.href} 
                        className="group relative text-amber-800 hover:text-saffron transition-all duration-300 font-medium px-4 py-3 rounded-2xl hover:bg-amber-50/50 backdrop-blur-sm"
                      >
                        <span className="flex items-center gap-2 text-sm">
                          <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                          <span className="heading-primary">{item.label}</span>
                        </span>
                        <motion.span 
                          className="absolute inset-x-2 bottom-1 h-0.5 bg-gradient-to-r from-saffron to-sacred-orange rounded-full"
                          initial={{ scaleX: 0 }}
                          whileHover={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.li>
                  ))}
                  <motion.li
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    className="ml-4"
                  >
                    <button onClick={onRegisterClick} className="btn-sacred px-6 py-3 text-sm rounded-2xl shadow-lg">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Join Camp
                    </button>
                  </motion.li>
                </ul>
              </nav>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden p-3 rounded-2xl text-amber-800 hover:bg-amber-50/50 backdrop-blur-sm transition-all duration-300 border border-amber-200/30"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] z-50 lg:hidden"
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="h-full bg-white/95 backdrop-blur-lg border-l border-gray-200/80 flex flex-col">
                {/* Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/80">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron to-sacred-orange flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold heading-display text-amber-800">Menu</h3>
                      <p className="text-xs text-amber-600">Navigate with devotion</p>
                    </div>
                  </div>
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Menu Items */}
                <nav className="flex-1 px-6 py-8">
                  <ul className="space-y-2">
                    {navItems.map((item, index) => (
                      <motion.li
                        key={item.href}
                        variants={itemVariants}
                        initial="closed"
                        animate="open"
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className="group flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 font-medium"
                        >
                          <div className="p-3 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-all duration-200">
                            <item.icon className="w-5 h-5 text-amber-600" />
                          </div>
                          <span className="text-lg font-semibold">{item.label}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Menu Footer */}
                <div className="p-6 border-t border-gray-200/80 space-y-4">
                  <motion.div
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: navItems.length * 0.1 }}
                  >
                    <button 
                      onClick={() => {
                        onRegisterClick?.();
                        closeMenu();
                      }}
                      className="btn-sacred w-full py-4 text-base rounded-2xl text-center block shadow-lg"
                    >
                      <UserPlus className="w-5 h-5 mr-2 inline" />
                      Join Our Sacred Journey
                    </button>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center space-y-3"
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: (navItems.length + 1) * 0.1 }}
                  >
                    <p className="text-sm text-gray-500">Need guidance?</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-gray-700 border-gray-200 hover:bg-gray-100 rounded-lg"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-gray-700 border-gray-200 hover:bg-gray-100 rounded-lg"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}