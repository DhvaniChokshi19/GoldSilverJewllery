import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Calculator, ArrowRightLeft, ShieldCheck, MessageCircle, ArrowRight, Crown, Gem } from "lucide-react";
import PriceCalculator from "../Components/PriceCalculator";
import OldGoldCalculator from "../Components/OldGoldCalculator";
import ProductCard from "../Components/ProductCard";
import ProductModal from "../Components/ProductModal";
import CategoryCarousel from "../Components/CategoryCarousel";
import { SITE_CONFIG } from "../config/siteConfig";
import { useTranslation } from "../context/LanguageContext";

import heroGoldNecklace from "../assets/hero_gold_necklace.png";

import axiosInstance from "../api/axios";

const HomePage = ({ liveRates }) => {
  const { t } = useTranslation();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [activeTab, setActiveTab] = useState("priceCalc");
  const [collections, setCollections] = useState([]);

  // Fetch live products
  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const { data } = await axiosInstance.get("api/products");
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          const formatted = data.data.map(p => ({
            ...p,
            metal: p.collectionId?.name || (p.name?.toLowerCase().includes("silver") ? "Silver" : "Gold"),
            category: p.categoryId?.name || p.label || "Jewellery",
            weight: typeof p.weight === "string" ? parseFloat(p.weight) || 10 : (p.weight || 10),
            image: p.images?.[0] || p.image || heroGoldNecklace
          }));
          setFeaturedProducts(formatted);
        }
      } catch (err) {
        console.warn("Could not fetch products:", err.message);
      }
    };
    fetchDbProducts();
  }, []);

  // Fetch collections (Gold, Silver) for carousel
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { data } = await axiosInstance.get("api/collections");
        if (data && data.success && Array.isArray(data.data)) {
          setCollections(data.data);
        }
      } catch (err) {
        console.warn("Could not fetch collections:", err.message);
      }
    };
    fetchCollections();
  }, []);

  const goldCollection = collections.find(c => c.name?.toLowerCase() === "gold");
  const silverCollection = collections.find(c => c.name?.toLowerCase() === "silver");

  return (
    <div className="bg-neutral-950 text-white min-h-screen">

      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-700/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 items-center relative z-10">

          {/* Left Text CTA */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/25 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-4 h-4 text-amber-400" /> {t("heroBadge")}
            </div>

            <h1 className="text-5xl sm:text-7xl font-light tracking-tight text-amber-50 leading-[1.1]">
              {t("heroTitle1")} <br />
              <span className="gold-gradient-text font-semibold">
                {t("heroTitle2")}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t("heroDesc")}
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/catalog"
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-neutral-950 font-bold px-8 py-4 rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/40 hover:scale-105 transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <span>{t("viewCollection")}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#live-calculator"
                className="bg-neutral-900 border border-amber-500/30 text-amber-200 hover:text-white hover:border-amber-400 font-semibold px-7 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>{t("liveCalculator")}</span>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-800/60 text-center lg:text-left">
              <div>
                <div className="text-2xl font-semibold gold-gradient-text">{t("stat1Value")}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{t("stat1Label")}</div>
              </div>
              <div>
                <div className="text-2xl font-semibold gold-gradient-text">{t("stat2Value")}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{t("stat2Label")}</div>
              </div>
              <div>
                <div className="text-2xl font-semibold gold-gradient-text">{t("stat3Value")}</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">{t("stat3Label")}</div>
              </div>
            </div>
          </div>

          {/* Right Hero Image */}
          <div className="lg:col-span-5 relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl shadow-amber-900/20 group">
              <img
                src={heroGoldNecklace}
                alt="Gold Jewellery Showcase"
                className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent flex flex-col justify-end p-7">
                <span className="bg-amber-500/90 text-neutral-950 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-2">
                  Featured Masterpiece
                </span>
                <h3 className="text-xl font-semibold text-amber-50">
                  Royal Heritage Bridal Collection
                </h3>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                  Crafted in 22K 916 Hallmarked Gold with custom ruby embellishments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          2. TRUST BAR
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="border-y border-neutral-800/60 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: ShieldCheck, title: t("trustHallmark"), desc: t("trustHallmarkDesc"), color: "text-amber-400" },
              { icon: Calculator, title: t("trustBilling"), desc: t("trustBillingDesc"), color: "text-amber-400" },
              { icon: ArrowRightLeft, title: t("trustOldGold"), desc: t("trustOldGoldDesc"), color: "text-amber-400" },
              { icon: MessageCircle, title: t("trustWhatsApp"), desc: t("trustWhatsAppDesc"), color: "text-emerald-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-800/40 transition-colors">
                <item.icon className={`w-6 h-6 ${item.color} shrink-0 mt-0.5`} />
                <div>
                  <h4 className="font-semibold text-amber-100 text-xs">{item.title}</h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          3. FEATURED PRODUCTS
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-amber-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
              <Sparkles className="w-4 h-4" /> {t("featuredBadge")}
            </div>
            <h2 className="text-3xl sm:text-4xl font-light text-amber-50 tracking-tight">
              {t("featuredTitle")}
            </h2>
          </div>
          <Link
            to="/catalog"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 bg-amber-500/10 px-4 py-2.5 rounded-xl border border-amber-500/25 hover:border-amber-400/50 transition-all"
          >
            <span>{t("viewAllItems")}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                liveRates={liveRates}
                onQuickView={(p) => setSelectedProductForModal(p)}
              />
            ))
          ) : (
            <div className="col-span-4 text-center py-16 rounded-2xl border border-neutral-800/40 bg-neutral-900/30">
              <p className="text-4xl mb-3">💎</p>
              <p className="text-sm font-semibold text-amber-300">{t("noFeaturedProducts")}</p>
              <p className="text-xs mt-1 text-neutral-500">{t("noFeaturedDesc")}</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. GOLD CATEGORIES CAROUSEL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-amber-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
            <Crown className="w-4 h-4" /> {t("goldCategoriesBadge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-amber-50 tracking-tight">
            {t("goldCategoriesTitle")}
          </h2>
        </div>
        <CategoryCarousel
          collectionName="Gold"
          collectionId={goldCollection?._id}
          accentColor="amber"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          5. SILVER CATEGORIES CAROUSEL
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 text-slate-300 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
            <Gem className="w-4 h-4" /> {t("silverCategoriesBadge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-slate-100 tracking-tight">
            {t("silverCategoriesTitle")}
          </h2>
        </div>
        <CategoryCarousel
          collectionName="Silver"
          collectionId={silverCollection?._id}
          accentColor="slate"
        />
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          6. BESPOKE CUSTOM ORDER BANNER
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 border border-amber-500/25 rounded-3xl p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
            <span className="bg-amber-500/15 text-amber-300 text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-amber-500/30">
              {t("bespokeBadge")}
            </span>
            <h3 className="text-3xl font-light text-amber-50 tracking-tight">
              {t("bespokeTitle")}
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              {t("bespokeDesc")}
            </p>
          </div>

          <Link
            to="/customorder"
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 transition-all hover:scale-105 whitespace-nowrap flex items-center gap-2 relative z-10"
          >
            <span>{t("bespokeBtn")}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          7. CALCULATOR SECTION
      ═══════════════════════════════════════════════════════════════════ */}
      <section id="live-calculator" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 text-amber-400 text-[11px] font-bold uppercase tracking-[0.2em]">
            <Calculator className="w-4 h-4" /> {t("calcBadge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-amber-50 tracking-tight">
            {t("calcTitle")}
          </h2>
          <p className="text-xs text-neutral-500 max-w-lg mx-auto">
            {t("calcDesc")}
          </p>

          {/* Tab Switcher */}
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab("priceCalc")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                activeTab === "priceCalc"
                  ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-amber-500/30"
              }`}
            >
              <Calculator className="w-4 h-4" /> {t("calcTab1")}
            </button>
            <button
              onClick={() => setActiveTab("oldGoldCalc")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                activeTab === "oldGoldCalc"
                  ? "bg-amber-500 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20"
                  : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-amber-500/30"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" /> {t("calcTab2")}
            </button>
          </div>
        </div>

        {activeTab === "priceCalc" ? (
          <PriceCalculator initialRates={liveRates} />
        ) : (
          <OldGoldCalculator initialRates={liveRates} />
        )}
      </section>

      {/* Quick View Modal */}
      {selectedProductForModal && (
        <ProductModal
          product={selectedProductForModal}
          liveRates={liveRates}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
