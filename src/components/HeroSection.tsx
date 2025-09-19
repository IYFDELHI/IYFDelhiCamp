'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Phone } from 'lucide-react';
import Image from 'next/image';
import PhotoSlider from './PhotoSlider';

interface HeroSectionProps {
  onRegisterClick?: () => void;
}

export default function HeroSection({ onRegisterClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Main Content Container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[80vh]">
          
          {/* Left Side - Main Poster */}
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto lg:max-w-none">
              <Image
                src="/images/mainposter.jpg"
                alt="Kartik Braj Camp 2025 - Main Poster"
                width={600}
                height={800}
                className="w-full h-auto object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            className="order-1 lg:order-2 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Badge */}
            <Badge className="px-4 py-2 text-sm bg-gradient-to-r from-saffron to-sacred-orange text-white border-none">
              October 17-19, 2025
            </Badge>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-gradient-to-r from-saffron via-sacred-orange to-divine-blue bg-clip-text text-transparent">
                Kartik Braj Camp
              </span>
              <br />
              <span className="text-gray-800">2025</span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-lg">
              Join us for a transformational spiritual journey in the holy land of Braj during the auspicious month of Kartik
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <Button 
                size="lg" 
                onClick={onRegisterClick}
                className="bg-gradient-to-r from-saffron to-sacred-orange hover:from-saffron-dark hover:to-sacred-orange-dark text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="w-5 h-5 mr-2" />
                Register Now
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {[
                { icon: Users, label: 'Devotees', value: '500+' },
                { icon: Calendar, label: 'Days', value: '3' },
                { icon: MapPin, label: 'Locations', value: '5+' }
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40 shadow-sm"
                >
                  <stat.icon className="w-6 h-6 text-saffron mx-auto mb-2" />
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  );
}