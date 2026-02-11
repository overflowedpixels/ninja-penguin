import { useState, useEffect, useRef } from 'react';

export default function SolarEnergyPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());

  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const observers = [];
    const refs = [
      { ref: heroRef, name: 'hero' },
      { ref: servicesRef, name: 'services' },
      { ref: aboutRef, name: 'about' },
      { ref: ctaRef, name: 'cta' }
    ];

    refs.forEach(({ ref, name }) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setVisibleSections((prev) => {
              const newSet = new Set(prev);
              if (entry.isIntersecting) {
                newSet.add(name);
              } else {
                newSet.delete(name);
              }
              return newSet;
            });
          });
        },
        { threshold: 0.2 }
      );

      if (ref.current) {
        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">SolarEnergy</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Home
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                About
              </a>
              <a href="#services" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Services
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Contact
              </a>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Get a Quote
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-600 hover:text-gray-900 font-medium">Home</a>
                <a href="#about" className="text-gray-600 hover:text-gray-900 font-medium">About</a>
                <a href="#services" className="text-gray-600 hover:text-gray-900 font-medium">Services</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 font-medium">Contact</a>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium w-full">
                  Get a Quote
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        id="home" 
        className={`relative h-[500px] flex items-center overflow-hidden transition-all duration-1000 ${
          visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <img 
          src="/solar main.png" 
          alt="Solar panel installation with worker" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className={`max-w-xl transition-all duration-1000 delay-200 ${
            visibleSections.has('hero') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
          }`}>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Powering a<br />
              Sustainable Future
            </h1>
            <p className="text-lg text-white mb-8">
              High-quality solar panels for homes and businesses
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105">
                Get Started
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg font-medium border border-gray-300 transition-all hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Solar Solutions Section - Overlapping */}
      <section 
        ref={servicesRef}
        id="services" 
        className={`relative -mt-24 pb-16 bg-transparent transition-all duration-1000 ${
          visibleSections.has('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-8 md:p-12 shadow-xl">
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-12 transition-all duration-700 delay-100 ${
              visibleSections.has('services') ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
            }`}>
              Our Solar Solutions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 - Residential Solar */}
              <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-700 delay-200 hover:-translate-y-2 ${
                visibleSections.has('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="/solar main.png" 
                    alt="Residential solar panels on house" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Lorem ipsum
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Card 2 - Commercial Solar */}
              <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-700 delay-300 hover:-translate-y-2 ${
                visibleSections.has('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="/solar main.png" 
                    alt="Commercial solar panel installation" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Lorem ipsum
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                    Learn More
                  </button>
                </div>
              </div>

              {/* Card 3 - Solar Maintenance */}
              <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-700 delay-[400ms] hover:-translate-y-2 ${
                visibleSections.has('services') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src="/solar main.png" 
                    alt="Large scale solar panel field" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Lorem ipsum
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - UPDATED */}
      <section 
        ref={aboutRef}
        id="about" 
        className={`py-16 bg-white transition-all duration-1000 ${
          visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-12 shadow-lg relative overflow-hidden min-h-[600px]">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
              {/* Top Left - Image 1 */}
              <div className={`relative transition-all duration-700 delay-100 ${
                visibleSections.has('about') ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-10 -translate-y-10'
              }`}>
                <div className="rounded-2xl overflow-hidden shadow-lg h-64 lg:h-80">
                  <img 
                    src="/solar main 1.png" 
                    alt="Solar technicians installing panels" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>

              {/* Top Right - Content */}
              <div className={`relative z-10 transition-all duration-700 delay-200 ${
                visibleSections.has('about') ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-10 -translate-y-10'
              }`}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  About Us
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Leading Provider of Solar Energy Solutions
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className={`flex items-center space-x-3 transition-all duration-500 delay-300 ${
                    visibleSections.has('about') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                  }`}>
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">High-Quality Products</span>
                  </div>
                  <div className={`flex items-center space-x-3 transition-all duration-500 delay-[400ms] ${
                    visibleSections.has('about') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                  }`}>
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Expert Installation</span>
                  </div>
                  <div className={`flex items-center space-x-3 transition-all duration-500 delay-500 ${
                    visibleSections.has('about') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
                  }`}>
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Affordable Pricing</span>
                  </div>
                </div>

                <button className={`bg-white hover:bg-gray-50 text-blue-600 px-6 py-3 rounded-lg font-medium border-2 border-blue-600 transition-all hover:scale-105 duration-500 delay-[600ms] ${
                  visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}>
                  Learn more
                </button>
              </div>

              {/* Bottom Right - Image 2 */}
              <div className={`lg:col-start-2 relative transition-all duration-700 delay-300 ${
                visibleSections.has('about') ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 translate-x-10 translate-y-10'
              }`}>
                <div className="rounded-2xl overflow-hidden shadow-lg h-64 lg:h-80 lg:mt-8">
                  <img 
                    src="/solar main.png" 
                    alt="House with solar panels and service van" 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Switch Section */}
      <section 
        ref={ctaRef}
        className={`py-16 bg-white transition-all duration-1000 ${
          visibleSections.has('cta') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-lg">
            <img 
              src="/sky.png" 
              alt="Solar panels against blue sky" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-00/80"></div>
            
            <div className={`relative z-10 text-center py-20 px-4 transition-all duration-700 delay-200 ${
              visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Switch to Solar?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Contact us today for a free consultation
              </p>
              <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:scale-105">
                Get a Free Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-yellow-400 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">SolarEnergy</span>
            </div>
            <p className="text-gray-400">
              © 2024 SolarEnergy. All rights reserved. Powering a sustainable future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}