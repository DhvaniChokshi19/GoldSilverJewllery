import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Phone, Mail, MapPin, MessageCircle, ShieldCheck, Send, CheckCircle2 } from "lucide-react";
import { SITE_CONFIG } from "../config/siteConfig";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-amber-500/20 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        
        {/* Col 1: Store Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-serif font-bold text-amber-200 tracking-wider">
              {SITE_CONFIG.storeName}
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {SITE_CONFIG.tagline}
          </p>
          <div className="inline-flex items-center gap-2 text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4" /> {SITE_CONFIG.hallmarkBadge}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/" className="hover:text-amber-300 transition-colors">
                Home & Live Rates
              </Link>
            </li>
            <li>
              <Link to="/catalog" className="hover:text-amber-300 transition-colors">
                Gold & Silver Collections
              </Link>
            </li>
            <li>
              <Link to="/price-calculator" className="hover:text-amber-300 transition-colors">
                Live Price Calculator
              </Link>
            </li>
            <li>
              <Link to="/old-gold-calculator" className="hover:text-amber-300 transition-colors">
                Old Gold Exchange Calculator
              </Link>
            </li>
            <li>
              <Link to="/our-shop" className="hover:text-amber-300 transition-colors font-medium text-amber-400">
                Our Shop & Location
              </Link>
            </li>
            <li>
              <Link to="/customorder" className="hover:text-amber-300 transition-colors">
                Custom Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Showroom Location & Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            Visit Showroom
          </h4>
          <ul className="space-y-3 text-xs text-neutral-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{SITE_CONFIG.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{SITE_CONFIG.whatsappNumber}</span>
            </li>
          </ul>
          <a
            href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Col 4: Daily Rate Alert Signup */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            Daily Gold Rate Alerts
          </h4>
          <p className="text-xs text-neutral-400 mb-3">
            Subscribe to get instant morning notifications when bullion rates change.
          </p>
          {subscribed ? (
            <div className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 p-3 rounded-xl text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Subscribed to Rate Alerts!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="number"
                required
                placeholder="Enter your Phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Subscribe Free</span>
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto border-t border-neutral-900 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-neutral-500 gap-2">
        <div>
          © {new Date().getFullYear()} {SITE_CONFIG.storeName}. All Rights Reserved. BIS 916 & 999 Certified.
        </div>
        <div>
          Bullion rates subject to daily live market changes.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
