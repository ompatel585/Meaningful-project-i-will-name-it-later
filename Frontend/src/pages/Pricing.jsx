import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for new restaurants just getting started",
      features: [
        "Up to 50 reservations/month",
        "Basic restaurant profile",
        "Email support",
        "Mobile app listing",
        "Basic analytics",
      ],
      notIncluded: [
        "Priority listing",
        "SMS notifications",
        "Custom branding",
        "API access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "Best for growing restaurants with more bookings",
      features: [
        "Unlimited reservations",
        "Premium restaurant profile",
        "Priority listing in search",
        "SMS notifications",
        "Advanced analytics",
        "Customer reviews management",
        "Menu management",
        "Table management",
      ],
      notIncluded: ["Custom branding", "API access"],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$149",
      period: "/month",
      description: "For large restaurant chains and franchises",
      features: [
        "Everything in Professional",
        "Custom branding",
        "API access",
        "Dedicated account manager",
        "White-label options",
        "Multi-location management",
        "Custom integrations",
        "24/7 priority support",
      ],
      notIncluded: [],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      q: "Can I change plans anytime?",
      a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any payments.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes, the Professional plan comes with a 14-day free trial. No credit card required to start.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Absolutely. You can cancel your subscription at any time with no questions asked. You'll continue to have access until the end of your billing period.",
    },
    {
      q: "Do you offer discounts for annual billing?",
      a: "Yes! Save 20% when you choose annual billing. Contact our sales team for custom enterprise pricing.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Choose the perfect plan for your restaurant. All plans include a
            14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white rounded-2xl shadow-lg p-8 ${plan.popular ? "ring-2 ring-indigo-500 transform scale-105" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-slate-800">
                    {plan.price}
                  </span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>
                <p className="text-slate-600 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 opacity-50">
                    <svg
                      className="w-5 h-5 text-slate-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-slate-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/apply-restaurant"
                className={`block w-full py-3 rounded-lg font-semibold text-center transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                    : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">
            Why Choose ReserveTable?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Easy Setup
              </h3>
              <p className="text-slate-600">
                Get your restaurant listed in minutes with our simple onboarding
                process.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Grow Your Business
              </h3>
              <p className="text-slate-600">
                Access powerful analytics and marketing tools to attract more
                customers.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
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
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                24/7 Support
              </h3>
              <p className="text-slate-600">
                Our dedicated support team is always here to help you succeed.
              </p>
            </div>
          </div>
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

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">Ready to get started?</p>
          <Link
            to="/apply-restaurant"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Apply Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
