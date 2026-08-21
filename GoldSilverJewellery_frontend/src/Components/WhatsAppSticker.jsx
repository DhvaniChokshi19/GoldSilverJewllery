import React, { useState, useEffect } from "react";
import { MessageSquare, X, Send, Sparkles, MapPin, Calendar, TrendingUp, ShieldCheck, ChevronRight } from "lucide-react";
import { SITE_CONFIG } from "../config/siteConfig";
import { useTranslation } from "../context/LanguageContext";

const WhatsAppSticker = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  const [showTooltip, setShowTooltip] = useState(true);

  // Auto-hide initial tooltip callout after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenWhatsApp = (presetText = "") => {
    const cleanNumber = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
    const message = presetText || customMsg || "Hello GSJ Jewellers! I am browsing your shop website and would like to make an inquiry.";
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
    setCustomMsg("");
  };

  const presets = [
    {
      id: "rates",
      label: t("whatsappPresetRates"),
      text: "Hello GSJ Jewellers! Can you please share today's live retail rates for 24K/22K Gold and 999 Silver?",
      icon: TrendingUp,
      color: "text-amber-400 border-amber-500/30 hover:bg-amber-500/10",
    },
    {
      id: "appointment",
      label: t("whatsappPresetAppointment"),
      text: "Hello GSJ Jewellers! I would like to book a VIP showroom appointment for bridal jewellery consultation.",
      icon: Calendar,
      color: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10",
    },
    {
      id: "custom",
      label: t("whatsappPresetCustom"),
      text: "Hello GSJ Jewellers! I have a custom jewellery design reference and would like a price quotation.",
      icon: Sparkles,
      color: "text-purple-400 border-purple-500/30 hover:bg-purple-500/10",
    },
    {
      id: "location",
      label: t("whatsappPresetDirections"),
      text: "Hello GSJ Jewellers! Please share your exact showroom location address and google map directions.",
      icon: MapPin,
      color: "text-sky-400 border-sky-500/30 hover:bg-sky-500/10",
    },
  ];

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end selection:bg-emerald-500 selection:text-neutral-950">
      {/* 1. Quick Tooltip Callout (Visible before open) */}
      {!isOpen && showTooltip && (
        <div className="mb-3 animate-bounce max-w-[240px] bg-neutral-900/95 border border-emerald-500/40 text-neutral-100 text-xs px-3.5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md relative flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <div>
            <span className="font-semibold text-emerald-400">GSJ Live Chat</span>
            <p className="text-[11px] text-neutral-300">Click for instant WhatsApp inquiry & rates!</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-neutral-500 hover:text-neutral-300 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-neutral-900 border-r border-b border-emerald-500/40 rotate-45" />
        </div>
      )}

      {/* 2. Expanded Chat Drawer Box */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2.5rem)] sm:w-96 bg-neutral-950/95 border border-emerald-500/30 rounded-2xl shadow-[0_12px_40px_rgba(16,185,129,0.2)] backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-emerald-950 p-4 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-inner">
                  💬
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-950" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                  {t("whatsappConcierge")}
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </h4>
                <p className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {t("whatsappStatus")}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Greeting Bubble */}
            <div className="bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-2xl rounded-tl-none text-xs text-neutral-200 shadow-sm leading-relaxed">
              <p className="font-medium text-amber-300 mb-1">Namaste! 🙏 Welcome to {SITE_CONFIG.storeName}</p>
              <p>{t("whatsappGreeting")}</p>
            </div>

            {/* Quick Action Presets */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold px-1">
                Quick Options
              </p>
              {presets.map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleOpenWhatsApp(preset.text)}
                    className={`w-full text-left p-2.5 rounded-xl border bg-neutral-900/60 transition-all flex items-center justify-between group ${preset.color}`}
                  >
                    <div className="flex items-center gap-2.5 text-xs font-medium">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{preset.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                );
              })}
            </div>

            {/* Custom Input */}
            <div className="pt-2 border-t border-neutral-800/80 space-y-2">
              <p className="text-[11px] text-neutral-400 font-medium px-1">
                Or type custom message:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleOpenWhatsApp();
                  }}
                  placeholder="Ask about rate, design, purity..."
                  className="flex-1 bg-neutral-900 border border-neutral-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleOpenWhatsApp()}
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold transition-all shadow-md hover:shadow-emerald-500/25 active:scale-95 shrink-0"
                  title="Send via WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="px-4 py-2 bg-neutral-900/80 border-t border-neutral-800 text-[10px] text-neutral-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Official Showroom WhatsApp Line: {SITE_CONFIG.phone}</span>
          </div>
        </div>
      )}

      {/* 3. Main Floating Button Trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-neutral-950 shadow-[0_8px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_12px_35px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/40"
        aria-label="Chat with GSJ Jewellers on WhatsApp"
      >
        {/* Radar Pulse Effect */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping group-hover:animate-none pointer-events-none" />

        {/* WhatsApp Icon / Close Icon */}
        <div className="relative z-10 text-neutral-950 font-bold">
          {isOpen ? (
            <X className="w-7 h-7 sm:w-8 sm:h-8" />
          ) : (
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 fill-neutral-950"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2C6.477 2 2 6.477 2 12c0 2.204.714 4.245 1.928 5.897L2.05 21.95l4.185-1.848C7.8 21.266 9.822 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.925 0-3.703-.586-5.18-1.585l-.371-.25-2.484 1.095 1.09-2.434-.271-.403C3.708 14.938 3 13.541 3 12c0-4.963 4.037-9 9-9s9 4.037 9 9-4.037 9-9 9z" />
            </svg>
          )}
        </div>
      </button>
    </div>
  );
};

export default WhatsAppSticker;
