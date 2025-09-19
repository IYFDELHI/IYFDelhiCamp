'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useAnimation, useTransform, PanInfo, ResolvedValues } from 'motion/react';
import Image from 'next/image';

// Local images from public/images/photos
const LOCAL_IMGS: string[] = [
  '/images/photos/BLESSING.JPG',
  '/images/photos/HAPPY DEVOTEE.JPG',
  '/images/photos/HG RB PR.jpg',
  '/images/photos/HG SG PJ.JPG',
  '/images/photos/NK.JPG',
  '/images/photos/STUDENTS1.jpg',
  '/images/photos/TV.JPG',
  '/images/photos/YAMUNA SNAN.JPG'
];

interface RollingGalleryProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
  images?: string[];
}

const RollingGallery: React.FC<RollingGalleryProps> = ({ 
  autoplay = true, 
  pauseOnHover = true, 
  images = [] 
}) => {
  const galleryImages = images.length > 0 ? images : LOCAL_IMGS;

  const [isScreenSizeSm, setIsScreenSizeSm] = useState<boolean>(false);
  
  useEffect(() => {
    const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 640);
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Semi-circular configuration for smoother horizontal scrolling
  const cylinderWidth: number = isScreenSizeSm ? 1400 : 2200;
  const faceCount: number = galleryImages.length;
  const faceWidth: number = (cylinderWidth / faceCount) * 1.2;
  const radius: number = cylinderWidth / (2 * Math.PI);

  const dragFactor: number = 0.03; // Reduced for smoother dragging
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  const transform = useTransform(rotation, (val: number) => `rotate3d(0,1,0,${val}deg)`);

  const startInfiniteSpin = (startAngle: number) => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 25, // Slower for smoother animation
        ease: 'linear',
        repeat: Infinity
      }
    });
  };

  useEffect(() => {
    if (autoplay) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    } else {
      controls.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay]);

  const handleUpdate = (latest: ResolvedValues) => {
    if (typeof latest.rotateY === 'number') {
      rotation.set(latest.rotateY);
    }
  };

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor * 0.1; // Reduced velocity impact
    rotation.set(finalAngle);
    if (autoplay) {
      startInfiniteSpin(finalAngle);
    }
  };

  const handleMouseEnter = (): void => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };

  const handleMouseLeave = (): void => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };

  return (
    <div className="relative h-[400px] w-full overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Gradient overlays for smooth edges */}
      <div
        className="absolute top-0 left-0 h-full w-[80px] z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)'
        }}
      />
      <div
        className="absolute top-0 right-0 h-full w-[80px] z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)'
        }}
      />
      
      {/* Main gallery container */}
      <div className="flex h-full items-center justify-center [perspective:1200px] [transform-style:preserve-3d]">
        <motion.div
          drag="x"
          dragElastic={0.1}
          dragConstraints={{ left: 0, right: 0 }}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={controls}
          onUpdate={handleUpdate}
          style={{
            transform: transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: 'preserve-3d'
          }}
          className="flex min-h-[300px] cursor-grab active:cursor-grabbing items-center justify-center [transform-style:preserve-3d]"
        >
          {galleryImages.map((url, i) => (
            <div
              key={i}
              className="group absolute flex h-fit items-center justify-center p-[4%] [backface-visibility:hidden]"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`
              }}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 ease-out group-hover:scale-110 group-hover:shadow-3xl">
                <Image
                  src={url}
                  alt={`Camp memory ${i + 1}`}
                  width={320}
                  height={200}
                  className="pointer-events-none h-[200px] w-[320px] object-cover transition-all duration-500 ease-out group-hover:brightness-110 sm:h-[160px] sm:w-[260px]"
                />
                {/* Overlay gradient for better visual appeal */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-white/30 group-hover:border-emerald-300/50 transition-colors duration-300" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Instructions text */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-emerald-600 text-sm font-medium opacity-70">
          Drag to explore • Hover to pause
        </p>
      </div>
    </div>
  );
};

export default RollingGallery;