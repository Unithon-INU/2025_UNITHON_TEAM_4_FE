import { MapPin, Calendar, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/Badge";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { Festival } from "./FestivalGrid";
import { useTranslation } from "react-i18next";
interface FeaturedFestivalSliderProps {
  festivals: Festival[];
}

export function FeaturedFestivalSlider({ festivals }: FeaturedFestivalSliderProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAutoPlaying || festivals.length <= 1) return;
    progressRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % festivals.length);
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isAutoPlaying, festivals.length, setCurrentIndex]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  const goToPrevious = () => goToSlide((currentIndex - 1 + festivals.length) % festivals.length);
  const goToNext = () => goToSlide((currentIndex + 1) % festivals.length);

  if (festivals.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-[#ff651b]" />
          <h2 className="text-2xl font-bold text-[#1f2328]">{t("featuredFestival.featured")}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goToNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {festivals.map((festival) => (
            <div key={festival.id} className="w-full flex-shrink-0">
              <Link to={`/festival/${festival.id}/${festival.contenttypeid}`} className="block">
                <div className="relative flex h-80 items-center overflow-hidden px-8 lg:h-96">
                  <div className="absolute inset-0">
                    <img
                      src={festival.image || "/placeholder.svg"}
                      alt={festival.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://placehold.co/1200x400/e2e8f0/64748b?text=Festival+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                  </div>
                  <div className="relative z-10 flex h-full w-full items-center">
                    <div className="container flex items-center justify-between">
                      <div className="max-w-2xl space-y-4 text-[#Fffefb]">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-[#ff651b]/90 text-[#fffefb] hover:bg-[#ff651b] border-[#fffefb]/30">
                            {t("featuredFestival.badgeFeatured")}
                          </Badge>
                          {/* <Badge
                            variant="outline"
                            className="border-white/30 bg-white/10 text-[#fffefb]"
                          >
                            {festival.keywords[0]}
                          </Badge> */}
                        </div>
                        <h3 className="text-3xl font-bold leading-tight lg:text-4xl line-clamp-1 mb-1 pb-1">
                          {festival.name}
                        </h3>
                        <div className="flex flex-col space-y-2 text-[#Fffefb]/80">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#ff651b]" />
                            <span className="text-sm lg:text-base line-clamp-1">{festival.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-[#ff651b]" />
                            <span className="text-sm lg:text-base">{festival.period}</span>
                          </div>
                        </div>
                        <p className="max-w-lg text-sm leading-relaxed text-[#fffefb]/80 lg:text-base line-clamp-3 min-h-[4rem]">
                          {festival.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {festival.keywords.slice(1, 4).map((keyword) => (
                            <Badge
                              key={keyword}
                              variant="outline"
                              className="border-[#fffefb]/30 bg-[#fffefb]/10 text-[#fffefb] hover:bg-[#fffefb]/20"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        <Button variant="ghost" className="mt-4 bg-[#ff651b]/90 hover:bg-[#ff651b]">
                          {t("featuredFestival.viewDetail")}
                        </Button>
                      </div>
                      <div className="hidden lg:block">
                        <div className="relative h-64 w-80 overflow-hidden rounded-xl shadow-2xl">
                          <img
                            src={festival.image || "/placeholder.svg"}
                            alt={festival.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "https://placehold.co/320x256/e2e8f0/64748b?text=Festival+Image";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        {festivals.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-1 rounded-full bg-[#fffefb]/30 px-4 py-1 backdrop-blur-sm">
              {festivals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 w-2 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? "bg-[#fffefb] w-6"
                      : "bg-[#fffefb]/50 hover:bg-[#fffefb]"
                  }`}
                  aria-label={`${index + 1}번째 축제로 이동`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-[#fffefb]/20">
          <div
            className="h-full bg-[#ff651b] opacity-[77%] transition-all ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          {currentIndex + 1} / {festivals.length} {t("featuredFestival.featured")}
        </p>
      </div>
    </section>
  );
}
