import React from "react";
import { X, MessageCircle, ShieldCheck, Sparkles, Check } from "lucide-react";
import { calculateJewelleryPrice, getWhatsAppInquiryUrl, SITE_CONFIG } from "../config/siteConfig";

const ProductModal = ({ product, liveRates, onClose }) => {
  if (!product) return null;

  const rates = liveRates || SITE_CONFIG.defaultRates;
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

  const handleWhatsAppInquiry = () => {
    const url = getWhatsAppInquiryUrl({
      productName: product.name || product.title,
      productCode: product.code || product._id,
      metalPurity: `${product.metal || "Gold"} ${product.purity || "22K"}`,
      weight: `${weight} g`,
      estimatedPrice: calc.totalPrice,
      customMessage: `Hello GSJ Jewellers, I would like to inquire about "${product.name || product.title}". Please confirm live availability, exact weight, and current best pricing!`
    });
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-amber-500/40 rounded-3xl max-w-3xl w-full text-white shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-neutral-400 hover:text-white p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Product Image */}
          <div className="relative aspect-square w-full bg-neutral-950 flex items-center justify-center p-6">
            <img
              src={product.image || product.images?.[0] || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"}
              alt={product.name}
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 bg-emerald-950/90 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 100% BIS Hallmarked
            </div>
          </div>

          {/* Right Product Specifications & Breakdown */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> GSJ Masterpiece Collection
              </div>
              <h2 className="text-2xl font-serif font-bold text-amber-100">
                {product.name || product.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {product.description || "Authentic hallmarked handcrafted jewellery designed with precision."}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs my-4 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <div>
                  <span className="text-neutral-400 block">Metal / Purity:</span>
                  <span className="font-bold text-amber-300">
                    {product.metal || "Gold"} ({product.purity || "22K 916"})
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Gross Weight:</span>
                  <span className="font-bold text-amber-300">{weight} Grams</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Current Market Rate:</span>
                  <span className="font-bold text-white">₹{baseRatePerGram}/g</span>
                </div>
                <div>
                  <span className="text-neutral-400 block">Making Charge:</span>
                  <span className="font-bold text-white">{makingCharge}%</span>
                </div>
              </div>

              {/* Itemized Cost Card */}
              <div className="bg-neutral-950/90 p-3.5 rounded-xl border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex justify-between text-neutral-400">
                  <span>Metal Cost:</span>
                  <span>₹{calc.totalMetalCost.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Making Charges ({makingCharge}%):</span>
                  <span>₹{calc.makingChargeCost.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-amber-300/80">
                  <span>3.0% GST Tax:</span>
                  <span>+ ₹{calc.gstAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-amber-200 pt-2 border-t border-neutral-800">
                  <span>Estimated Total Price:</span>
                  <span className="text-base text-amber-400">₹{calc.totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>

            </div>

            {/* Direct WhatsApp Action */}
            <div className="space-y-2">
              <button
                onClick={handleWhatsAppInquiry}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Inquire & Buy on WhatsApp</span>
              </button>
              <p className="text-[10px] text-center text-neutral-400">
                Direct chat with GSJ Jewellers store owner. Fast response & live photos available!
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductModal;
