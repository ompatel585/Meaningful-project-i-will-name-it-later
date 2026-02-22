import { Link } from "react-router-dom";

const HelpCenter = () => {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "How do I create an account?",
          a: "Click on the 'Register' button in the navigation bar. Fill in your name, email, and password. You can choose to register as a regular user or a restaurant owner."
        },
        {
          q: "How do I make a reservation?",
          a: "Browse restaurants, select one you like, choose your preferred date, time, and party size, then confirm your booking."
        },
        {
          q: "Can I modify or cancel my reservation?",
          a: "Yes, go to 'My Reservations' to view and manage your bookings. You can cancel or modify reservations based on the restaurant's policy."
        }
      ]
    },
    {
      category: "For Restaurant Owners",
      questions: [
        {
          q: "How do I list my restaurant?",
          a: "Click on 'Become a Partner' in the footer or navigation. Fill out the application form with your restaurant details. Our team will review your application."
        },
        {
          q: "How do I manage reservations?",
          a: "Restaurant owners can manage reservations through their dashboard. Access it via 'Partner Login' in the footer."
        },
        {
          q: "Can I update my restaurant's menu and hours?",
          a: "Yes, partners can update their restaurant details, menu, operating hours, and manage tables from their owner dashboard."
        }
      ]
    },
    {
      category: "Payments & Billing",
      questions: [
        {
          q: "Is there a fee to use ReserveTable?",
          a: "ReserveTable is free for customers. Restaurant owners can choose from different pricing plans based on their needs."
        },
        {
          q: "How do I get my earnings?",
          a: "Restaurant owners receive payouts according to their selected billing cycle. Contact our support for payment-related inquiries."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Help Center</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help..."
              className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            />
            <button className="absolute right-2 top-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Search
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link to="/contact-us" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Contact Us</h3>
            <p className="text-slate-600">Get in touch with our support team</p>
          </Link>

          <Link to="/apply-restaurant" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Become a Partner</h3>
            <p className="text-slate-600">List your restaurant on our platform</p>
          </Link>

          <Link to="/pricing" className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Pricing</h3>
            <p className="text-slate-600">View our competitive pricing plans</p>
          </Link>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Frequently Asked Questions</h2>
          
          {faqs.map((category, idx) => (
            <div key={idx} className="mb-8">
              <h3 className="text-xl font-semibold text-slate-700 mb-4">{category.category}</h3>
              <div className="space-y-4">
                {category.questions.map((faq, faqIdx) => (
                  <div key={faqIdx} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <details className="group">
                      <summary className="flex items-center justify-between p-6 cursor-pointer">
                        <span className="font-medium text-slate-800">{faq.q}</span>
                        <span className="transition-transform group-open:rotate-180">
                          <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600">
                        {faq.a}
                      </div>
                    </details>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="mb-6 opacity-90">Our support team is here to help you with any questions you may have.</p>
          <Link to="/contact-us" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
