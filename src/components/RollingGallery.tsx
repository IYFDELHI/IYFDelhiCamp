'use client';

import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Camp photos array with correct paths
const CAMP_PHOTOS: string[] = [
  '/images/photos/BSS Camp Oct 2018 (1095).JPG',
  '/images/photos/BSS Camp Oct 2018 (1138).JPG',
  '/images/photos/BSS Camp Oct 2018 (1235).JPG',
  '/images/photos/BSS Camp Oct 2018 (464).JPG',
  '/images/photos/BSS Camp Oct 2018 (489).JPG',
  '/images/photos/BSS Camp Oct 2018 (545).JPG',
  '/images/photos/BSS Camp Oct 2018 (549).JPG',
  '/images/photos/BSS Camp Oct 2018 (58).JPG',
  '/images/photos/BSS Camp Oct 2018 (627).JPG',
  '/images/photos/BSS Camp Oct 2018 (631).JPG',
  '/images/photos/BSS Camp Oct 2018 (664).JPG',
  '/images/photos/BSS Camp Oct 2018 (68).JPG',
  '/images/photos/BSS Camp Oct 2018 (689).JPG',
  '/images/photos/BSS Camp Oct 2018 (69).JPG',
  '/images/photos/BSS Camp Oct 2018 (867).JPG',
  '/images/photos/BSS Camp Oct 2018 (881).JPG',
  '/images/photos/BSS Camp Oct 2018 (93).JPG',
  '/images/photos/IMG_1134.JPG'
];

interface RollingGalleryProps {
  autoplay?: boolean | undefined;
  pauseOnHover?: boolean | undefined;
}

// Image cache for preloading
// Smooth skeleton loader
const ImageSkeleton = ({ className }: { className: string }) => (
  <div className={`${className} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse`}>
    <div className="w-full h-full bg-gradient-to-br from-orange-100/30 to-orange-200/30 rounded-3xl" />
  </div>
);

// Optimized progressive image component with preloading
const ProgressiveImage = ({ 
  src, 
  alt, 
  className, 
  priority = false,
  onLoad,
  onClick 
}: {
  src: string;
  alt: string;
  className: string;
  priority?: boolean | undefined;
  onLoad?: (() => void) | undefined;
  onClick?: (() => void) | undefined;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  return (
    <div className={className} onClick={onClick}>
      {/* Skeleton loader */}
      {!isLoaded && !hasError && (
        <ImageSkeleton className="absolute inset-0 rounded-3xl" />
      )}
      
      {/* Error fallback */}
      {hasError ? (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 rounded-3xl flex items-center justify-center">
          <div className="text-orange-600 text-lg font-medium">📷</div>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover rounded-3xl transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          quality={85}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          sizes="(max-width: 640px) 400px, (max-width: 768px) 500px, 600px"
        />
      )}
      
      {/* Subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-3xl" />
    </div>
  );
};

const RollingGallery: React.FC<RollingGalleryProps> = React.memo(({ 
  autoplay = true, // Enable autoplay by default
  pauseOnHover = true 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, isMobile: false });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);

  // Simple responsive handling
  useLayoutEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        isMobile: window.innerWidth < 768
      });

RollingGallery.displayName = 'RollingGallery';
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (!autoplay || isDragging || isHovered) return;

    const startAutoplay = () => {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % CAMP_PHOTOS.length);
      }, 5000); // Increased to 5 seconds for smoother experience
    };

    const stopAutoplay = () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };

    startAutoplay();

    return () => stopAutoplay();
  }, [autoplay, isDragging, isHovered]);

  // Touch and mouse event handlers
  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setDragOffset(0);
  }, []);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = Math.abs(clientY - dragStart.y);
    
    // Only handle horizontal swipes
    if (deltaY > 50) return;
    
    setDragOffset(deltaX);
  }, [isDragging, dragStart]);

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    
    const threshold = 80; // Minimum swipe distance
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        // Swipe right - go to previous
        setCurrentIndex((prev) => (prev - 1 + CAMP_PHOTOS.length) % CAMP_PHOTOS.length);
      } else {
        // Swipe left - go to next
        setCurrentIndex((prev) => (prev + 1) % CAMP_PHOTOS.length);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
  }, [isDragging, dragOffset]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      handleStart(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Navigation functions with smoother transitions
  const goToPrevious = () => {
    if (isDragging) return; // Prevent navigation during drag
    setCurrentIndex((prev) => (prev - 1 + CAMP_PHOTOS.length) % CAMP_PHOTOS.length);
  };

  const goToNext = () => {
    if (isDragging) return; // Prevent navigation during drag
    setCurrentIndex((prev) => (prev + 1) % CAMP_PHOTOS.length);
  };

  const getVisibleImages = useCallback(() => {
    const visible = [];
    const totalImages = CAMP_PHOTOS.length;
    const visibleCount = dimensions.isMobile ? 3 : 5;
    const centerOffset = Math.floor(visibleCount / 2);
    
    for (let i = -centerOffset; i <= centerOffset; i++) {
      const index = (currentIndex + i + totalImages) % totalImages;
      visible.push({
        src: CAMP_PHOTOS[index],
        index,
        position: i
      });
    }
    
    return visible;
  }, [currentIndex, dimensions.isMobile]);

  // Simple loading state - only block if dimensions not ready
  if (dimensions.width === 0) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-transparent flex items-center justify-center">
        <div className="flex space-x-6">
          {[...Array(3)].map((_, i) => (
            <ImageSkeleton 
              key={i} 
              className="w-[350px] h-[280px] md:w-[450px] md:h-[320px] rounded-3xl" 
            />
          ))}
        </div>
      </div>
    );
  }

  const visibleImages = getVisibleImages();
  const { isMobile } = dimensions;

  // Optimized responsive sizing - made mobile images bigger to fill space
  const imageWidth = isMobile ? 320 : 380;
  const imageHeight = isMobile ? 260 : 280;
  const spacing = isMobile ? 180 : 220;

  return (
    <>
      {/* Enhanced Nostalgic Title Section - Mobile Optimized */}
      <div className="text-center mb-6 md:mb-12 px-4 py-3 md:py-6">
        {/* Main Title with Enhanced Typography */}
        <div className="relative mb-3 md:mb-6">
          <h2 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2 font-serif tracking-tight leading-tight">
            Camp Memories
          </h2>
          <div className="absolute -top-2 -left-2 w-full h-full bg-gradient-to-r from-amber-200/20 via-orange-200/20 to-red-200/20 blur-xl -z-10 rounded-lg"></div>
        </div>

        {/* Enhanced Decorative Divider - Removed for mobile */}
        <div className="hidden md:flex items-center justify-center mb-6">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent w-32"></div>
          <div className="mx-6 text-2xl text-amber-500 animate-pulse">✨</div>
          <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent w-32"></div>
        </div>

        {/* Enhanced Description with Better Typography */}
        <div className="max-w-3xl mx-auto mb-2 md:mb-4">
          <p className="text-base md:text-2xl text-gray-700 leading-relaxed font-light tracking-wide">
            Relive the <span className="text-amber-700 font-medium">sacred moments</span> from our spiritual journey in Braj
          </p>
        </div>
      </div>

      {/* Main Gallery */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-transparent">
        {/* Navigation Buttons - Enhanced for smoother interaction */}
        <button
          onClick={goToPrevious}
          disabled={isDragging}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 p-4 bg-white/30 backdrop-blur-md rounded-full text-orange-600 hover:bg-white/40 transition-all duration-200 hover:scale-110 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
        >
          <ChevronLeft size={28} />
        </button>
        
        <button
          onClick={goToNext}
          disabled={isDragging}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-40 p-4 bg-white/30 backdrop-blur-md rounded-full text-orange-600 hover:bg-white/40 transition-all duration-200 hover:scale-110 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
        >
          <ChevronRight size={28} />
        </button>

        <div 
          ref={containerRef}
          className="flex items-center justify-center h-full cursor-grab active:cursor-grabbing select-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => pauseOnHover && setIsHovered(true)}
          onMouseLeave={() => pauseOnHover ? setIsHovered(false) : handleMouseUp()}
        >
          <div 
            ref={galleryRef}
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transform: `translateX(${dragOffset}px)`,
              transition: isDragging ? 'none' : 'transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            {visibleImages.map(({ src, index, position }) => {
              const isCenter = position === 0;
              const isPriority = Math.abs(position) <= 1;
              
              return (
                <div
                  key={`${index}-${position}`}
                  className={`absolute transition-all duration-1500 ease-out cursor-pointer ${
                    isCenter
                      ? 'z-30 scale-110 opacity-100' 
                      : position === -1 || position === 1
                      ? 'z-20 scale-100 opacity-95'
                      : 'z-10 scale-90 opacity-80'
                  }`}
                  style={{
                    transform: `translateX(${position * spacing}px) rotateY(${position * 1.5}deg) translateZ(${isCenter ? '20px' : '0px'})`,
                  }}
                >
                  <div
                    style={{
                      width: `${imageWidth}px`,
                      height: `${imageHeight}px`
                    }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl border-3 border-orange-200/60 hover:border-orange-300/80 transition-all duration-500 hover:scale-105 hover:shadow-3xl"
                  >
                    <ProgressiveImage
                       src={src || ''}
                       alt={`Camp memory ${index + 1}`}
                       className="w-full h-full object-cover rounded-lg transition-opacity duration-200 ease-out"
                       priority={isPriority}
                     />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
       </div>
     </>
   );
 });

export default RollingGallery;
