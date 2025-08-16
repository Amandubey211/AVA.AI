// components/ClientPricingPage.tsx
"use client"; // This is the interactive part

import { motion, Variants } from "framer-motion";
import { CheckCircle, Zap, Briefcase, User } from "lucide-react";
import Link from "next/link";

// --- Pricing Plan Data ---
const pricingPlans = [
  {
    name: "Explorer",
    icon: User,
    price: "Free",
    description:
      "For individuals and hobbyists starting their journey with AI avatars.",
    features: [
      "Access to 2 standard avatars",
      "50 chat messages per month",
      "Standard voice & animation",
      "Community support",
    ],
    cta: "Start for Free",
    isFeatured: false,
  },
  {
    name: "Creator",
    icon: Zap,
    price: "$24",
    priceSuffix: "/ month",
    description:
      "For power users, developers, and creators building unique experiences.",
    features: [
      "Access to all 12+ avatars",
      "2,000 chat messages per month",
      "Premium, high-quality voices",
      "Advanced animation controls",
      "Priority email support",
    ],
    cta: "Get Started",
    isFeatured: true,
  },
  {
    name: "Business",
    icon: Briefcase,
    price: "Contact Us",
    description:
      "For companies integrating AI avatars into their products and services.",
    features: [
      "Unlimited chat messages",
      "Custom avatar creation",
      "API access & integration support",
      "Dedicated account manager",
      "Team collaboration features",
    ],
    cta: "Contact Sales",
    isFeatured: false,
  },
];

export default function ClientPricingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <main className="flex min-h-screen w-full pt-20 flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 inline-block px-4 py-2 text-sm font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full"
        >
          Platform is under development. Pricing will be finalized upon launch.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Find the Perfect Plan
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 text-lg text-gray-400"
        >
          Start for free and scale up as you grow. No credit card required for
          the Explorer plan.
        </motion.p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 max-w-6xl w-full"
      >
        {pricingPlans.map((plan) => (
          <motion.div
            key={plan.name}
            variants={itemVariants}
            className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
              plan.isFeatured
                ? "bg-gray-800/50 border-purple-500 shadow-2xl shadow-purple-500/10"
                : "bg-gray-900/50 border-white/10 hover:border-white/20"
            }`}
          >
            {plan.isFeatured && (
              <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-3 py-1 text-sm font-semibold text-white bg-purple-600 rounded-full">
                Most Popular
              </div>
            )}

            <div className="flex-grow">
              <div className="flex items-center gap-4">
                <plan.icon
                  className={
                    plan.isFeatured ? "text-purple-400" : "text-gray-400"
                  }
                  size={28}
                />
                <h3 className="text-2xl font-bold">{plan.name}</h3>
              </div>
              <p className="mt-4 text-gray-400 h-16">{plan.description}</p>
              <div className="mt-6">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                {plan.priceSuffix && (
                  <span className="text-gray-400">{plan.priceSuffix}</span>
                )}
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-1 text-green-500 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="#" className="w-full mt-10">
              <motion.button
                className={`w-full py-3 rounded-lg font-semibold transition-colors duration-300 ${
                  plan.isFeatured
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "bg-white/10 hover:bg-white/20 text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {plan.cta}
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </main>
  );
}
