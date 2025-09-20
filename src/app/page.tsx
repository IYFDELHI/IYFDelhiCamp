'use client';

import { Suspense, lazy } from 'react';
import HeroSection from '@/components/HeroSection';
import Layout from '@/components/Layout/Layout';
import RegistrationPopup, { useAutoPopup } from '@/components/RegistrationPopup';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy load non-critical components
const ModernClock = lazy(() => import('@/components/ModernClock'));
const CampInformation = lazy(() => import('@/components/CampInformation'));
const MovingBanner = lazy(() => import('@/components/MovingBanner'));
const RollingGallery = lazy(() => import('@/components/RollingGallery'));

const LoadingFallback = ({ minHeight = "min-h-[200px]" }: { minHeight?: string }) => (
  <div className={`flex items-center justify-center p-8 ${minHeight}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
  </div>
);

export default function Home() {
  const { isPopupOpen, closePopup, openPopup } = useAutoPopup();

  return (
    <ErrorBoundary>
      <Layout onRegisterClick={openPopup} isPopupOpen={isPopupOpen}>
        <Suspense fallback={<LoadingFallback minHeight="min-h-[400px]" />}>
          <HeroSection onRegisterClick={openPopup} />
        </Suspense>
        
        <Suspense fallback={<LoadingFallback minHeight="min-h-[100px]" />}>
          <MovingBanner />
        </Suspense>
        
        <Suspense fallback={<LoadingFallback minHeight="min-h-[200px]" />}>
          <ModernClock />
        </Suspense>
        
        <Suspense fallback={<LoadingFallback minHeight="min-h-[400px]" />}>
          <CampInformation />
        </Suspense>
        
        <Suspense fallback={<LoadingFallback minHeight="min-h-[500px]" />}>
          <RollingGallery autoplay={true} pauseOnHover={true} />
        </Suspense>
        
        <RegistrationPopup 
          isOpen={isPopupOpen} 
          onClose={closePopup} 
        />
      </Layout>
    </ErrorBoundary>
  );
}