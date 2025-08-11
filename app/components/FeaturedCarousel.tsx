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
    <section className="py-16 px-10 relative">
      <h2 className="text-3xl font-bold mb-6 px-8">Latest Assistants</h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4" style={{ marginLeft: "-1rem" }}>
          {avatars.map((avatar) => (
            <div
              key={avatar.id}
              className="flex-shrink-0 w-full md:w-[80%] lg:w-[60%] pl-5"
            >
              {/* Use the new LIVE component here */}
              <LiveFeaturedCard avatar={avatar} />
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 right-8 flex gap-3">
        <button
          title="prev"
          onClick={scrollPrev}
          className="p-3 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors"
        >
          <ChevronLeft />
        </button>
        <button
          title="next"
          onClick={scrollNext}
          className="p-3 rounded-full border border-gray-700 hover:bg-gray-800 transition-colors"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
