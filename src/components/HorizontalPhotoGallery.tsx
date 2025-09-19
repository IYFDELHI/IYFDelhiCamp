'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Photo {
  id: string;
  src: string;
  alt: string;
}

const HorizontalPhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    // Generate photo list from Photos folder
    const photoNames = [
      'BLESSING.JPG',
      'HAPPY DEVOTEE.JPG', 
      'HG RB PR.jpg',
      'HG SG PJ.JPG',
      'NK.JPG',
      'STUDENTS1.jpg',
      'TV.JPG',
      'YAMUNA SNAN.JPG'
    ];

    const photoList = photoNames.map((name, index) => ({
      id: `photo-${index}`,
      src: `/Photos/${name}`,
      alt: `Camp memory ${index + 1}`
    }));

    setPhotos(photoList);
  }, []);

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 py-8">
      <motion.div
        className="flex gap-6 px-4"
        animate={{
          x: [0, -1920],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30,
            ease: "linear",
          },
        }}
        style={{
          width: 'max-content',
        }}
      >
        {/* First set of photos */}
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            className="flex-shrink-0 w-80 h-60 relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-medium opacity-90">{photo.alt}</p>
            </div>
          </motion.div>
        ))}
        
        {/* Duplicate set for seamless loop */}
        {photos.map((photo) => (
          <motion.div
            key={`${photo.id}-duplicate`}
            className="flex-shrink-0 w-80 h-60 relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-sm font-medium opacity-90">{photo.alt}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default HorizontalPhotoGallery;