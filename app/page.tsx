// app/page.tsx

import AvatarGrid from "./components/AvatarGrid";
import FeaturedCarousel from "./components/FeaturedCarousel";
import Hero from "./components/Hero";
import { avatars } from "./lib/avatars";
import { Metadata } from "next";

// --- METADATA FOR SEO & SOCIAL SHARING ---
export const metadata: Metadata = {
  title: "AI Avatar Platform | Your Personal AI Companion",
  description:
    "Engage with intelligent 3D AI assistants. Practice conversations, explore ideas, and achieve your goals with a judgment-free companion.",

  // Open Graph (for Facebook, LinkedIn, etc.)
  openGraph: {
    title: "AI Avatar Platform | Your Personal AI Companion",
    description:
      "Experience the future of interaction with lifelike AI avatars.",
    url: "https://ava-ai-five.vercel.app/", // IMPORTANT: Replace with your actual deployed URL
    siteName: "AI Avatar Platform",
    images: [
      {
        url: "/og/landing.png", // Path to your OG image in the /public folder
        width: 1200,
        height: 630,
        alt: "AI Avatar Platform Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "AI Avatar Platform | Your Personal AI Companion",
    description:
      "Engage with intelligent 3D AI assistants. Practice conversations, explore ideas, and achieve your goals.",
    // creator: '@yourTwitterHandle', // Optional: add your Twitter handle
    images: ["/og/landing.png"], // Must be the same as og:image
  },

  // Robots and Canonical URL
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // We can add the canonical URL once deployed
  alternates: {
    canonical: "https://ava-ai-five.vercel.app/",
  },
};

export default function LandingPage() {
  const featuredAvatars = avatars.filter((a) => a.featured);
  const gridAvatars = avatars.filter((a) => !a.featured);

  return (
    <>
      <main>
        <Hero />
        <FeaturedCarousel avatars={featuredAvatars} />

        <section className="py-16 px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What do you need assistance with?
          </h2>
          <AvatarGrid avatars={gridAvatars} />
        </section>
      </main>
    </>
  );
}
