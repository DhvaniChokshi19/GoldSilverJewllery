import React, { useState, useEffect } from "react";
import { Calculator, Sparkles, Send, RefreshCw, CheckCircle2, ShieldCheck } from "lucide-react";
import { SITE_CONFIG, calculateJewelleryPrice, getWhatsAppInquiryUrl } from "../config/siteConfig";

const PriceCalculator = ({ initialRates }) => {
  const rates = initialRates || SITE_CONFIG.defaultRates;

  const [metal, setMetal] = useState("gold"); // 'gold' | 'silver'
  const [purity, setPurity] = useState("22k"); // '24k', '22k', '18k', '14k', '999', '925'
  const [weight, setWeight] = useState(10);
  const [makingChargeType, setMakingChargeType] = useState("percent"); // 'percent' | 'fixed'
  const [makingChargeValue, setMakingChargeValue] = useState(12);
  const [wastagePercent, setWastagePercent] = useState(0);
  const [gstPercent, setGstPercent] = useState(3.0);
  const [customNote, setCustomNote] = useState("");

  // Determine current rate per gram based on selected metal & purity
  const getRatePerGram = () => {
    if (metal === "gold") {
      switch (purity) {
        case "24k": return rates.gold24k || SITE_CONFIG.defaultRates.gold24k;
        case "22k": return rates.gold22k || SITE_CONFIG.defaultRates.gold22k;
        case "18k": return rates.gold18k || SITE_CONFIG.defaultRates.gold18k;
        case "14k": return rates.gold14k || SITE_CONFIG.defaultRates.gold14k;
        default: return rates.gold22k || SITE_CONFIG.defaultRates.gold22k;
      }
    } else {
      switch (purity) {
        case "999": return rates.silver999 || SITE_CONFIG.defaultRates.silver999;
        case "925": return rates.silver925 || SITE_CONFIG.defaultRates.silver925;
        default: return rates.silver999 || SITE_CONFIG.defaultRates.silver999;
      }
    }
  };

  // Adjust default purity when metal changes
  useEffect(() => {
    if (metal === "gold" && !["24k", "22k", "18k", "14k"].includes(purity)) {
      setPurity("22k");
    } else if (metal === "silver" && !["999", "925"].includes(purity)) {
      setPurity("999");
    }
  }, [metal]);

  const currentRate = getRatePerGram();

  const breakdown = calculateJewelleryPrice({
    weightGrams: weight,
    baseRatePerGram: currentRate,
    makingChargeType,
    makingChargeValue,
    wastagePercent,
    gstPercent
  });

  const handleWhatsAppQuote = () => {
    const purityLabel = metal === "gold" ? `Gold ${purity.toUpperCase()}` : `Silver ${purity}`;
    const url = getWhatsAppInquiryUrl({
      productName: `Custom Price Estimate (${purityLabel})`,
      metalPurity: purityLabel,
      weight: `${weight} g`,
      estimatedPrice: breakdown.totalPrice,
      customMessage: `Detailed Quote Breakdown:
- Metal: ${purityLabel} @ ₹${currentRate}/g
- Weight: ${weight}g
- Raw Metal Cost: ₹${breakdown.rawMetalCost.toLocaleString("en-IN")}
- Making Charges: ₹${breakdown.makingChargeCost.toLocaleString("en-IN")}
- 3% GST: ₹${breakdown.gstAmount.toLocaleString("en-IN")}
- Estimated Total: ₹${breakdown.totalPrice.toLocaleString("en-IN")}
${customNote ? `Note: ${customNote}` : ""}`
    });
    window.open(url, "_blank");
  };

  return (
    <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-amber-950 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
      
      {/* Glow effect background */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-widest mb-1">
            <Calculator className="w-4 h-4" /> Transparent Pricing Engine
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
            Live Jewellery Cost Calculator
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-full mt-2 sm:mt-0">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>BIS Hallmarked Standards</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Form */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 1. Metal Selection */}
          <div>
            <label className="block text-xs font-bold text-amber-300/80 uppercase tracking-wider mb-2">
              Select Precious Metal
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMetal("gold")}
                className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                  metal === "gold"
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]"
                    : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-amber-500/40"
                }`}
              >
                <Sparkles className="w-4 h-4" /> Gold
              </button>
              <button
                type="button"
                onClick={() => setMetal("silver")}
                className={`py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                  metal === "silver"
                    ? "bg-gradient-to-r from-slate-200 to-slate-400 text-neutral-950 border-slate-300 shadow-lg shadow-slate-400/20 scale-[1.02]"
                    : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-slate-500/40"
                }`}
              >
                <Sparkles className="w-4 h-4" /> Silver
              </button>
            </div>
          </div>

          {/* 2. Purity Selection */}
          <div>
            <label className="block text-xs font-bold text-amber-300/80 uppercase tracking-wider mb-2">
              Select Purity / Karat
            </label>
            {metal === "gold" ? (
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "24k", label: "24K (999)", desc: "Pure Bullion" },
                  { id: "22k", label: "22K (916)", desc: "Standard" },
                  { id: "18k", label: "18K (750)", desc: "Diamond" },
                  { id: "14k", label: "14K (585)", desc: "Daily Wear" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPurity(item.id)}
                    className={`py-2 px-2 rounded-xl text-center transition-all border ${
                      purity === item.id
                        ? "bg-amber-500/20 border-amber-400 text-amber-200 font-bold shadow"
                        : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    <div className="text-sm">{item.label}</div>
                    <div className="text-[10px] opacity-75">{item.desc}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "999", label: "999 Fine Silver", desc: "Pure Articles & Coins" },
                  { id: "925", label: "925 Sterling Silver", desc: "Designer Silver Jewellery" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPurity(item.id)}
                    className={`py-2.5 px-3 rounded-xl text-left transition-all border ${
                      purity === item.id
                        ? "bg-slate-500/20 border-slate-300 text-slate-100 font-bold shadow"
                        : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    <div className="text-sm">{item.label}</div>
                    <div className="text-[10px] opacity-75">{item.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Weight Input & Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-amber-300/80 uppercase tracking-wider">
                Gross Weight in Grams
              </label>
              <span className="text-sm font-bold text-amber-400">{weight} Grams</span>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="range"
                min="0.5"
                max="250"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="w-24 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-right font-bold text-amber-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 4. Making Charge Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-amber-300/80 uppercase tracking-wider mb-2">
                Making Charges Mode
              </label>
              <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setMakingChargeType("percent")}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    makingChargeType === "percent"
                      ? "bg-amber-500 text-neutral-950"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setMakingChargeType("fixed")}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    makingChargeType === "fixed"
                      ? "bg-amber-500 text-neutral-950"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Fixed / Gram (₹)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300/80 uppercase tracking-wider mb-2">
                Making Charge {makingChargeType === "percent" ? "(%)" : "(₹ per gram)"}
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={makingChargeValue}
                onChange={(e) => setMakingChargeValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 font-bold text-amber-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
              Custom Requirements / Design Description (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Ring with floral engraving, size 14"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

        </div>

        {/* Right Summary Invoice Breakdown Card */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-neutral-950/80 rounded-2xl p-6 border border-amber-500/20 shadow-inner">
          <div>
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-4">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Itemized Estimation
              </span>
              <span className="text-xs text-neutral-400">Rate: ₹{currentRate}/g</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-300">
                <span>
                  Metal Value ({weight}g × ₹{currentRate}):
                </span>
                <span className="font-semibold text-white">
                  ₹{breakdown.rawMetalCost.toLocaleString("en-IN")}
                </span>
              </div>

              {breakdown.wastageCost > 0 && (
                <div className="flex justify-between text-neutral-300">
                  <span>Wastage ({wastagePercent}%):</span>
                  <span className="font-semibold text-white">
                    ₹{breakdown.wastageCost.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-neutral-300">
                <span>
                  Making Charges ({makingChargeType === "percent" ? `${makingChargeValue}%` : `₹${makingChargeValue}/g`}):
                </span>
                <span className="font-semibold text-white">
                  ₹{breakdown.makingChargeCost.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-neutral-300 pt-2 border-t border-neutral-800/60">
                <span>Subtotal:</span>
                <span className="font-semibold text-white">
                  ₹{breakdown.subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-amber-300/80">
                <span>GST Tax (3.0%):</span>
                <span className="font-semibold">
                  + ₹{breakdown.gstAmount.toLocaleString("en-IN")}
                </span>
              </div>

            </div>

            {/* Total Highlight Box */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/40 text-center">
              <div className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                Estimated Net Price
              </div>
              <div className="text-3xl font-serif font-extrabold text-amber-200 mt-1">
                ₹{breakdown.totalPrice.toLocaleString("en-IN")}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                Includes Metal Cost + Making + 3% GST
              </div>
            </div>
          </div>

          {/* Action Button: WhatsApp Quote */}
          <div className="mt-6">
            <button
              onClick={handleWhatsAppQuote}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.01]"
            >
              <Send className="w-5 h-5" />
              <span>Send Calculation & Get Quote on WhatsApp</span>
            </button>
            <p className="text-[10px] text-center text-neutral-400 mt-2">
              Rates subject to live bullion market movement at final billing.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PriceCalculator;
