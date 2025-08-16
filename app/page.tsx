// app/page.tsx
import { Metadata } from "next";
import { avatars } from "./lib/avatars";
import ClientLandingPage from "./components/ClientLandingPage";

// --- METADATA FOR SEO & SOCIAL SHARING ---
// This now works correctly because this is a Server Component.
export const metadata: Metadata = {
  title: "AI Avatar Platform | Your Personal AI Companion",
  description:
    "Engage with intelligent 3D AI assistants. Practice conversations, explore ideas, and achieve your goals with a judgment-free companion.",
  openGraph: {
    title: "AI Avatar Platform | Your Personal AI Companion",
    description:
      "Experience the future of interaction with lifelike AI avatars.",
    url: "https://ava-ai-five.vercel.app/",
    siteName: "AI Avatar Platform",
    images: [
      {
        url: "/og/landing.png",
        width: 1200,
        height: 630,
        alt: "AI Avatar Platform Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Avatar Platform | Your Personal AI Companion",
    description:
      "Engage with intelligent 3D AI assistants. Practice conversations, explore ideas, and achieve your goals.",
    images: ["/og/landing.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://ava-ai-five.vercel.app/", // IMPORTANT: Update with your live URL
  },
};

export default function LandingPage() {
  // This is a Server Component. We can prepare data here.
  // In the future, this is where you would fetch data from a database.
  const allAvatars = avatars;

  // We render the Client Component and pass the data down as a prop.
  return <ClientLandingPage avatars={allAvatars} />;
}
