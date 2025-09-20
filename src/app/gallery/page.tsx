import PhotoGallery from '@/components/PhotoGallery';
import Layout from '@/components/Layout/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';

const galleryImages = [
  {
    id: 1,
    src: '/images/STUDENTS1.jpg',
    alt: 'Students at Braj Camp',
    category: 'Students',
    description: 'Young devotees participating in spiritual activities',
    date: 'October 2024',
    location: 'Vrindavan'
  },
  {
    id: 2,
    src: '/images/TV.JPG',
    alt: 'Temple Visit',
    category: 'Temple',
    description: 'Visiting sacred temples in Braj',
    date: 'October 2024',
    location: 'Mathura'
  },
  {
    id: 3,
    src: '/images/YAMUNA SNAN.JPG',
    alt: 'Yamuna Snan',
    category: 'Rituals',
    description: 'Holy bath in the sacred Yamuna river',
    date: 'October 2024',
    location: 'Yamuna Ghat'
  },
  {
    id: 4,
    src: '/images/camp1.jpg',
    alt: 'Camp Activities',
    category: 'Activities',
    description: 'Group activities and spiritual discussions',
    date: 'October 2024',
    location: 'Braj'
  },
  {
    id: 5,
    src: '/images/camp2.jpg',
    alt: 'Devotional Singing',
    category: 'Kirtan',
    description: 'Devotional singing and chanting',
    date: 'October 2024',
    location: 'Braj'
  },
  {
    id: 6,
    src: '/images/camp3.jpg',
    alt: 'Spiritual Discourse',
    category: 'Learning',
    description: 'Learning from spiritual teachers',
    date: 'October 2024',
    location: 'Braj'
  }
];

export default function GalleryPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-4">
              Photo Gallery
            </h1>
            <p className="text-lg text-emerald-600 max-w-2xl mx-auto">
              Explore moments from our spiritual journey and community gatherings
            </p>
          </div>
          <ErrorBoundary>
            <PhotoGallery images={galleryImages} />
          </ErrorBoundary>
        </div>
      </div>
    </Layout>
  );
}