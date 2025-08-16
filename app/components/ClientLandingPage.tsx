// components/ClientLandingPage.tsx
"use client"; // This component is interactive

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import FeaturedCarousel from "./FeaturedCarousel";
import FilterControls from "./FilterControls";
import AvatarGrid from "./AvatarGrid";
import Hero from "./Hero";
import { AvatarConfig } from "../lib/avatars";

interface ClientLandingPageProps {
  avatars: AvatarConfig[];
}

export default function ClientLandingPage({ avatars }: ClientLandingPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const featuredAvatars = useMemo(
    () => avatars.filter((a) => a.featured),
    [avatars]
  );

  const filteredGridAvatars = useMemo(() => {
    const nonFeatured = avatars.filter((a) => !a.featured);
    if (selectedCategory === "All") {
      return nonFeatured;
    }
    return nonFeatured.filter((avatar) =>
      avatar.tags.includes(selectedCategory)
    );
  }, [avatars, selectedCategory]);

  return (
    <main>
      <Hero />
      <FeaturedCarousel avatars={featuredAvatars} />

      <section className="py-16 px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-8 text-center">
            What do you need assistance with?
          </h2>
          <FilterControls
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </motion.div>

        <AvatarGrid avatars={filteredGridAvatars} />
      </section>
    </main>
  );
}
