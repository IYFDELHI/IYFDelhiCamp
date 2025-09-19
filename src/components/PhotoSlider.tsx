'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Image from 'next/image';

interface PhotoSliderProps {
  autoPlay?: boolean;
  interval?: number;
  className?: string;
}

export default function PhotoSlider({ 
  autoPlay = true, 
  interval = 4000,
  className = ""
}: PhotoSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [slides, setSlides] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generate slide image paths - simplified approach
  useEffect(() => {
    const slideImages = [];
    for (let i = 1; i <= 10; i++) {
      slideImages.push(`/images/slides/slide${i}.png`);
    }
    setSlides(slideImages);
    setIsLoading(false);
  }, []);

  // Navigation functions
  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;
    
    const intervalId = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(intervalId);
  }, [isPlaying, nextSlide, interval, slides.length]);

  if (isLoading) {
    return (
      <div className={`relative w-full h-64 md:h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">Loading slides...</p>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className={`relative w-full h-64 md:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-600">
          <div className="text-4xl mb-4">📸</div>
          <p className="font-medium">No slides found</p>
          <p className="text-sm mt-2">Add images to /public/images/slides/ folder</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-64 md:h-96 rounded-xl overflow-hidden shadow-lg ${className}`}>
      {/* Main Slider */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Image
              src={slides[currentSlide]}
              alt={`Slide ${currentSlide + 1}`}
              fill
              className="object-cover"
              priority={currentSlide === 0}
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Play/Pause Control */}
        {slides.length > 1 && (
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all duration-300"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}