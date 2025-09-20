'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Grid, List, Search, Heart, Share2, Download, Sparkles } from 'lucide-react';
import LazyImage from './LazyImage';
import ErrorBoundary from './ErrorBoundary';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  description?: string;
  date?: string;
  location?: string;
}

interface PhotoGalleryProps {
  images: GalleryImage[];
  title?: string;
  subtitle?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = React.memo(({ 
  images, 
  title = "Photo Gallery",
  subtitle
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get unique categories - memoized to prevent recalculation
  const categories = useMemo(() => {
    try {
      if (!images || !Array.isArray(images)) {
        return ['All'];
      }
      return ['All', ...Array.from(new Set(images.map(img => img.category)))];
    } catch (err) {
      console.error('Error processing categories:', err);
      setError('Failed to process image categories');
      return ['All'];
    }
  }, [images]);

  // Filter images based on category and search term - memoized for performance
  const filteredImages = useMemo(() => {
    try {
      if (!images || !Array.isArray(images)) {
        return [];
      }
      return images.filter(image => {
        const matchesCategory = filter === 'All' || image.category === filter;
        const matchesSearch = image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             image.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      });
    } catch (err) {
      console.error('Error filtering images:', err);
      setError('Failed to filter images');
      return [];
    }
  }, [images, filter, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // Memoized event handlers for better performance
  const handleImageClick = useCallback((image: GalleryImage) => {
    try {
      setSelectedImage(image);
    } catch (err) {
      console.error('Error selecting image:', err);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    try {
      setSelectedImage(null);
    } catch (err) {
      console.error('Error closing modal:', err);
    }
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setSearchTerm(e.target.value);
    } catch (err) {
      console.error('Error updating search term:', err);
    }
  }, []);

  const handleFilterChange = useCallback((category: string) => {
    try {
      setFilter(category);
    } catch (err) {
      console.error('Error changing filter:', err);
    }
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'masonry') => {
    try {
      setViewMode(mode);
    } catch (err) {
      console.error('Error changing view mode:', err);
    }
  }, []);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImage && event.key === 'Escape') {
        handleCloseModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, handleCloseModal]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  // Error state
  if (error) {
    return (
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-warm-cream via-soft-ivory to-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Gallery Error</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <Button 
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="premium-btn"
          >
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <ErrorBoundary>
      <section 
        className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-warm-cream via-soft-ivory to-emerald-50 relative overflow-hidden"
        role="main"
        aria-label="Photo Gallery"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.08'%3E%3Cpath d='M50 50c0-13.807-11.193-25-25-25s-25 11.193-25 25 11.193 25 25 25 25-11.193 25-25zm25-25c0-13.807-11.193-25-25-25s-25 11.193-25 25 11.193 25 25 25 25-11.193 25-25z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Enhanced Header */}
          <motion.header 
            className="text-center mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, ease: "linear", repeat: Infinity }}
              className="inline-block mb-6"
              aria-hidden="true"
            >
              <Sparkles className="w-12 h-12 text-saffron mx-auto" />
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-emerald-900 mb-6 heading-display">
              {title}
            </h1>
            {subtitle && (
              <p className="text-emerald-700 max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl mb-8 text-body leading-relaxed">
                {subtitle}
              </p>
            )}
            <div className="w-24 h-1.5 bg-gradient-to-r from-saffron via-sacred-orange to-saffron mx-auto rounded-full shadow-lg" aria-hidden="true"></div>
          </motion.header>

          {/* Enhanced Controls */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            role="toolbar"
            aria-label="Gallery controls"
          >
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-lg">
              <label htmlFor="gallery-search" className="sr-only">
                Search images
              </label>
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-saffron w-5 h-5" aria-hidden="true" />
              <input
                id="gallery-search"
                type="text"
                placeholder="Search sacred memories..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-2 border-saffron/20 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 focus:border-saffron/40 text-base transition-all duration-300 shadow-lg"
                aria-describedby="search-help"
              />
              <div id="search-help" className="sr-only">
                Search by image name or category
              </div>
            </div>

            {/* Enhanced Category Filter */}
            <div className="flex flex-wrap gap-3" role="group" aria-label="Category filters">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(category)}
                  className={`rounded-2xl px-6 py-3 text-sm font-medium transition-all duration-300 ${
                    filter === category
                      ? 'btn-sacred shadow-lg'
                      : 'border-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-white/80 backdrop-blur-sm'
                  }`}
                  aria-pressed={filter === category}
                  aria-label={`Filter by ${category} category`}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Enhanced View Mode Toggle */}
            <div className="flex gap-3" role="group" aria-label="View mode toggle">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewModeChange('grid')}
                className="rounded-2xl p-3 border-2 border-emerald-300 bg-white/80 backdrop-blur-sm"
                aria-pressed={viewMode === 'grid'}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </Button>
              <Button
                variant={viewMode === 'masonry' ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewModeChange('masonry')}
                className="rounded-2xl p-3 border-2 border-emerald-300 bg-white/80 backdrop-blur-sm"
                aria-pressed={viewMode === 'masonry'}
                aria-label="Masonry view"
              >
                <List className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Loading State */}
          {isLoading ? (
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
              aria-label="Loading gallery images"
            >
              {[...Array(8)].map((_, index) => (
                <div 
                  key={index} 
                  className="aspect-square bg-emerald-100 rounded-2xl animate-pulse"
                  aria-hidden="true"
                ></div>
              ))}
            </div>
          ) : (
            /* Gallery Grid */
            <motion.div 
              className={`grid gap-4 sm:gap-6 lg:gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              role="grid"
              aria-label={`Gallery with ${filteredImages.length} images`}
            >
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ 
                      y: -8,
                      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer glass-strong border-2 border-white/30"
                    onClick={() => handleImageClick(image)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleImageClick(image);
                      }
                    }}
                    role="gridcell"
                    tabIndex={0}
                    aria-label={`View ${image.alt} in full size`}
                  >
                    <div className={`${viewMode === 'masonry' && index % 3 === 1 ? 'aspect-[4/5]' : 'aspect-square'} overflow-hidden`}>
                      <LazyImage
                        src={image.src}
                        alt={image.alt}
                        width={240}
                        height={240}
                        quality={60}
                        className="w-full h-full object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 240px"
                      />
                        
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" aria-hidden="true"></div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          aria-label={`Like ${image.alt}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add like functionality here
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                          aria-label={`Share ${image.alt}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add share functionality here
                          }}
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Image Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1">{image.alt}</h3>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
                          {image.category}
                        </Badge>
                        {image.date && (
                          <span className="text-xs text-white/80">{image.date}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* No Results */}
          {!isLoading && filteredImages.length === 0 && (
            <motion.div 
              className="text-center py-12 sm:py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              role="status"
              aria-live="polite"
            >
              <div className="text-6xl sm:text-7xl mb-4" aria-hidden="true">🔍</div>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-2">No images found</h3>
              <p className="text-emerald-600 mb-6">Try adjusting your search or filter criteria</p>
              <Button 
                onClick={() => {
                  setFilter('All');
                  setSearchTerm('');
                }}
                className="premium-btn"
                aria-label="Clear all filters and search terms"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Call to Action */}
          {!isLoading && filteredImages.length > 0 && (
            <motion.div 
              className="text-center mt-12 sm:mt-16 lg:mt-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button className="premium-btn px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-xl">
                Join Our Next Camp
              </Button>
            </motion.div>
          )}
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleCloseModal();
                }
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              tabIndex={-1}
            >
              <motion.div
                className="relative max-w-4xl max-h-[90vh] w-full"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <CardContent className="p-0">
                    {/* Close Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-4 z-10 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 rounded-full p-2"
                      onClick={handleCloseModal}
                      aria-label="Close image modal"
                    >
                      <X className="w-5 h-5" />
                    </Button>

                    {/* Image */}
                    <div className="aspect-video sm:aspect-[4/3] bg-gradient-to-br from-emerald-200 to-teal-200 flex items-center justify-center">
                      <div className="text-emerald-600 text-center">
                        <div className="text-6xl sm:text-8xl mb-4" aria-hidden="true">📸</div>
                        <p id="modal-title" className="text-xl sm:text-2xl font-semibold">{selectedImage.alt}</p>
                      </div>
                    </div>

                    {/* Image Details */}
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-2">{selectedImage.alt}</h3>
                          {selectedImage.description && (
                            <p id="modal-description" className="text-emerald-700 text-sm sm:text-base mb-2">{selectedImage.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                              {selectedImage.category}
                            </Badge>
                            {selectedImage.location && (
                              <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                                📍 {selectedImage.location}
                              </Badge>
                            )}
                            {selectedImage.date && (
                              <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                                📅 {selectedImage.date}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="rounded-xl" aria-label={`Like ${selectedImage.alt}`}>
                            <Heart className="w-4 h-4 mr-2" />
                            Like
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl" aria-label={`Share ${selectedImage.alt}`}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-xl" aria-label={`Download ${selectedImage.alt}`}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </ErrorBoundary>
  );
});

PhotoGallery.displayName = 'PhotoGallery';

export default PhotoGallery;