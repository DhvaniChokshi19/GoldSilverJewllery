import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageCircle, ShieldCheck, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG, calculateJewelleryPrice, getWhatsAppInquiryUrl } from "../config/siteConfig";

import axiosInstance from "../api/axios";

const ProductDetails = ({ liveRates }) => {
  const { id } = useParams();
  const rates = liveRates || SITE_CONFIG.defaultRates;

  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Attempt fetching product details from API or demo item
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`api/products/${id}`);
        if (data && data.success && data.data) {
          setProduct(data.data);
          return;
        }
      } catch (err) {}

      // Fallback demo product
      setProduct({
        _id: id || "demo",
        name: "Royal Heritage Gold Bridal Choker Necklace",
        metal: "Gold",
        purity: "22K (916)",
        weight: 45.5,
        makingCharge: 14,
        category: "Necklaces",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        description: "Handcrafted authentic 22K antique gold choker studded with hand-cut ruby stones and south sea pearls. Guaranteed 100% BIS Hallmarked."
      });
    };

    fetchProduct();
  }, [id]);

  if (!product) return null;

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

  const handleWhatsAppBuy = () => {
    const url = getWhatsAppInquiryUrl({
      productName: product.name,
      metalPurity: `${product.metal} ${product.purity}`,
      weight: `${weight} g`,
      estimatedPrice: calc.totalPrice,
      customMessage: `I want to purchase "${product.name}". Please confirm ready stock and send live photo/video!`
    });
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Collections
        </Link>

        {/* Main Product Card */}
        <div className="bg-neutral-900 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Large Preview */}
          <div className="bg-neutral-950 rounded-2xl p-6 flex flex-col items-center justify-center border border-neutral-800">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-96 w-full object-contain rounded-xl shadow-xl"
            />
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-950/80 px-4 py-2 rounded-full border border-emerald-500/40">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> BIS 916 / 999 Hallmarked Genuine Certificate
            </div>
          </div>

          {/* Right Details & Breakdown */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> GSJ Masterwork
              </div>
              <h1 className="text-3xl font-serif font-bold text-amber-100">{product.name}</h1>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{product.description}</p>

              {/* Price Banner */}
              <div className="mt-6 p-4 rounded-2xl bg-neutral-950 border border-amber-500/40">
                <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Live Market Price Estimate
                </div>
                <div className="text-3xl font-serif font-extrabold text-amber-200 mt-1">
                  ₹{calc.totalPrice.toLocaleString("en-IN")}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Includes Metal Value + Making ({makingCharge}%) + 3% GST
                </div>
              </div>

              {/* Item Specs Table */}
              <div className="mt-6 space-y-2 text-xs">
                <div className="flex justify-between py-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Metal & Purity:</span>
                  <span className="font-bold text-amber-300">{product.metal} {product.purity}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Gross Weight:</span>
                  <span className="font-bold text-white">{weight} Grams</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Current Base Rate:</span>
                  <span className="font-bold text-white">₹{baseRatePerGram}/gram</span>
                </div>
                <div className="flex justify-between py-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Hallmarking Standard:</span>
                  <span className="font-bold text-emerald-400">Bureau of Indian Standards (BIS)</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Buy Button */}
            <button
              onClick={handleWhatsAppBuy}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.01]"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-base">Inquire & Buy on WhatsApp</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetails;
