// app/pricing/page.tsx
import { Metadata } from "next";
import ClientPricingPage from "../components/ClientPricingPage";

// --- METADATA FOR SEO & SOCIAL SHARING ---
// This is the correct place for the metadata object.
export const metadata: Metadata = {
  title: "Pricing | AI Avatar Platform",
  description:
    "Explore our flexible plans. Start for free and scale up with our Creator and Business tiers to unlock the full potential of AI avatars.",
  openGraph: {
    title: "Pricing Plans for the AI Avatar Platform",
    description:
      "Find the perfect plan for your needs, from hobbyist to enterprise.",
    url: "https://ava-ai-five.vercel.app/pricing", // IMPORTANT: Use the full URL for this specific page
    // You can create a specific OG image for the pricing page if you wish
    images: [
      {
        url: "/og/pricing-og.png", // e.g., /public/og/pricing-og.png
        width: 1200,
        height: 630,
        alt: "AI Avatar Platform Pricing Tiers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | AI Avatar Platform",
    description: "Explore our flexible plans for the AI Avatar Platform.",
    images: ["/og/pricing-og.png"],
  },
  alternates: {
    canonical: "https://ava-ai-five.vercel.app/pricing", // Canonical URL for this page
  },
};

// This is a Server Component. It does no client-side work.
export default function Pricing() {
  // We simply render the client component that contains all the interactive logic.
  return <ClientPricingPage />;
}
