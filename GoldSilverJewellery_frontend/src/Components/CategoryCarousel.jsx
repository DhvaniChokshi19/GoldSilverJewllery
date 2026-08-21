import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "../context/LanguageContext";
import axiosInstance from "../api/axios";

const CategoryCarousel = ({ collectionName, collectionId, accentColor = "amber" }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!collectionId) return;
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get(
          `api/categories/by-collection/${collectionId}`
        );
        if (data && data.success && Array.isArray(data.data)) {
          setCategories(data.data);
        }
      } catch (err) {
        console.warn(`Could not fetch ${collectionName} categories:`, err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [collectionId, collectionName]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 280;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const isGold = accentColor === "amber";
  const borderColor = isGold ? "border-amber-500/30" : "border-slate-400/30";
  const badgeBg = isGold ? "bg-amber-500/10 text-amber-400 border-amber-500/30" : "bg-slate-500/10 text-slate-300 border-slate-400/30";
  const cardBorder = isGold ? "border-amber-500/20 hover:border-amber-400/60" : "border-slate-400/20 hover:border-slate-300/60";
  const cardGlow = isGold ? "hover:shadow-amber-500/10" : "hover:shadow-slate-400/10";
  const nameColor = isGold ? "text-amber-100" : "text-slate-100";
  const arrowBg = isGold
    ? "bg-amber-500/20 hover:bg-amber-500/40 text-amber-300"
    : "bg-slate-500/20 hover:bg-slate-500/40 text-slate-300";

  if (loading) {
    return (
      <div className="flex gap-5 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="min-w-[220px] h-56 rounded-2xl bg-neutral-800/50 shimmer-bg"
          />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className={`text-center py-12 rounded-2xl border ${borderColor} bg-neutral-900/40`}>
        <p className="text-3xl mb-2">📂</p>
        <p className={`text-sm font-semibold ${nameColor}`}>{t("noCategoriesYet")}</p>
        <p className="text-xs text-neutral-500 mt-1">{t("noCategoriesDesc")}</p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className={`absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full ${arrowBg} backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="carousel-scroll flex gap-5 overflow-x-auto pb-2"
      >
        {categories.map((cat) => (
          <div
            key={cat._id}
            className={`group min-w-[220px] max-w-[220px] rounded-2xl border ${cardBorder} bg-neutral-900/80 backdrop-blur-sm overflow-hidden shadow-md hover:shadow-xl ${cardGlow} transition-all duration-300 hover:-translate-y-1 flex-shrink-0 cursor-pointer`}
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden bg-neutral-950">
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl opacity-30">
                    {isGold ? "✨" : "💎"}
                  </span>
                </div>
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <h4 className={`font-semibold text-sm ${nameColor} line-clamp-1`}>
                {cat.name}
              </h4>
              {cat.label && (
                <p className="text-xs text-neutral-500 line-clamp-1">{cat.label}</p>
              )}
              <div className="flex items-center gap-2 text-[10px] font-medium text-neutral-400">
                {cat.subCategoryCount !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full border ${isGold ? "border-amber-500/20 bg-amber-500/5" : "border-slate-400/20 bg-slate-400/5"}`}>
                    {cat.subCategoryCount} {t("subCategories")}
                  </span>
                )}
                {cat.productCount !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full border ${isGold ? "border-amber-500/20 bg-amber-500/5" : "border-slate-400/20 bg-slate-400/5"}`}>
                    {cat.productCount} {t("products")}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className={`absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full ${arrowBg} backdrop-blur-sm flex items-center justify-center shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CategoryCarousel;
