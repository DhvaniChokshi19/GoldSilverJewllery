import React, { useState, useMemo, useCallback } from "react";
import shoplogo from "../assets/shoplogo.jpg";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Sparkles,
  Navigation,
  CheckCircle2,
  ExternalLink,
  Car,
  Coffee,
  Gem,
  Crown,
  Award,
  Lock,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { SITE_CONFIG } from "../config/siteConfig";
import { useTranslation } from "../context/LanguageContext";
import showroomInterior from "../assets/showroom_interior.png";
import showroomVipLounge from "../assets/showroom_vip_lounge.png";

const OurShopPage = ({ liveRates }) => {
  const { t, lang } = useTranslation();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    
    notes: ""
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  // Real-Time Business Hours Status Check (Memoized)
  const isShopOpen = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue...
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (day === 2) {
      return false; // Tuesday is Weekly Holiday
    }
    return currentHour >= 10 && currentHour < 19.5;
  }, []);

  const statusText = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    if (isShopOpen) {
      return `${t("openNow")} • Closes today at 7:30 PM`;
    }
    if (day === 2) {
      return `${t("closedNow")} • Tuesday Weekly Holiday`;
    }
    if (currentHour < 10) {
      return `${t("closedNow")} • Opens today at 10:00 AM`;
    }
    if (day === 1 && currentHour >= 19.5) {
      return `${t("closedNow")} • Opens Wednesday at 10:00 AM (Tuesday Holiday)`;
    }
    return `${t("closedNow")} • Opens tomorrow at 10:00 AM`;
  }, [isShopOpen, t]);

  // Copy Address Handler
  const handleCopyAddress = () => {
    const fullAddr = `${SITE_CONFIG.storeName}, ${SITE_CONFIG.address}, ${SITE_CONFIG.cityState}`;
    navigator.clipboard.writeText(fullAddr);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 3000);
  };

  // Appointment Form Submit
  const handleSubmitAppointment = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      alert("Please fill in your name, phone number, and preferred date.");
      return;
    }

    setFormSubmitted(true);

    // Format WhatsApp message
    const waText = `*Shop Appointment Request* ✨\n\n` +
      `*Name:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `*Date:* ${formData.date}\n` +
      `*Time Slot:* ${formData.time}\n` +
      `*Purpose:* ${formData.purpose}\n` +
      (formData.notes ? `*Notes:* ${formData.notes}\n` : "") +
      `\nPlease confirm slot availability!`;

    const cleanNum = SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "");
    const waUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(waText)}`;
    
    // Automatically open WhatsApp after brief delay
    setTimeout(() => {
      window.open(waUrl, "_blank", "noopener,noreferrer");
    }, 1200);
  };

  // Gallery Photos
  const galleryPhotos = [
    {
      url: showroomInterior,
      title: "Main Showroom Floor",
      subtitle: "BIS 916 Gold & Pure 999 Silver Display Counter"
    },
    
  ];

  // Amenities list
  const amenities = [
    {
      icon: Gem,
      title: "Instant Purity Test",
      desc: "Free non-destructive Karatmeter XRF laser purity testing for your gold and silver ornaments."
    },
    {
      icon: RefreshCw,
      title: "Easy Exchange & Selling of Old Jewellery",
      desc: "Transparent exchange and resale for jewellery purchased from our shop only (no outside jewellery accepted)."
    },
    {
      icon: Sparkles,
      title: "Easy Gold Polish, Silver Polish & Rhodium Polish",
      desc: "Professional gold polish, silver polish, and premium rhodium plating services to restore your jewellery shine."
    }
  ];

  // FAQs
  const faqs = [
    {
      q: "What are the showroom opening hours?",
      a: "Our showroom is open Monday through Sunday from 10:00 AM to 7:30 PM. Please note that Tuesdays are our weekly holiday."
    },
    {
      q: "Are all jewellery items BIS Hallmarked?",
      a: "Yes! Every single gold item is laser-certified with BIS 916 (22K) / 750 (18K) Hallmarking and HUID number. Silver items are certified 999 / 925 Sterling grade."
    },
    {
      q: "Can I test the purity of my old gold at the showroom?",
      a: "Absolutely. We provide complimentary, instant Karatmeter XRF laser purity analysis right in front of you."
    },
    {
      q: "What payment options are accepted?",
      a: "We accept Cash, UPI (Google Pay, PhonePe, Paytm), Debit Cards, Credit Cards, Net Banking, and Direct Gold Trade-In valuation credits."
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950 pb-20">
      
      {/* 1. LUXURY HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 py-16 px-4 sm:px-6 lg:px-8 border-b border-amber-900/20">
        {/* Decorative Background Glowing Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          
          {/* Top Pill Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              {t("shopBadge")}
            </span>

            {/* Live Open/Closed Status Pill */}
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border shadow-sm ${
                isShopOpen
                  ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40"
                  : "bg-red-500 text-red-300 border-red-500/40"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isShopOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
              {statusText}
            </span>
          </div>

          {/* Main Title & Subtitle */}
          <img src={shoplogo} alt="Logo" className="w-full h-full mx-auto mb-2 " />
          {/* <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-300 font-normal leading-relaxed mb-8">
            {t("shopSubtitle")}
          </p> */}

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={SITE_CONFIG.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all"
            >
              <Navigation className="w-4 h-4 fill-neutral-950" />
              <span>{t("getDirections")}</span>
            </a>

            {/* <a
              href="#appointment"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 hover:border-amber-500/60 font-semibold text-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{t("bookAppointment")}</span>
            </a> */}

            <a
              href={`https://wa.me/${SITE_CONFIG.whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 font-semibold text-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Showroom Desk</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. SHOWROOM DETAILS GRID (4 ESSENTIAL CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Address */}
          <div className="bg-neutral-900/80 border border-amber-500/20 rounded-2xl p-6 shadow-xl relative group hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-100 mb-2">{t("showroomLocation")}</h3>
              <p className="text-sm text-neutral-300 font-medium leading-snug">{SITE_CONFIG.address}</p>
              <p className="text-xs text-neutral-400 mt-1">{SITE_CONFIG.cityState}</p>
              <div className="mt-3 text-xs text-amber-400/90 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                📍 <strong>Landmark:</strong> {SITE_CONFIG.landmark}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyAddress}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAddress ? "Address Copied!" : "Copy Full Address"}</span>
            </button>
          </div>

          {/* Card 2: Hours */}
          <div className="bg-neutral-900/80 border border-amber-500/20 rounded-2xl p-6 shadow-xl relative group hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-100 mb-2">{t("workingHoursTitle")}</h3>
              <div className="space-y-2 text-xs">
                {SITE_CONFIG.workingHours.map((wh, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-neutral-800 pb-1.5">
                    <span className="text-neutral-400 font-medium">{wh.days}</span>
                    <span className="text-amber-300 font-semibold">{wh.hours}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-[11px] text-neutral-500 italic">
              * Open 7 days a week including National Holidays.
            </p>
          </div>

          {/* Card 3: Contact */}
          <div className="bg-neutral-900/80 border border-amber-500/20 rounded-2xl p-6 shadow-xl relative group hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-100 mb-2">{t("contactNumbers")}</h3>
              <div className="space-y-2 text-sm text-neutral-300">
                <div>
                  <span className="text-xs text-neutral-500 block">Kaushal Chokshi</span>
                  <a href={`tel:${SITE_CONFIG.phone}`} className="font-bold text-amber-300 hover:underline">
                    {SITE_CONFIG.whatsappNumber}
                  </a>
                </div>              
              </div>
            </div>
          </div>

          {/* Card 4: Certifications */}
          {/* <div className="bg-neutral-900/80 border border-amber-500/20 rounded-2xl p-6 shadow-xl relative group hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-100 mb-2">{t("bisGstin")}</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-neutral-500 block">{t("bisLicenseText")}</span>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 inline-block mt-0.5">
                    {SITE_CONFIG.bisLicense}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">{t("gstinText")}</span>
                  <span className="font-mono text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 inline-block mt-0.5">
                    {SITE_CONFIG.gstin}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>100% BIS Hallmarked Guarantee</span>
            </div>
          </div> */}

        </div>
      </section>

      {/* 3. INTERACTIVE GOOGLE MAPS EMBED SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-neutral-900 border border-amber-500/20 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Header Bar Above Map */}
          <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-100">Live Google Maps Location</h3>
                <p className="text-xs text-neutral-400">Find GSJ Flagship Store on Google Maps & Apple Maps</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href={SITE_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={`http://maps.apple.com/?q=${encodeURIComponent(SITE_CONFIG.storeName + " " + SITE_CONFIG.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-all border border-neutral-700"
              >
                <span>Apple Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
              </a>
            </div>
          </div>

          {/* Embedded Google Map iFrame */}
          <div className="w-full h-80 sm:h-96 md:h-[450px] relative bg-neutral-950">
            <iframe
              title="GSJ Luxury Showroom Google Maps Location"
              src={SITE_CONFIG.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: "brightness(0.9) contrast(1.1)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>

          {/* Sub-bar Guidance */}
          <div className="bg-neutral-900/90 p-4 border-t border-neutral-800 text-xs text-neutral-300 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Dedicated customer parking space with free valet assistance at entrance.</span>
            </div>
            <div className="text-neutral-400">
              Metro & Bus station located 200m away.
            </div>
          </div>

        </div>
      </section>

      {/* 4. SHOWROOM VIRTUAL PREVIEW GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
            {t("virtualTour")}
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-neutral-100 mt-3 mb-2">
            Inside GSJ Showroom
          </h2>
          <p className="text-sm text-neutral-400">
            {t("virtualTourDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {galleryPhotos.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedGalleryImg(photo)}
              className="group relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-2xl cursor-pointer bg-neutral-900 transition-all hover:scale-[1.01]"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent p-6 flex flex-col justify-end">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  Showroom Preview #{idx + 1}
                </span>
                <h3 className="text-xl font-bold text-neutral-100">{photo.title}</h3>
                <p className="text-xs text-neutral-300">{photo.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal for Gallery */}
      {selectedGalleryImg && (
        <div
          className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryImg(null)}
        >
          <div className="max-w-4xl w-full bg-neutral-900 border border-amber-500/30 rounded-3xl overflow-hidden p-2 relative">
            <img
              src={selectedGalleryImg.url}
              alt={selectedGalleryImg.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
            <div className="p-4 text-center">
              <h4 className="text-lg font-bold text-amber-300">{selectedGalleryImg.title}</h4>
              <p className="text-xs text-neutral-400">{selectedGalleryImg.subtitle}</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. SHOWROOM AMENITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-100">
            {t("amenitiesTitle")}
          </h2>
          <p className="text-xs text-neutral-400 mt-2">
            Designed for an opulent, transparent, and seamless shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-neutral-900/70 border border-neutral-800 hover:border-amber-500/30 rounded-2xl p-6 transition-all hover:bg-neutral-900"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-100 mb-1">{item.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. VIP APPOINTMENT / INQUIRY FORM */}
      <section id="appointment" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-bold px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
              VIP Reservation
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-neutral-100 mt-3 mb-2">
              {t("bookAppointment")}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto">
              {t("appointmentDesc")}
            </p>
          </div>

          {formSubmitted ? (
            <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-neutral-100">Appointment Request Received!</h3>
              <p className="text-xs text-neutral-300 max-w-md mx-auto">
                {t("appointmentSuccessMsg")}
              </p>
              <button
                type="button"
                onClick={() => setFormSubmitted(false)}
                className="mt-2 px-6 py-2 rounded-xl bg-neutral-800 text-neutral-200 text-xs font-semibold hover:bg-neutral-700"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitAppointment} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {t("fullNameLabel")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {t("phoneLabel")} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {t("visitDateLabel")} *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none"
                  />
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {t("visitTimeLabel")}
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none"
                  >
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                    <option value="07:30 PM">07:30 PM</option>
                  </select>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {t("purposeLabel")}
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-neutral-100 focus:outline-none"
                  >
                    <option value="Bridal Jewellery Shopping">{t("purposeOption1")}</option>
                    <option value="Old Gold Exchange">{t("purposeOption2")}</option>
                    <option value="Custom Design Consultation">{t("purposeOption3")}</option>
                    <option value="Silver Articles & Coins">{t("purposeOption4")}</option>
                    <option value="General Showroom Visit">{t("purposeOption5")}</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  {t("notesLabel")}
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Mention specific ornaments, weight requirements, or custom reference details..."
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-xl px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-base shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5 fill-neutral-950" />
                <span>{t("submitAppointmentBtn")}</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-neutral-100">
            {t("faqTitle")}
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Everything you need to know before visiting GSJ Showroom.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 text-left flex justify-between items-center gap-4 font-semibold text-sm text-neutral-100 hover:text-amber-300"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default OurShopPage;
