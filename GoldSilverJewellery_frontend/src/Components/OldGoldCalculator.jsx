import React, { useState } from "react";
import { ArrowRightLeft, Sparkles, Send, ShieldAlert, Award } from "lucide-react";
import { SITE_CONFIG, getWhatsAppInquiryUrl } from "../config/siteConfig";

const OldGoldCalculator = ({ initialRates }) => {
  const rates = initialRates || SITE_CONFIG.defaultRates;
  const [grossWeight, setGrossWeight] = useState(15);
  const [purityPercent, setPurityPercent] = useState(91.6); // 22K default 91.6%
  const [stoneWeight, setStoneWeight] = useState(0.5);
  const [meltDeductionPercent, setMeltDeductionPercent] = useState(2.0); // 2% melting / refining deduction standard

  const gold24kRate = rates.gold24k || SITE_CONFIG.defaultRates.gold24k;

  const netGoldWeight = Math.max(0, grossWeight - stoneWeight);
  const pureGoldWeight = netGoldWeight * (purityPercent / 100);
  const refinedGoldWeight = pureGoldWeight * ((100 - meltDeductionPercent) / 100);
  const estimatedExchangeValue = Math.round(refinedGoldWeight * gold24kRate);

  const handleWhatsAppExchangeQuote = () => {
    const url = getWhatsAppInquiryUrl({
      productName: "Old Gold Trade-In Valuation",
      weight: `${grossWeight}g gross (${netGoldWeight.toFixed(2)}g net)`,
      estimatedPrice: estimatedExchangeValue,
      customMessage: `Old Gold Trade-In Estimate:
- Gross Weight: ${grossWeight} g
- Stone Weight: ${stoneWeight} g
- Net Weight: ${netGoldWeight.toFixed(2)} g
- Estimated Purity: ${purityPercent}%
- Estimated Pure Gold Content: ${refinedGoldWeight.toFixed(2)} g
- Estimated Trade-In / Cash Value: ₹${estimatedExchangeValue.toLocaleString("en-IN")}

I would like to get my old gold tested & exchanged at your showroom!`
    });
    window.open(url, "_blank");
  };

  return (
    <div className="bg-gradient-to-br from-neutral-900 to-amber-950/80 text-white rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-2xl relative overflow-hidden">
      
      <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-widest mb-1">
        <ArrowRightLeft className="w-4 h-4" /> Instant Exchange Valuation
      </div>
      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100 mb-2">
        Old Gold Exchange & Upgrade Calculator
      </h2>
      <p className="text-xs text-neutral-400 mb-6">
        Estimate the maximum melt and trade-in value of your old gold jewellery for upgrading to new GSJ designs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs text-amber-300 font-bold mb-1">
              <span>Gross Weight of Old Gold</span>
              <span>{grossWeight} Grams</span>
            </div>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={grossWeight}
              onChange={(e) => setGrossWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-amber-200 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-amber-300 font-bold mb-1">
              <span>Estimated Purity</span>
              <span>{purityPercent}%</span>
            </div>
            <select
              value={purityPercent}
              onChange={(e) => setPurityPercent(parseFloat(e.target.value))}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-amber-200 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value={99.9}>24K Gold (99.9% Pure)</option>
              <option value={91.6}>22K Gold (91.6% Hallmarked)</option>
              <option value={87.5}>21K Gold (87.5% Purity)</option>
              <option value={75.0}>18K Gold (75.0% Purity)</option>
              <option value={58.5}>14K Gold (58.5% Purity)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs text-neutral-400 font-bold mb-1">
              <span>Approx. Stones / Enamel Weight (Grams)</span>
              <span>{stoneWeight} Grams</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.1"
              value={stoneWeight}
              onChange={(e) => setStoneWeight(parseFloat(e.target.value) || 0)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-amber-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Valuation Result Box */}
        <div className="bg-neutral-950 p-6 rounded-2xl border border-amber-500/20 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-amber-400 tracking-wider mb-3">
              Valuation Summary
            </div>

            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex justify-between">
                <span>Net Gold Weight:</span>
                <span className="font-bold text-white">{netGoldWeight.toFixed(2)} g</span>
              </div>
              <div className="flex justify-between">
                <span>Pure 24K Gold Equivalent:</span>
                <span className="font-bold text-amber-300">{refinedGoldWeight.toFixed(2)} g</span>
              </div>
              <div className="flex justify-between">
                <span>Current 24K Gold Rate:</span>
                <span className="font-bold text-white">₹{gold24kRate}/g</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-center">
              <div className="text-[10px] text-amber-300 font-bold uppercase">
                Estimated Trade-In / Cash Value
              </div>
              <div className="text-2xl font-serif font-extrabold text-amber-200 mt-1">
                ₹{estimatedExchangeValue.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsAppExchangeQuote}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs"
          >
            <Send className="w-4 h-4" />
            <span>Book Purity Test & Exchange on WhatsApp</span>
          </button>
        </div>

      </div>

    </div>
  );
};

export default OldGoldCalculator;
