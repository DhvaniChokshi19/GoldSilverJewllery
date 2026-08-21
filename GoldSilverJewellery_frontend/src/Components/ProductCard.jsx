import React, { useMemo } from "react";
import { MessageCircle, Eye, ShieldCheck } from "lucide-react";
import { getWhatsAppInquiryUrl, calculateJewelleryPrice, SITE_CONFIG } from "../config/siteConfig";
import heroGoldNecklace from "../assets/hero_gold_necklace.png";

const ProductCard = React.memo(({ product, liveRates, onQuickView }) => {
  const rates = liveRates || SITE_CONFIG.defaultRates;

  // Compute live price based on product metal, purity & weight if available
  const calculatedPrice = useMemo(() => {
    if (product.price && product.price > 0 && !product.weight) {
      return Number(product.price);
    }

    const weight = product.weight || 10;
    const metal = product.metal ? product.metal.toLowerCase() : "gold";
    const purity = product.purity ? product.purity.toLowerCase() : "22k";

    let baseRatePerGram = rates.gold22k;
    if (metal === "silver") {
      baseRatePerGram = purity.includes("925") ? rates.silver925 : rates.silver999;
    } else {
      if (purity.includes("24")) baseRatePerGram = rates.gold24k;
      else if (purity.includes("18")) baseRatePerGram = rates.gold18k;
      else if (purity.includes("14")) baseRatePerGram = rates.gold14k;
      else baseRatePerGram = rates.gold22k;
    }

    const makingCharge = product.makingCharge || 12;
    const calc = calculateJewelleryPrice({
      weightGrams: weight,
      baseRatePerGram,
      makingChargeType: "percent",
      makingChargeValue: makingCharge
    });

    return calc.totalPrice;
  }, [product, rates]);

  const handleWhatsAppInquiry = (e) => {
    e.stopPropagation();
    const url = getWhatsAppInquiryUrl({
      productName: product.name || product.title || "Luxury Jewellery Item",
      productCode: product.code || product._id,
      metalPurity: `${product.metal || "Gold"} ${product.purity || "22K"}`,
      weight: product.weight || 10,
      estimatedPrice: calculatedPrice,
      customMessage: `I am interested in buying/inquiring about this ${product.name || "jewellery item"}. Please confirm live availability and best offer price!`
    });
    window.open(url, "_blank");
  };

  return (
    <div
      onClick={() => onQuickView && onQuickView(product)}
      className="group bg-neutral-900/90 border border-amber-500/20 hover:border-amber-500/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
    >
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-950">
        
        {/* Product Image */}
        <img
          src={product.image || product.images?.[0] || heroGoldNecklace}
          alt={product.name || "Jewellery"}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          <span className="badge-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
            {product.purity || "22K BIS 916"}
          </span>
          {product.category && (
            <span className="bg-black/60 backdrop-blur-md text-neutral-300 text-[10px] font-medium px-2 py-0.5 rounded-full">
              {product.category}
            </span>
          )}
        </div>

        {/* BIS Hallmark Badge */}
        <div className="absolute top-3 right-3 badge-emerald p-1.5 rounded-full shadow" title="BIS Hallmarked Authenticity">
          <ShieldCheck className="w-4 h-4" />
        </div>

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView && onQuickView(product);
            }}
            className="bg-neutral-900/90 text-amber-200 border border-amber-500/50 px-4 py-2 rounded-full font-medium text-xs flex items-center gap-1.5 shadow-xl hover:bg-neutral-800"
          >
            <Eye className="w-4 h-4" /> Quick Details
          </button>
        </div>

      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-serif font-bold text-neutral-100 text-base line-clamp-1 group-hover:text-amber-400 transition-colors">
            {product.name || product.title}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
            {product.description || `${product.weight || 10}g Gross Weight • Hallmarked`}
          </p>
        </div>

        {/* Price & Weight Row */}
        <div className="flex justify-between items-baseline border-t border-neutral-800/80 pt-2.5">
          <div>
            <div className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">
              Live Estimated Price
            </div>
            <div className="text-lg font-serif font-extrabold text-amber-400">
              ₹{calculatedPrice.toLocaleString("en-IN")}
            </div>
          </div>
          {product.weight && (
            <div className="text-xs font-semibold text-neutral-400">
              {product.weight} Grams
            </div>
          )}
        </div>

        {/* WhatsApp Inquiry Direct Button */}
        <button
          type="button"
          onClick={handleWhatsAppInquiry}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-950/50 transition-all hover:scale-[1.01]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Inquire on WhatsApp</span>
        </button>

      </div>

    </div>
  );
});

export default ProductCard;
