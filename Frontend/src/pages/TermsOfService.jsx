import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ReserveTable
              </span>
            </Link>
            <Link
              to="/"
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Terms of Service
              </h1>
              <p className="text-slate-500">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">1</span>
                  </span>
                  Acceptance of Terms
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Welcome to ReserveTable. By accessing or using our platform,
                  you agree to be bound by these Terms of Service ("Terms"). If
                  you do not agree to these Terms, please do not use our
                  services.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Important:</strong> These Terms constitute a legally
                    binding agreement between you and ReserveTable. Please read
                    them carefully.
                  </p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">2</span>
                  </span>
                  Description of Service
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  ReserveTable is a platform that connects diners with
                  restaurants, allowing users to:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Browse restaurants",
                    "Make table reservations",
                    "View restaurant details and menus",
                    "Leave reviews and ratings",
                    "Manage booking preferences",
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl"
                    >
                      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">3</span>
                  </span>
                  User Accounts
                </h2>
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="font-bold text-slate-800 mb-3">
                      Account Responsibilities
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      You are responsible for maintaining the confidentiality of
                      your account credentials and for all activities that occur
                      under your account. You agree to:
                    </p>
                    <ul className="list-disc list-inside text-slate-600 mt-3 space-y-2">
                      <li>
                        Provide accurate and complete registration information
                      </li>
                      <li>Keep your password secure and confidential</li>
                      <li>Promptly update any changes to your information</li>
                      <li>
                        Accept responsibility for all activities under your
                        account
                      </li>
                    </ul>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="font-bold text-red-800 mb-3">
                      Prohibited Activities
                    </h3>
                    <p className="text-red-700 leading-relaxed mb-3">
                      You may NOT:
                    </p>
                    <ul className="list-disc list-inside text-red-700 space-y-2">
                      <li>Create multiple accounts</li>
                      <li>Share your account credentials with others</li>
                      <li>Use the service for any unlawful purpose</li>
                      <li>
                        Attempt to gain unauthorized access to the platform
                      </li>
                      <li>Post false, misleading, or defamatory content</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">4</span>
                  </span>
                  Reservations and Payments
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="font-bold text-blue-800 mb-3">
                      Reservation Policy
                    </h3>
                    <ul className="list-disc list-inside text-blue-700 space-y-2">
                      <li>Reservations are subject to availability</li>
                      <li>
                        Some restaurants may require credit card to guarantee
                        reservation
                      </li>
                      <li>
                        You must arrive within 15 minutes of your reservation
                        time
                      </li>
                      <li>
                        Cancellations should be made at least 2 hours in advance
                      </li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="font-bold text-purple-800 mb-3">
                      No-Show Policy
                    </h3>
                    <p className="text-purple-700 leading-relaxed">
                      Failure to arrive for your reservation without proper
                      cancellation may result in:
                    </p>
                    <ul className="list-disc list-inside text-purple-700 mt-2 space-y-2">
                      <li>Temporary suspension of reservation privileges</li>
                      <li>Potential charges as per restaurant policy</li>
                      <li>Account restrictions or termination</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">5</span>
                  </span>
                  Restaurant Partners
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Restaurants listed on ReserveTable are independent partners.
                  We do not own or operate these establishments. ReserveTable is
                  not responsible for:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Food quality or safety",
                    "Service provided by restaurants",
                    "Pricing accuracy",
                    "Availability of reservations",
                    "Disputes between users and restaurants",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-red-50 p-4 rounded-xl"
                    >
                      <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-red-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">6</span>
                  </span>
                  Intellectual Property
                </h2>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-indigo-600"
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
                    </div>
                    <div>
                      <h3 className="font-bold text-indigo-800 mb-2">
                        Your Content
                      </h3>
                      <p className="text-indigo-700 leading-relaxed">
                        You retain ownership of content you submit (reviews,
                        photos, comments). By submitting content, you grant
                        ReserveTable a license to use, display, and distribute
                        it on our platform.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">7</span>
                  </span>
                  Limitation of Liability
                </h2>
                <div className="bg-slate-800 text-white rounded-xl p-6">
                  <p className="leading-relaxed">
                    <strong>
                      ReserveTable is provided "as is" without warranties of any
                      kind. We do not guarantee that the service will be
                      uninterrupted, secure, or error-free. In no event shall
                      ReserveTable be liable for any indirect, incidental,
                      special, or consequential damages.
                    </strong>
                  </p>
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">8</span>
                  </span>
                  Termination
                </h2>
                <p className="text-slate-600 leading-relaxed mb-4">
                  We reserve the right to suspend or terminate your account at
                  any time for:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Violation of these Terms",
                    "Fraudulent or illegal activity",
                    "Abuse of the platform",
                    "Non-payment (for premium features)",
                    "Harassment or inappropriate conduct",
                  ].map((reason, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-red-50 p-4 rounded-xl"
                    >
                      <svg
                        className="w-5 h-5 text-red-500 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-red-700">{reason}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">9</span>
                  </span>
                  Changes to Terms
                </h2>
                <p className="text-slate-600 leading-relaxed">
                  We may modify these Terms at any time. Continued use of
                  ReserveTable after changes constitutes acceptance of the new
                  Terms. We will notify users of material changes via email or
                  platform notification.
                </p>
              </section>

              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">10</span>
                  </span>
                  Contact Information
                </h2>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                  <p className="text-slate-600 mb-4">
                    For questions about these Terms, please contact us:
                  </p>
                  <div className="space-y-2 text-slate-700">
                    <p className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <strong>Email:</strong> legal@reservetable.com
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <div className="flex flex-col md:flex-row gap-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Home
                </Link>
                <Link
                  to="/privacy-policy"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-semibold transition-colors"
                >
                  <svg
                    className="w-5 h-5"
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
                  View Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
