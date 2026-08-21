import React, { useState } from "react";
import { Sparkles, Upload, Send, ShieldCheck, CheckCircle2, Image as ImageIcon } from "lucide-react";
import { SITE_CONFIG, getWhatsAppInquiryUrl } from "../config/siteConfig";

const BespokeOrder = () => {
  const [metal, setMetal] = useState("Gold 22K (916)");
  const [weight, setWeight] = useState(15);
  const [budget, setBudget] = useState(100000);
  const [designDescription, setDesignDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleBespokeSubmit = (e) => {
    e.preventDefault();
    const url = getWhatsAppInquiryUrl({
      productName: "Bespoke Custom Jewellery Request",
      metalPurity: metal,
      weight: `${weight} g`,
      estimatedPrice: budget,
      customMessage: `Bespoke Order Details:
- Customer Name: ${customerName || "Valued Client"}
- Phone: ${customerPhone || "N/A"}
- Metal Preference: ${metal}
- Target Weight: ~${weight} grams
- Target Budget: ₹${Number(budget).toLocaleString("en-IN")}
- Custom Description: ${designDescription || "Custom design consultation requested"}
${imageUrl ? `- Reference Design Image: ${imageUrl}` : ""}`
    });
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Banner Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400" /> Artisan Craftsmanship
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-extrabold text-amber-100">
            Bespoke Custom Jewellery Orders
          </h1>
          <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
            Bring your dream jewellery to life. Upload your inspiration image or describe your vision, and our master goldsmiths will craft it in hallmarked 22K/18K Gold or 999 Fine Silver.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-neutral-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <form onSubmit={handleBespokeSubmit} className="space-y-6">
            
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 9876543210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Metal & Purity Selection */}
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                Preferred Metal & Purity
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  "Gold 22K (916)",
                  "Gold 18K (750)",
                  "Gold 24K (999)",
                  "Silver 925 Sterling",
                  "Silver 999 Pure"
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setMetal(option)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border text-center transition-all ${
                      metal === option
                        ? "bg-amber-500/20 border-amber-400 text-amber-200 shadow"
                        : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Weight and Budget Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-amber-300">Target Approx Weight</span>
                  <span className="text-amber-400">{weight} Grams</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={weight}
                  onChange={(e) => setWeight(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-amber-300">Approx Budget (INR)</span>
                  <span className="text-amber-400">₹{Number(budget).toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Inspiration Image Link or Upload */}
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                Inspiration / Design Reference Image URL (Optional)
              </label>
              <div className="flex gap-3">
                <input
                  type="url"
                  placeholder="https://example.com/my-jewellery-design.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              {imageUrl && (
                <div className="mt-3 relative w-32 h-32 rounded-xl overflow-hidden border border-amber-500/40 bg-black">
                  <img src={imageUrl} alt="Design preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                Detailed Custom Requirements
              </label>
              <textarea
                rows="4"
                required
                placeholder="Describe your design vision: e.g. Antique Peacock Bridal Necklace with Kundan stones and adjustable dori..."
                value={designDescription}
                onChange={(e) => setDesignDescription(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/60 transition-all hover:scale-[1.01]"
            >
              <Send className="w-5 h-5" />
              <span className="text-base">Submit Custom Order Request on WhatsApp</span>
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default BespokeOrder;
