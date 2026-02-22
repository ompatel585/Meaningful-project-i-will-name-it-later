import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Brand value propositions carousel data
  const brandSlides = [
    {
      id: 1,
      title: "Best Dining Experience",
      subtitle: "Discover extraordinary culinary journeys",
      description:
        "From local hidden gems to Michelin-starred restaurants, find your perfect dining destination. Every reservation is a promise of exceptional taste and memorable moments.",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
      icon: "utensils",
      color: "from-indigo-600 to-purple-600",
    },
    {
      id: 2,
      title: "Best Values & Deals",
      subtitle: "Save more, dine more",
      description:
        "Exclusive discounts, special offers, and member-only benefits. We negotiate the best prices so you can enjoy premium dining without premium costs.",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200",
      icon: "tag",
      color: "from-amber-500 to-orange-600",
    },
    {
      id: 3,
      title: "Best Terms Guaranteed",
      subtitle: "Your satisfaction, our commitment",
      description:
        "Free cancellation, no hidden fees, and transparent pricing. We believe in fair deals that protect both diners and restaurants alike.",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200",
      icon: "shield",
      color: "from-emerald-500 to-teal-600",
    },
    {
      id: 4,
      title: "Seamless Booking",
      subtitle: "Reserve in seconds, not minutes",
      description:
        "Intuitive interface with instant confirmations. Book your table anywhere, anytime - desktop or mobile. Your next great meal is just a click away.",
      image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200",
      icon: "clock",
      color: "from-blue-500 to-cyan-600",
    },
    {
      id: 5,
      title: "Verified Reviews",
      subtitle: "Trust what you choose",
      description:
        "Authentic reviews from real diners. Our verification system ensures you get honest insights to make the perfect choice for your occasion.",
      image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200",
      icon: "star",
      color: "from-rose-500 to-pink-600",
    },
    {
      id: 6,
      title: "24/7 Support",
      subtitle: "We're always here for you",
      description:
        "Round-the-clock customer support for reservations, changes, or any queries. Your dining experience matters to us, anytime day or night.",
      image:
        "https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=1200",
      icon: "heart",
      color: "from-violet-500 to-purple-600",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === brandSlides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? brandSlides.length - 1 : prev - 1));
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const renderIcon = (iconName) => {
    const icons = {
      utensils: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
      tag: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      ),
      shield: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      clock: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      star: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      heart: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    };
    return icons[iconName] || icons.star;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgNHYyaC0ydi0yaDJ6bTQtOGgydjJoLTJ2LTJ6bS04IDhoMnYyaC0ydi0yek0zMiAyNnYyaC0ydi0yaDJ6bS04IDhoMnYyaC0ydi0yek0zMiAyNnYyaC0ydi0yaDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                🏆 #1 Restaurant Reservation Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Reserve Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
                Dining Experience
              </span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 md:mb-10 max-w-2xl mx-auto px-4">
              Discover and book tables at the best restaurants in your city.
              Experience fine dining made simple with unbeatable values and
              guaranteed satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Link
                to="/restaurants"
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-indigo-600 font-bold rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 text-base md:text-lg"
              >
                Explore Restaurants
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="px-6 md:px-8 py-3 md:py-4 bg-white/10 text-white font-bold rounded-xl md:rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 text-base md:text-lg backdrop-blur-sm"
                >
                  Get Started Free
                </Link>
              )}
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-10 md:mt-14">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  50K+
                </div>
                <div className="text-indigo-200 text-sm md:text-base">
                  Happy Diners
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  2,500+
                </div>
                <div className="text-indigo-200 text-sm md:text-base">
                  Partner Restaurants
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  4.9★
                </div>
                <div className="text-indigo-200 text-sm md:text-base">
                  Average Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  100%
                </div>
                <div className="text-indigo-200 text-sm md:text-base">
                  Satisfaction
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </div>

      {/* Brand Value Carousel */}
      <div className="py-16 md:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-4">
              Why Choose ReserveTable?
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
              We're committed to providing you with the best dining experience,
              unbeatable values, and terms that put you first.
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-5xl mx-auto">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform group"
              aria-label="Previous slide"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-12 h-12 md:w-14 md:h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform group"
              aria-label="Next slide"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 text-slate-600 group-hover:text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Carousel Slides */}
            <div className="overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {brandSlides.map((slide) => (
                  <div key={slide.id} className="w-full flex-shrink-0">
                    <div
                      className={`bg-gradient-to-br ${slide.color} relative overflow-hidden`}
                    >
                      {/* Background Image Overlay */}
                      <div className="absolute inset-0 opacity-20">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="relative p-8 md:p-12 lg:p-16">
                        <div className="max-w-3xl mx-auto text-center">
                          {/* Icon */}
                          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <div className="text-white">
                              {renderIcon(slide.icon)}
                            </div>
                          </div>

                          {/* Content */}
                          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
                            {slide.title}
                          </h3>
                          <p className="text-lg md:text-xl text-white/90 font-medium mb-4 md:mb-6">
                            {slide.subtitle}
                          </p>
                          <p className="text-white/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
                            {slide.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-6">
              {brandSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-indigo-600 w-8"
                      : "bg-slate-300 w-2 hover:bg-slate-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-4">
              More Reasons to Love Us
            </h2>
            <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
              Everything you need for the perfect dining experience
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Easy Discovery
              </h3>
              <p className="text-slate-500">
                Find restaurants by cuisine, location, price, or rating. Smart
                search makes it simple.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Instant Confirmation
              </h3>
              <p className="text-slate-500">
                Get immediate booking confirmation via email and SMS. No
                waiting, no uncertainty.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Smart Reminders
              </h3>
              <p className="text-slate-500">
                Never miss a reservation with automated reminders sent to your
                phone.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Location Based
              </h3>
              <p className="text-slate-500">
                Find great restaurants near you with our smart geolocation
                feature.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gradient-to-br from-slate-50 to-rose-50 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Earn Rewards
              </h3>
              <p className="text-slate-500">
                Loyalty program with points, exclusive offers, and special
                member perks.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gradient-to-br from-slate-50 to-cyan-50 rounded-2xl p-6 md:p-8 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                24/7 Support
              </h3>
              <p className="text-slate-500">
                Our team is always here to help. Reach out anytime for
                assistance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-20 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">
            Ready for the Best Dining Experience?
          </h2>
          <p className="text-lg md:text-xl text-indigo-100 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of happy diners who reserve their favorite tables
            with us.
          </p>
          {isAuthenticated ? (
            <Link
              to="/restaurants"
              className="inline-block px-8 md:px-10 py-3 md:py-5 bg-white text-indigo-600 font-bold rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 text-base md:text-lg"
            >
              Browse Restaurants
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block px-8 md:px-10 py-3 md:py-5 bg-white text-indigo-600 font-bold rounded-xl md:rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 hover:-translate-y-1 text-base md:text-lg"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
