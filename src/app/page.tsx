'use client';

import HeroSection from '@/components/HeroSection';
import Layout from '@/components/Layout/Layout';
import RollingGallery from '@/components/RollingGallery';
import ModernClock from '@/components/ModernClock';
import RegistrationPopup, { useAutoPopup } from '@/components/RegistrationPopup';
import MovingBanner from '@/components/MovingBanner';

export default function Home() {
  const { isPopupOpen, closePopup, openPopup } = useAutoPopup();

  return (
    <Layout onRegisterClick={openPopup}>
      <HeroSection onRegisterClick={openPopup} />
      
      {/* Moving Banner */}
      <MovingBanner />
      
      {/* Modern Clock Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ModernClock />
        </div>
      </section>
      
      {/* Rolling Photo Gallery Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">
              Camp Memories
            </h2>
            <p className="text-emerald-600 text-lg max-w-2xl mx-auto">
              Relive the beautiful moments from our previous camps and spiritual gatherings
            </p>
          </div>
        </div>
        <RollingGallery autoplay={true} pauseOnHover={true} />
      </section>

      {/* Registration Popup */}
      <RegistrationPopup isOpen={isPopupOpen} onClose={closePopup} />
    </Layout>
  );
}