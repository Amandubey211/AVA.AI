// components/FeaturedCarousel.tsx
"use client";
import useEmblaCarousel from "embla-carousel-react";
import LiveFeaturedCard from "./LiveFeaturedCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { AvatarConfig } from "../lib/avatars";

export default function FeaturedCarousel({
  avatars,
}: {
  avatars: AvatarConfig[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    // --- RESPONSIVE FIX: Reduced padding on mobile ---
    <section className="py-16 px-4 sm:px-10 relative">
      <h2 className="text-3xl font-bold mb-6 px-4 sm:px-8">
        Latest Assistants
      </h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4" style={{ marginLeft: "-1rem" }}>
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              // --- RESPONSIVE FIX: Adjust slide width for different screen sizes ---
              className="flex-shrink-0 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] pl-4"
            >
              <LiveFeaturedCard avatar={avatar} />
            </div>
          ))}
        </div>
      </div>
      {/* --- RESPONSIVE FIX: Make buttons smaller and position better on mobile --- */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 flex gap-2 sm:gap-3">
        <button
          title="prev"
          onClick={scrollPrev}
          className="p-2 sm:p-3 rounded-full border border-gray-700 bg-black/50 hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          title="next"
          onClick={scrollNext}
          className="p-2 sm:p-3 rounded-full border border-gray-700 bg-black/50 hover:bg-gray-800 transition-colors"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </section>
  );
}
