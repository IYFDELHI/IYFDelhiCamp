'use client';

import HeroSection from '@/components/HeroSection';
import PosterSection from '@/components/PosterSection';
import Layout from '@/components/Layout/Layout';
import PhotoGallery from '@/components/PhotoGallery';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Heart, ArrowRight, Users, Calendar, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      
      {/* Poster Section - Main Featured Event */}
      <PosterSection />
      
      {/* Enhanced Latest Camp Section */}
      <section id="latest-camp" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-soft-ivory via-warm-cream to-emerald-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.08'%3E%3Cpath d='M50 50c0-13.807-11.193-25-25-25s-25 11.193-25 25 11.193 25 25 25 25-11.193 25-25zm25-25c0-13.807-11.193-25-25-25s-25 11.193-25 25 11.193 25 25 25 25-11.193 25-25z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-12 h-12 text-saffron mx-auto" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-900 mb-6 heading-display">
              Our Latest Sacred Camp
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-saffron via-sacred-orange to-saffron mx-auto rounded-full shadow-lg"></div>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-20 max-w-7xl mx-auto">
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="glass-strong rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30">
                <div className="bg-gradient-to-br from-emerald-300 via-teal-400 to-emerald-500 w-full h-80 sm:h-96 md:h-[500px] flex items-center justify-center relative overflow-hidden">
                  {/* Enhanced placeholder */}
                  <div className="text-center text-white relative z-10">
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        rotate: { duration: 15, ease: "linear", repeat: Infinity },
                        scale: { duration: 3, repeat: Infinity }
                      }}
                      className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6"
                    >
                      <Sparkles className="w-full h-full text-white/90" />
                    </motion.div>
                    <h3 className="text-2xl sm:text-3xl font-bold heading-display mb-3">Sacred Camp Experience</h3>
                    <p className="text-lg text-body opacity-90">Transformative Journey</p>
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute inset-0">
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-800 mb-6 heading-display">
                    Braj Spiritual Journey 2025
                  </h3>
                  <p className="text-emerald-700 mb-8 leading-relaxed text-lg sm:text-xl text-body">
                    Join us for a transformative experience in the sacred lands of Braj. Our upcoming camp focuses on spiritual growth, 
                    community building, and connecting with nature. Experience ancient wisdom through modern practices in an atmosphere 
                    of devotion and learning.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { icon: Calendar, label: 'Duration', value: '7 Days', color: 'from-emerald-500 to-teal-500' },
                    { icon: MapPin, label: 'Location', value: 'Braj Region', color: 'from-saffron to-sacred-orange' },
                    { icon: Users, label: 'Age Group', value: '18-30 Years', color: 'from-divine-blue to-lotus-pink' },
                    { icon: Heart, label: 'Investment', value: '₹2500', color: 'from-forest-green to-emerald-600' },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="glass p-6 rounded-2xl border border-white/30 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -5 }}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-bold text-emerald-800 mb-2 text-base heading-primary">{item.label}</h4>
                      <p className="text-emerald-600 text-base font-medium">{item.value}</p>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  viewport={{ once: true }}
                >
                  <Link 
                    href="/register" 
                    className="btn-sacred px-8 py-4 text-lg rounded-2xl shadow-xl inline-flex items-center group"
                  >
                    <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                    Register for Camp
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Enhanced Registration Section */}
      <section id="register" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-emerald-50 via-teal-50 to-warm-cream relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF9933' fill-opacity='0.1'%3E%3Cpath d='M60 60c0-16.569-13.431-30-30-30s-30 13.431-30 30 13.431 30 30 30 30-13.431 30-30zm30-30c0-16.569-13.431-30-30-30s-30 13.431-30 30 13.431 30 30 30 30-13.431 30-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <Heart className="w-12 h-12 text-sacred-orange mx-auto" />
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-900 mb-6 heading-display">
              Register for the Sacred Camp
            </h2>
            <p className="text-emerald-700 max-w-3xl mx-auto text-lg sm:text-xl text-body leading-relaxed mb-8">
              Secure your place in this transformative experience in the sacred lands of Braj. 
              Join a community of seekers on a journey of spiritual discovery and growth.
            </p>
            <div className="w-24 h-1.5 bg-gradient-to-r from-sacred-orange via-saffron to-sacred-orange mx-auto rounded-full shadow-lg"></div>
          </motion.div>
          
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="glass-strong border-2 border-white/30 rounded-3xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-8 sm:p-10 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-8 heading-display">
                    Sacred Camp Highlights
                  </h3>
                  <ul className="space-y-6">
                    {[
                      'Daily meditation and spiritual sessions with experienced guides',
                      'Cultural programs and traditional arts workshops',
                      'Nature walks and environmental consciousness activities',
                      'Healthy, nutritious sattvic meals prepared with love',
                      'Community service projects for spiritual growth'
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        className="flex items-start group"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <motion.div
                          className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 mr-4 mt-1 shadow-lg"
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Sparkles className="w-4 h-4 text-white" />
                        </motion.div>
                        <span className="text-emerald-800 text-base sm:text-lg text-body group-hover:text-emerald-600 transition-colors">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-900 mb-8 heading-display">
                    Registration Details
                  </h3>
                  <div className="glass p-8 rounded-2xl mb-8 border border-white/30 backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-800 text-lg text-body">Registration Fee:</span>
                        <span className="font-bold text-emerald-700 text-2xl heading-display">₹2500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-800 text-lg text-body">Duration:</span>
                        <span className="font-bold text-emerald-700 text-xl heading-primary">7 Days</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-emerald-800 text-lg text-body">Dates:</span>
                        <span className="font-bold text-emerald-700 text-xl heading-primary">Coming Soon</span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link 
                      href="/register" 
                      className="btn-sacred w-full py-5 text-xl rounded-2xl text-center flex items-center justify-center shadow-2xl group"
                    >
                      <Heart className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                      Begin Your Sacred Journey
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Gallery Section */}
      <PhotoGallery images={[]} />
    </Layout>
  );
}