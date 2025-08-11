// app/page.tsx

import AvatarGrid from "./components/AvatarGrid";
import FeaturedCarousel from "./components/FeaturedCarousel";
import Hero from "./components/Hero";
import { avatars } from "./lib/avatars";

export default function LandingPage() {
  const featuredAvatars = avatars.filter((a) => a.featured);
  const gridAvatars = avatars.filter((a) => !a.featured);

  return (
    // Note: The body's bg-black is set in layout.tsx
    <>
      <main>
        <Hero />
        {/* Render the Featured Carousel with only featured avatars */}
        <FeaturedCarousel avatars={featuredAvatars} />
        <section className="py-16 px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            What do you need assistance with?
          </h2>
          {/* Render the Grid with the rest of the avatars */}
          <AvatarGrid avatars={gridAvatars} />
        </section>
      </main>
    </>
  );
}
