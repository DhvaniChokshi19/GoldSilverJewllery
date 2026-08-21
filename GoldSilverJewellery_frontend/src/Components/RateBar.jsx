import React, { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw, Info, Sparkles, X } from "lucide-react";
import { SITE_CONFIG } from "../config/siteConfig";
import axiosInstance from "../api/axios";

const RateBar = ({ rates: externalRates }) => {
  const [rates, setRates] = useState(externalRates || SITE_CONFIG.defaultRates);
  const [showModal, setShowModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState(
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    if (externalRates) {
      setRates(externalRates);
    }
  }, [externalRates]);

  const fetchRates = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await axiosInstance.get("api/rates/get");
      if (data && data.success && data.data) {
        setRates(data.data);
      }
    } catch (err) {
      // Fallback silently to existing rates or defaults
    } finally {
      setIsRefreshing(false);
      setLastRefreshedTime(
        new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
      );
    }
  };

  useEffect(() => {
    if (!externalRates) {
      fetchRates();
      const interval = setInterval(fetchRates, 60000); // refresh every minute
      return () => clearInterval(interval);
    }
  }, [externalRates]);

  const gold24k = rates.gold24k || SITE_CONFIG.defaultRates.gold24k;
  const gold22k = rates.gold22k || SITE_CONFIG.defaultRates.gold22k;
  const gold18k = rates.gold18k || SITE_CONFIG.defaultRates.gold18k;
  const silver999 = rates.silver999 || SITE_CONFIG.defaultRates.silver999;
  const goldChange = rates.gold24kChange || 0.45;
  const silverChange = rates.silver999Change || -0.12;

  const renderTickerItems = (keyPrefix = "") => (
    <div key={keyPrefix} className="flex items-center gap-6 sm:gap-10 shrink-0 pr-6 sm:pr-10 font-semibold text-amber-200/90">
      {/* Gold 24K (Per 10g) */}
      <div className="flex items-center gap-1.5 whitespace-nowrap bg-black/40 px-3 py-1 rounded-full border border-amber-500/30">
        <span className="text-amber-400 font-bold">Gold 24K:</span>
        <span>₹{(gold24k * 10).toLocaleString("en-IN")}/10g</span>
        <span className="text-[11px] text-gray-400">({gold24k}/g)</span>
        {goldChange >= 0 ? (
          <span className="text-emerald-400 text-[11px] flex items-center font-bold">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{goldChange}%
          </span>
        ) : (
          <span className="text-rose-400 text-[11px] flex items-center font-bold">
            <TrendingDown className="w-3 h-3 mr-0.5" /> {goldChange}%
          </span>
        )}
      </div>

      {/* Gold 22K (Per 10g) */}
      <div className="flex items-center gap-1.5 whitespace-nowrap bg-black/40 px-3 py-1 rounded-full border border-amber-500/20">
        <span className="text-amber-300 font-bold">Gold 22K:</span>
        <span>₹{(gold22k * 10).toLocaleString("en-IN")}/10g</span>
        <span className="text-[11px] text-gray-400">({gold22k}/g)</span>
      </div>

      {/* Gold 18K */}
      <div className="flex items-center gap-1.5 whitespace-nowrap bg-black/40 px-3 py-1 rounded-full border border-amber-500/20">
        <span className="text-amber-200 font-bold">Gold 18K:</span>
        <span>₹{(gold18k * 10).toLocaleString("en-IN")}/10g</span>
      </div>

      {/* Silver 999 (Per 1kg & 1g) */}
      <div className="flex items-center gap-1.5 whitespace-nowrap bg-black/40 px-3 py-1 rounded-full border border-slate-400/30">
        <span className="text-slate-200 font-bold">Silver 999:</span>
        <span>₹{(silver999 * 1000).toLocaleString("en-IN")}/kg</span>
        <span className="text-[11px] text-gray-400">({silver999}/g)</span>
        {silverChange >= 0 ? (
          <span className="text-emerald-400 text-[11px] flex items-center font-bold">
            <TrendingUp className="w-3 h-3 mr-0.5" /> +{silverChange}%
          </span>
        ) : (
          <span className="text-rose-400 text-[11px] flex items-center font-bold">
            <TrendingDown className="w-3 h-3 mr-0.5" /> {silverChange}%
          </span>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Top Ticker Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-neutral-900 to-amber-950 text-amber-100 text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-inner border-b border-amber-500/20 flex items-center justify-between relative overflow-hidden z-40">

        {/* Continuous Marquee Rate Ticker */}
        <div className="overflow-hidden flex-1 relative mx-2 sm:mx-4">
          <div className="animate-marquee flex items-center">
            {renderTickerItems("set1")}
            {renderTickerItems("set2")}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 shrink-0 text-xs pl-3 sm:pl-4 bg-neutral-950/80 backdrop-blur-sm z-10 py-0.5 rounded-l-lg">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 text-amber-300 hover:text-amber-100 transition-colors font-medium bg-amber-900/50 hover:bg-amber-800/60 px-2.5 py-1 rounded border border-amber-500/40"
            title="View full metal rate breakdown"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rate Card</span>
          </button>

          <button
            type="button"
            onClick={fetchRates}
            disabled={isRefreshing}
            className={`text-amber-400 hover:text-amber-200 p-1 transition-transform ${
              isRefreshing ? "animate-spin" : ""
            }`}
            title={`Last updated ${lastRefreshedTime}. Click to refresh.`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Full Rate Card Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-amber-500/40 rounded-2xl p-6 max-w-lg w-full text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-full bg-neutral-800 hover:bg-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-serif text-amber-200">Daily Metal Rate Card</h3>
            </div>
            <p className="text-xs text-neutral-400 mb-6">
              Official bullion market benchmark prices. Updated live. Taxes & making charges extra during final billing.
            </p>

            <div className="space-y-4">
              
              {/* Gold Section */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-amber-500/20">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex justify-between">
                  <span>Gold Bullion Rates</span>
                  <span className="text-neutral-400 font-normal">Per Gram & 10g</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-xs">24K Pure Gold (999)</div>
                    <div className="font-bold text-amber-300 text-base mt-1">₹{gold24k.toLocaleString("en-IN")}/g</div>
                    <div className="text-xs text-neutral-400">₹{(gold24k * 10).toLocaleString("en-IN")} / 10g</div>
                  </div>
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-xs">22K Standard Gold (916)</div>
                    <div className="font-bold text-amber-300 text-base mt-1">₹{gold22k.toLocaleString("en-IN")}/g</div>
                    <div className="text-xs text-neutral-400">₹{(gold22k * 10).toLocaleString("en-IN")} / 10g</div>
                  </div>
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-xs">18K Hallmarked Gold (750)</div>
                    <div className="font-bold text-amber-300 text-base mt-1">₹{gold18k.toLocaleString("en-IN")}/g</div>
                    <div className="text-xs text-neutral-400">₹{(gold18k * 10).toLocaleString("en-IN")} / 10g</div>
                  </div>
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-xs">14K Casual Gold (585)</div>
                    <div className="font-bold text-amber-300 text-base mt-1">
                      ₹{(rates.gold14k || SITE_CONFIG.defaultRates.gold14k).toLocaleString("en-IN")}/g
                    </div>
                    <div className="text-xs text-neutral-400">
                      ₹{((rates.gold14k || SITE_CONFIG.defaultRates.gold14k) * 10).toLocaleString("en-IN")} / 10g
                    </div>
                  </div>
                </div>
              </div>

              {/* Silver Section */}
              <div className="bg-neutral-950 p-4 rounded-xl border border-slate-500/20">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3 flex justify-between">
                  <span>Silver Bullion Rates</span>
                  <span className="text-neutral-400 font-normal">Per Gram & Kg</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-xs">999 Fine Silver</div>
                    <div className="font-bold text-slate-200 text-base mt-1">₹{silver999.toLocaleString("en-IN")}/g</div>
                    <div className="text-xs text-neutral-400">₹{(silver999 * 1000).toLocaleString("en-IN")} / kg</div>
                  </div>
                  <div className="bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <div className="text-neutral-400 text-xs">925 Sterling Silver</div>
                    <div className="font-bold text-slate-200 text-base mt-1">
                      ₹{(rates.silver925 || SITE_CONFIG.defaultRates.silver925).toLocaleString("en-IN")}/g
                    </div>
                    <div className="text-xs text-neutral-400">
                      ₹{((rates.silver925 || SITE_CONFIG.defaultRates.silver925) * 1000).toLocaleString("en-IN")} / kg
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-6 flex justify-between items-center text-xs text-neutral-400 border-t border-neutral-800 pt-4">
              <span>Last updated: {lastRefreshedTime}</span>
              <button
                onClick={() => setShowModal(false)}
                className="bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold px-4 py-2 rounded-lg transition-colors"
              >
                Close Card
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RateBar;
