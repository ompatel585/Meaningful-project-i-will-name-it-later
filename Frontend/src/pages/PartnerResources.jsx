import { Link } from "react-router-dom";

const PartnerResources = () => {
  const resources = [
    {
      category: "Getting Started",
      items: [
        {
          title: "Quick Start Guide",
          description:
            "Learn how to set up your restaurant profile and start accepting reservations in minutes.",
          icon: "🚀",
          link: "#",
        },
        {
          title: "Video Tutorials",
          description:
            "Watch step-by-step videos on managing your dashboard, reservations, and more.",
          icon: "🎥",
          link: "#",
        },
        {
          title: "Best Practices",
          description:
            "Tips and tricks to maximize your bookings and improve customer experience.",
          icon: "💡",
          link: "#",
        },
      ],
    },
    {
      category: "Managing Your Restaurant",
      items: [
        {
          title: "Profile Management",
          description:
            "How to update your restaurant details, photos, menu, and operating hours.",
          icon: "📝",
          link: "#",
        },
        {
          title: "Reservation Management",
          description:
            "Learn to accept, modify, and cancel reservations effectively.",
          icon: "📅",
          link: "#",
        },
        {
          title: "Table Configuration",
          description:
            "Set up your tables, capacity, and seating arrangements.",
          icon: "🪑",
          link: "#",
        },
        {
          title: "Review Management",
          description:
            "Respond to customer reviews and build your online reputation.",
          icon: "⭐",
          link: "#",
        },
      ],
    },
    {
      category: "Marketing & Growth",
      items: [
        {
          title: "Boost Your Visibility",
          description:
            "Tips to improve your ranking and attract more customers.",
          icon: "📈",
          link: "#",
        },
        {
          title: "Special Offers",
          description:
            "Create promotions and special deals to attract more guests.",
          icon: "🎁",
          link: "#",
        },
        {
          title: "Social Media Guide",
          description: "Leverage social media to promote your restaurant.",
          icon: "📱",
          link: "#",
        },
      ],
    },
    {
      category: "Billing & Payments",
      items: [
        {
          title: "Understanding Your Bill",
          description: "Learn about pricing, commissions, and billing cycles.",
          icon: "💳",
          link: "#",
        },
        {
          title: "Payment Settings",
          description: "Set up and manage your payout preferences.",
          icon: "🏦",
          link: "#",
        },
        {
          title: "Invoice & Reports",
          description: "Access your invoices and financial reports.",
          icon: "📊",
          link: "#",
        },
      ],
    },
  ];

  const faqs = [
    {
      q: "How do I update my restaurant's operating hours?",
      a: "Go to your Dashboard > Restaurant > Edit Profile. You can update your operating hours under the 'Hours' section.",
    },
    {
      q: "Can I manage multiple table configurations?",
      a: "Yes! You can create different table configurations for various occasions like private dining, outdoor seating, etc.",
    },
    {
      q: "How do I respond to customer reviews?",
      a: "Navigate to Reviews in your dashboard. You can respond to each review directly from there.",
    },
    {
      q: "What happens if a customer doesn't show up?",
      a: "You can mark no-shows in your reservation system. This helps with accurate tracking and analytics.",
    },
    {
      q: "Can I offer discounts or special promotions?",
      a: "Yes, go to Marketing > Special Offers to create promotions. You can set date ranges, discount amounts, and specific conditions.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Partner Resources
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to succeed as a ReserveTable partner. Find
            guides, tutorials, and answers to common questions.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/manage-restaurant"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
              🏠
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Partner Dashboard
            </h3>
            <p className="text-slate-600">
              Manage your restaurant, reservations, and reviews
            </p>
          </Link>

          <Link
            to="/pricing"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
              💰
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Pricing Plans
            </h3>
            <p className="text-slate-600">
              View our competitive pricing and plans
            </p>
          </Link>

          <Link
            to="/contact-us"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 text-2xl">
              💬
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Get Support
            </h3>
            <p className="text-slate-600">Contact our partner support team</p>
          </Link>
        </div>

        {/* Resources by Category */}
        <div className="space-y-12 mb-12">
          {resources.map((category, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.items.map((item, itemIdx) => (
                  <a
                    key={itemIdx}
                    href={item.link}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between p-6 cursor-pointer">
                    <span className="font-medium text-slate-800">{faq.q}</span>
                    <span className="transition-transform group-open:rotate-180">
                      <svg
                        className="w-5 h-5 text-slate-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-6 text-slate-600">{faq.a}</div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
          <p className="mb-6 opacity-90">
            Our dedicated partner support team is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact-us"
              className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/apply-restaurant"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerResources;
