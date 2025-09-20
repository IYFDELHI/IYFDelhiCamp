import Layout from '@/components/Layout/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function About() {
  return (
    <Layout>
      <ErrorBoundary>
        <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-16 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 bg-clip-text text-transparent mb-6">
            About Our Braj Camps
          </h1>
          <p className="text-xl text-emerald-800 max-w-3xl mx-auto leading-relaxed">
            Discover the transformative experience of our spiritual camps rooted in ancient wisdom and modern values.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-800 mx-auto mt-8 rounded-full"></div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="premium-card mb-12 glass border border-emerald-100/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-emerald-900 mb-6">Our Mission</h2>
                <p className="text-lg text-emerald-800 mb-6 leading-relaxed">
                  Our Braj camps are designed to provide youth with a transformative experience rooted in spiritual growth, community building, and connection with nature. 
                  Nestled in the sacred lands of Braj, our camps offer a unique opportunity to explore ancient traditions while fostering modern values.
                </p>
                <p className="text-lg text-emerald-800 mb-6 leading-relaxed">
                  Through structured activities, meditation sessions, and cultural workshops, participants develop a deeper understanding of themselves and their place in the world. 
                  Our experienced guides and mentors create a safe and supportive environment for personal growth and meaningful connections.
                </p>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl neumorphic">
                <div className="bg-emerald-100 border-2 border-dashed border-emerald-300 rounded-xl w-full h-80 md:h-96" />
              </div>
            </div>
          </div>
          
          <div className="premium-card glass border border-emerald-100/30 mb-12">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8 text-center">Camp Highlights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="neumorphic p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-emerald-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="font-bold text-xl text-emerald-900 mb-3">Spiritual Growth</h3>
                <p className="text-emerald-700">Morning and evening meditation sessions with experienced guides</p>
              </div>
              <div className="neumorphic p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-emerald-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="font-bold text-xl text-emerald-900 mb-3">Cultural Learning</h3>
                <p className="text-emerald-700">Workshops on ancient wisdom and modern application</p>
              </div>
              <div className="neumorphic p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-emerald-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="font-bold text-xl text-emerald-900 mb-3">Nature Connection</h3>
                <p className="text-emerald-700">Nature walks and environmental awareness activities</p>
              </div>
              <div className="neumorphic p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-emerald-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h3 className="font-bold text-xl text-emerald-900 mb-3">Community Building</h3>
                <p className="text-emerald-700">Cultural programs and traditional arts</p>
              </div>
              <div className="neumorphic p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-emerald-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">5</span>
                </div>
                <h3 className="font-bold text-xl text-emerald-900 mb-3">Service & Responsibility</h3>
                <p className="text-emerald-700">Community service and social responsibility projects</p>
              </div>
              <div className="neumorphic p-6 rounded-2xl hover:shadow-lg transition-all duration-300 border border-emerald-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">6</span>
                </div>
                <h3 className="font-bold text-xl text-emerald-900 mb-3">Wellness</h3>
                <p className="text-emerald-700">Healthy, nutritious meals and comfortable accommodation</p>
              </div>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="premium-card glass border border-emerald-100/30 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-emerald-900 mb-6">Ready to Transform Your Life?</h2>
              <p className="text-emerald-800 mb-8 text-lg">
                Join our next Braj camp and experience spiritual growth, community building, and connection with nature in the serene landscapes of Braj.
              </p>
              <a 
                href="/register" 
                className="premium-btn inline-block px-8 py-4 text-lg rounded-xl"
              >
                Register for Upcoming Camp
              </a>
            </div>
          </div>
        </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
}