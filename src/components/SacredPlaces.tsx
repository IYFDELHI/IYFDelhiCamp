'use client';

import { motion } from 'framer-motion';
import { MapPin, Star, Heart, Sparkles } from 'lucide-react';
import Image from 'next/image';

const sacredPlaces = [
  {
    name: 'Govardhan Hill',
    description: 'The sacred hill lifted by Lord Krishna to protect the residents of Vrindavan',
    image: '/images/govardhan.jpg',
    significance: 'Divine Protection'
  },
  {
    name: 'Radha Kund',
    description: 'The most sacred kund, dear to Srimati Radharani',
    image: '/images/radha-kund.jpg',
    significance: 'Pure Love'
  },
  {
    name: 'Vrindavan Gurukul',
    description: 'Traditional learning center for spiritual education and Vedic studies',
    image: '/images/gurukul.jpg',
    significance: 'Sacred Knowledge'
  },
  {
    name: 'Yamuna Ghat',
    description: 'Holy banks of river Yamuna where Krishna performed His pastimes',
    image: '/images/yamuna-ghat.jpg',
    significance: 'Divine Pastimes'
  }
];

export default function SacredPlaces() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-13.807-11.193-25-25-25s-25 11.193-25 25 11.193 25 25 25 25-11.193 25-25zm25-25c0-13.807-11.193-25-25-25s-25 11.193-25 25 11.193 25 25 25 25-11.193 25-25z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="text-amber-700 font-medium">Sacred Journey</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Sacred Places of Braj
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Discover the divine locations where Lord Krishna performed His eternal pastimes. 
            Each place holds profound spiritual significance and offers unique blessings to devotees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {sacredPlaces.map((place, index) => (
            <motion.div
              key={place.name}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-amber-600 opacity-50" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Significance Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-medium text-slate-700">{place.significance}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors">
                    {place.name}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {place.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-slate-500">Sacred Site</span>
                    </div>
                    
                    <motion.div
                      className="text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Experience Divine Braj Dham
            </h3>
            <p className="text-slate-600 mb-6">
              Join our guided pilgrimage to these sacred places and immerse yourself in the 
              spiritual atmosphere where Krishna's divine pastimes continue eternally.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Guided Tours</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Spiritual Significance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Star className="w-4 h-4 text-amber-500" />
                <span>Divine Blessings</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}