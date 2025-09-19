'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Phone, Users, Clock, Star, Sparkles, Heart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function PosterSection() {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-warm-cream via-soft-ivory to-emerald-50">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm20-20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>



      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Badge variant="secondary" className="px-6 py-3 text-base bg-gradient-to-r from-saffron/20 to-sacred-orange/20 text-saffron-dark border-saffron/30 rounded-full shadow-lg">
              <Star className="w-5 h-5 mr-2" />
              Featured Sacred Event
            </Badge>
          </motion.div>
          
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-emerald-900 mb-6 heading-display"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <span className="bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900 bg-clip-text text-transparent">
              Kartik Braj Camp 2025
            </span>
          </motion.h2>
          
          <motion.p
            className="text-lg sm:text-xl text-emerald-700 max-w-3xl mx-auto mb-8 text-body leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Experience the divine atmosphere of Kartik month in the sacred lands of Braj. 
            A transformative journey of spiritual growth, community bonding, and inner awakening.
          </motion.p>
          
          <motion.div 
            className="w-24 h-1.5 bg-gradient-to-r from-saffron via-sacred-orange to-saffron mx-auto rounded-full shadow-lg"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* Enhanced Main Poster Card */}
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Card className="glass-strong border-2 border-white/30 shadow-2xl overflow-hidden backdrop-blur-xl bg-white/60 rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Enhanced Poster Image */}
              <motion.div 
                className="relative h-80 sm:h-96 md:h-[500px] lg:h-full min-h-[500px] overflow-hidden rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="w-full h-full bg-gradient-to-br from-saffron/30 via-sacred-orange/40 to-emerald-400/30 relative rounded-3xl">
                  {/* Enhanced placeholder with spiritual symbols */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, ease: "linear", repeat: Infinity },
                          scale: { duration: 3, repeat: Infinity }
                        }}
                        className="w-24 h-24 mx-auto mb-6"
                      >
                        <Sparkles className="w-full h-full text-white/80" />
                      </motion.div>
                      <h3 className="text-3xl font-bold heading-display mb-3">
                        Kartik Braj Camp
                      </h3>
                      <p className="text-lg text-body opacity-90">
                        Sacred Poster
                      </p>
                      <motion.div
                        className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full inline-block"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-sm font-medium">October 17-19, 2025</span>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
              </motion.div>

              {/* Enhanced Event Details */}
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <motion.h3 
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-900 mb-8 heading-display"
                    whileHover={{ scale: 1.02 }}
                  >
                    Join the Sacred Journey
                  </motion.h3>
                  
                  <p className="text-emerald-700 text-lg sm:text-xl mb-10 leading-relaxed text-body">
                    Experience the divine atmosphere of Kartik month in the holy land of Braj. 
                    Connect with like-minded devotees and immerse yourself in transformative spiritual practices 
                    that will awaken your inner consciousness.
                  </p>

                  {/* Enhanced Event Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    {[
                      { icon: Calendar, label: 'Date', value: '17th-19th Oct', color: 'from-emerald-500 to-teal-500', bg: 'emerald-50' },
                      { icon: Clock, label: 'Duration', value: '3 Days', color: 'from-saffron to-sacred-orange', bg: 'orange-50' },
                      { icon: MapPin, label: 'Location', value: 'Braj Region', color: 'from-divine-blue to-lotus-pink', bg: 'blue-50' },
                      { icon: Users, label: 'Community', value: 'Youth Forum', color: 'from-forest-green to-emerald-600', bg: 'green-50' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className={`flex items-center space-x-4 p-5 rounded-2xl bg-${item.bg} border border-white/50 backdrop-blur-sm`}
                        whileHover={{ scale: 1.03, y: -2 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-emerald-900 text-base heading-primary">{item.label}</div>
                          <div className="text-emerald-700 text-base font-medium">{item.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Pricing */}
                  <motion.div 
                    className="bg-gradient-to-r from-saffron/10 via-sacred-orange/10 to-saffron/10 p-8 rounded-2xl mb-10 border border-saffron/20 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-saffron to-sacred-orange">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-emerald-900 text-xl heading-primary">Sacred Investment (with travel)</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <motion.div 
                        className="flex justify-between items-center p-4 bg-white/50 rounded-xl backdrop-blur-sm"
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <span className="text-emerald-700 font-medium">Dormitory:</span>
                        <span className="font-bold text-emerald-900 text-xl heading-display">₹2000/-</span>
                      </motion.div>
                      <motion.div 
                        className="flex justify-between items-center p-4 bg-white/50 rounded-xl backdrop-blur-sm"
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <span className="text-emerald-700 font-medium">Room:</span>
                        <span className="font-bold text-emerald-900 text-xl heading-display">₹2500/-</span>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1"
                    >
                      <Link 
                        href="/register"
                        className="btn-sacred w-full py-4 text-lg rounded-2xl shadow-xl flex items-center justify-center group"
                      >
                        <Phone className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                        Register Now
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1"
                    >
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-all duration-300 py-4 text-lg rounded-2xl backdrop-blur-sm bg-white/50"
                      >
                        <MapPin className="w-5 h-5 mr-2" />
                        View Details
                      </Button>
                    </motion.div>
                  </div>

                  {/* Enhanced Contact Info */}
                  <motion.div 
                    className="p-6 bg-gradient-to-r from-sacred-orange/10 to-saffron/10 rounded-2xl border border-sacred-orange/20 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-sacred-orange to-saffron">
                          <Heart className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-sacred-orange font-semibold text-lg heading-primary">For Divine Guidance:</span>
                      </div>
                      <motion.a 
                        href="tel:1234567899" 
                        className="text-sacred-orange font-bold text-xl hover:text-saffron-dark transition-colors heading-display"
                        whileHover={{ scale: 1.05 }}
                      >
                        1234567899
                      </motion.a>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Sacred Places Preview */}
        <motion.div
          className="mt-16 sm:mt-20 lg:mt-24"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-emerald-900 mb-4 heading-display">
            Sacred Places We'll Visit
          </h3>
          <p className="text-center text-emerald-700 text-lg mb-12 max-w-2xl mx-auto text-body">
            Journey through the most revered locations in Braj, each holding centuries of spiritual significance
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {[
              { name: 'Gokul', description: 'Krishna\'s childhood home' },
              { name: 'Bhandir Van', description: 'Sacred forest grove' },
              { name: 'Belvan', description: 'Divine pastimes location' },
              { name: 'Ras Khali Samadhi', description: 'Meditation sanctuary' },
              { name: 'Banshi Vat', description: 'Flute melody tree' }
            ].map((place, index) => (
              <motion.div
                key={place.name}
                className="group cursor-pointer"
                whileHover={{ scale: 1.05, y: -8 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="glass border-2 border-white/30 overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500 rounded-2xl">
                  <div className="relative h-32 sm:h-40 lg:h-48 bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                      </motion.div>
                    </div>
                    {/* Floating particles */}
                    <div className="absolute inset-0 opacity-30">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full"
                          style={{
                            left: `${20 + i * 30}%`,
                            top: `${20 + i * 20}%`,
                          }}
                          animate={{
                            y: [-5, -15, -5],
                            opacity: [0.3, 1, 0.3],
                          }}
                          transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 text-center bg-white/80 backdrop-blur-sm">
                    <h4 className="font-bold text-emerald-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors heading-primary mb-2">
                      {place.name}
                    </h4>
                    <p className="text-emerald-600 text-xs sm:text-sm text-body">
                      {place.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Call to Action */}
        <motion.div
          className="text-center mt-16 sm:mt-20 lg:mt-24"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="glass-strong p-8 sm:p-12 lg:p-16 rounded-3xl border-2 border-white/30 shadow-2xl backdrop-blur-xl bg-gradient-to-br from-white/70 to-white/50">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-16 h-16 text-saffron mx-auto" />
            </motion.div>
            
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-900 mb-6 heading-display">
              And many more divine experiences awaiting...
            </h3>
            <p className="text-emerald-700 text-lg sm:text-xl mb-10 max-w-3xl mx-auto text-body leading-relaxed">
              Join us for an unforgettable spiritual journey filled with devotion, learning, and divine experiences 
              that will transform your understanding of life and spirituality.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/register"
                className="btn-sacred px-10 py-5 text-xl rounded-2xl shadow-2xl inline-flex items-center group"
              >
                <Heart className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                Begin Your Sacred Journey
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}