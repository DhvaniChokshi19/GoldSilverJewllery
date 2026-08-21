import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const translations = {
  en: {
    // Nav
    home: "Home",
    goldJewellery: "Gold Jewellery",
    silverJewellery: "Silver Jewellery",
    customOrder: "Custom Order",
    ourShop: "Our Shop",
    calculators: "Calculators",
    priceCalculator: "Price Calculator",
    oldGoldExchange: "Old Gold Exchange",
    logIn: "Log In",
    signUp: "Sign Up",
    logout: "Logout",
    language: "ગુજ",
    darkMode: "Dark",
    lightMode: "Light",

    // Hero
    heroBadge: "BIS 916 & 999 Certified Jewellers",
    heroTitle1: "Timeless Elegance",
    heroTitle2: "Pure Gold & Silver",
    heroDesc: "Explore authentic BIS hallmarked jewellery — bridal necklaces, temple bangles, certified rings, and pure 999 silver articles with live market pricing.",
    viewCollection: "View Full Collection",
    liveCalculator: "Live Rate Calculator",

    // Stats
    stat1Label: "BIS Hallmarked",
    stat1Value: "100%",
    stat2Label: "Market Rates",
    stat2Value: "Live API",
    stat3Label: "Hidden Pricing",
    stat3Value: "0%",

    // Trust bar
    trustHallmark: "BIS 916 & 999 Hallmark",
    trustHallmarkDesc: "Every gold item is laser-certified.",
    trustBilling: "Transparent Billing",
    trustBillingDesc: "Gold weight, making charge & GST itemized.",
    trustOldGold: "Best Old Gold Rate",
    trustOldGoldDesc: "Full melt value guarantee on trade-ins.",
    trustWhatsApp: "WhatsApp Support",
    trustWhatsAppDesc: "Direct showroom help, 7 days a week.",

    // Featured
    featuredBadge: "Curated Catalogue",
    featuredTitle: "Featured Creations",
    viewAllItems: "View All Items",
    noFeaturedProducts: "No featured products yet.",
    noFeaturedDesc: "Products added from the admin panel will appear here.",

    // Category Carousels
    goldCategoriesTitle: "Gold Jewellery Collection",
    goldCategoriesBadge: "Explore Gold",
    silverCategoriesTitle: "Silver Jewellery Collection",
    silverCategoriesBadge: "Explore Silver",
    noCategoriesYet: "No categories yet.",
    noCategoriesDesc: "Add categories from the admin panel.",
    products: "Products",
    subCategories: "Sub Categories",

    // Bespoke
    bespokeBadge: "Artisan Customization",
    bespokeTitle: "Want a Bespoke Custom Jewellery Piece?",
    bespokeDesc: "Have a design reference image or custom weight requirement? Upload your design or share details with our goldsmith team for direct WhatsApp quotation.",
    bespokeBtn: "Submit Custom Design",

    // Calculator section
    calcBadge: "Live Utility Tools",
    calcTitle: "Gold & Silver Rate Calculation Engine",
    calcDesc: "Switch between our Live Retail Price Breakdown tool and the Old Gold Trade-In Exchange calculator.",
    calcTab1: "Live Item Price Calculator",
    calcTab2: "Old Gold Exchange Estimator",

    // Product Card
    liveEstimatedPrice: "Live Estimated Price",
    inquireWhatsApp: "Inquire on WhatsApp",
    quickDetails: "Quick Details",
    grams: "Grams",

    // Catalog
    catalogBadge: "Exclusive Showcase",
    catalogTitle: "Gold & Silver Jewellery Collection",
    catalogDesc: "Showing authentic BIS hallmarked items. Dynamic prices reflect live market bullion rates.",
    searchPlaceholder: "Search necklace, ring, coins...",
    metalFilter: "Metal:",
    allMetals: "All Metals",
    goldJewelleryFilter: "✨ Gold Jewellery",
    silverCollectionFilter: "💎 Silver Collection",
    categoryFilter: "Category:",
    allCategories: "All Categories",
    noItemsMatch: "No items match your criteria",
    noItemsTip: "Try searching with another keyword or resetting metal filters.",
    resetFilters: "Reset All Filters",
    loadingProducts: "Loading products...",
    noProductsYet: "No Products Available Yet",
    noProductsDesc: "Products added from the admin panel will appear here.",

    // Our Shop & Contact Page
    shopBadge: "Visit GSJ Showroom",
    shopTitle: "GSJ Flagship Luxury Showroom",
    shopSubtitle: "Step inside our showroom for authentic BIS hallmarked gold & silver jewellery, live Karatmeter purity testing, and personalized VIP bridal consultations.",
    openNow: "Open Now",
    closedNow: "Closed Now",
    showroomLocation: "Showroom Location",
    getDirections: "Get Directions on Maps",
    workingHoursTitle: "Showroom Operating Hours",
    contactNumbers: "Call Showroom Desk",
    emailUs: "Email Inquiries",
    bisGstin: "Official Registrations",
    bisLicenseText: "BIS Hallmark License:",
    gstinText: "GSTIN Reg No:",
    virtualTour: "Showroom Preview Gallery",
    virtualTourDesc: "Take a visual peek at our VIP bridal lounge and interactive display counters.",
    bookAppointment: "Book VIP Showroom Appointment",
    appointmentDesc: "Reserve a dedicated specialist for bridal trousseau, bespoke design, or trade-in valuation.",
    fullNameLabel: "Full Name",
    phoneLabel: "Phone Number",
    emailLabel: "Email Address (Optional)",
    visitDateLabel: "Preferred Visit Date",
    visitTimeLabel: "Preferred Time Slot",
    purposeLabel: "Purpose of Visit",
    purposeOption1: "Bridal Jewellery Shopping",
    purposeOption2: "Old Gold Exchange & Valuation",
    purposeOption3: "Custom Design Consultation",
    purposeOption4: "Silver Articles & Bullion",
    purposeOption5: "General Showroom Browse",
    notesLabel: "Additional Notes / Requirements",
    submitAppointmentBtn: "Confirm Showroom Appointment",
    appointmentSuccessMsg: "Thank you! Your appointment request has been submitted. We are opening WhatsApp to confirm details.",
    amenitiesTitle: "Premium Showroom Amenities",
    faqTitle: "Frequently Asked Questions",
    whatsappConcierge: "GSJ Live WhatsApp Concierge",
    whatsappStatus: "Online • Quick Response",
    whatsappGreeting: "Need assistance with live gold rates, custom orders, or showroom directions?",
    whatsappPresetRates: "📈 Check Today's Live Rates",
    whatsappPresetAppointment: "📅 Book Showroom Visit",
    whatsappPresetCustom: "✨ Custom Jewellery Quote",
    whatsappPresetDirections: "📍 Get Store Directions",
  },

  gu: {
    // Nav
    home: "હોમ",
    goldJewellery: "સોનાના ઘરેણાં",
    silverJewellery: "ચાંદીના ઘરેણાં",
    customOrder: "કસ્ટમ ઓર્ડર",
    ourShop: "અમારી દુકાન",
    calculators: "કેલ્ક્યુલેટર",
    priceCalculator: "ભાવ કેલ્ક્યુલેટર",
    oldGoldExchange: "જૂનું સોનું",
    logIn: "લૉગ ઇન",
    signUp: "સાઇન અપ",
    logout: "લૉગ આઉટ",
    language: "EN",
    darkMode: "ડાર્ક",
    lightMode: "લાઇટ",

    // Hero
    heroBadge: "BIS 916 & 999 પ્રમાણિત જવેલર્સ",
    heroTitle1: "કાલાતીત ભવ્યતા",
    heroTitle2: "શુદ્ધ સોનું અને ચાંદી",
    heroDesc: "BIS હોલમાર્ક વાળા ઘરેણાં — બ્રાઇડલ નેકલેસ, ટેમ્પલ બંગડી, પ્રમાણિત વીંટી અને શુદ્ધ 999 ચાંદીની વસ્તુઓ લાઇવ બજાર ભાવ સાથે.",
    viewCollection: "સંપૂર્ણ કલેક્શન જુઓ",
    liveCalculator: "લાઇવ ભાવ કેલ્ક્યુલેટર",

    // Stats
    stat1Label: "BIS હોલમાર્ક",
    stat1Value: "100%",
    stat2Label: "બજાર ભાવ",
    stat2Value: "લાઇવ",
    stat3Label: "છુપાયેલ ભાવ",
    stat3Value: "0%",

    // Trust bar
    trustHallmark: "BIS 916 & 999 હોલમાર્ક",
    trustHallmarkDesc: "દરેક સોનાની વસ્તુ લેસર-પ્રમાણિત.",
    trustBilling: "પારદર્શક બિલિંગ",
    trustBillingDesc: "સોનાનું વજન, મેકિંગ ચાર્જ અને GST.",
    trustOldGold: "જૂના સોનાનો શ્રેષ્ઠ ભાવ",
    trustOldGoldDesc: "ટ્રેડ-ઇન પર સંપૂર્ણ મેલ્ટ મૂલ્ય.",
    trustWhatsApp: "WhatsApp સહાય",
    trustWhatsAppDesc: "શોરૂમ ટીમ, અઠવાડિયાના ૭ દિવસ.",

    // Featured
    featuredBadge: "ક્યુરેટેડ કેટાલોગ",
    featuredTitle: "ફીચર્ડ ઘરેણાં",
    viewAllItems: "બધી વસ્તુઓ જુઓ",
    noFeaturedProducts: "હજુ કોઈ ફીચર્ડ પ્રોડક્ટ નથી.",
    noFeaturedDesc: "એડમિન પેનલમાંથી ઉમેરેલી પ્રોડક્ટ્સ અહીં દેખાશે.",

    // Category Carousels
    goldCategoriesTitle: "સોનાના ઘરેણાંનો સંગ્રહ",
    goldCategoriesBadge: "સોનું ખોલો",
    silverCategoriesTitle: "ચાંદીના ઘરેણાંનો સંગ્રહ",
    silverCategoriesBadge: "ચાંદી ખોલો",
    noCategoriesYet: "હજુ કોઈ કેટેગરી નથી.",
    noCategoriesDesc: "એડમિન પેનલમાંથી કેટેગરી ઉમેરો.",
    products: "પ્રોડક્ટ",
    subCategories: "પેટા કેટેગરી",

    // Bespoke
    bespokeBadge: "કારીગર કસ્ટમાઇઝેશન",
    bespokeTitle: "કસ્ટમ ઘરેણાં બનાવવા માંગો છો?",
    bespokeDesc: "ડિઝાઇન રેફરન્સ ઇમેજ કે વજનની જરૂરિયાત છે? અમારી ગોલ્ડસ્મિથ ટીમ સાથે WhatsApp પર શેર કરો.",
    bespokeBtn: "કસ્ટમ ડિઝાઇન મોકલો",

    // Calculator section
    calcBadge: "લાઇવ ટૂલ્સ",
    calcTitle: "સોનું અને ચાંદી ભાવ ગણતરી",
    calcDesc: "લાઇવ રિટેલ ભાવ બ્રેકડાઉન અને જૂના સોનાના ટ્રેડ-ઇન કેલ્ક્યુલેટર વચ્ચે સ્વિચ કરો.",
    calcTab1: "લાઇવ ભાવ કેલ્ક્યુલેટર",
    calcTab2: "જૂનું સોનું એક્સચેન્જ",

    // Product Card
    liveEstimatedPrice: "લાઇવ અંદાજિત ભાવ",
    inquireWhatsApp: "WhatsApp પર પૂછો",
    quickDetails: "ઝડપી માહિતી",
    grams: "ગ્રામ",

    // Catalog
    catalogBadge: "વિશેષ પ્રદર્શન",
    catalogTitle: "સોના અને ચાંદીના ઘરેણાંનો સંગ્રહ",
    catalogDesc: "BIS હોલમાર્ક વાળી વસ્તુઓ. ભાવ લાઇવ બજાર ભાવ પ્રમાણે.",
    searchPlaceholder: "નેકલેસ, વીંટી, સિક્કા શોધો...",
    metalFilter: "ધાતુ:",
    allMetals: "બધી ધાતુઓ",
    goldJewelleryFilter: "✨ સોનાના ઘરેણાં",
    silverCollectionFilter: "💎 ચાંદીનો સંગ્રહ",
    categoryFilter: "કેટેગરી:",
    allCategories: "બધી કેટેગરી",
    noItemsMatch: "કોઈ વસ્તુ મેચ થતી નથી",
    noItemsTip: "બીજું કીવર્ડ અજમાવો અથવા ફિલ્ટર રીસેટ કરો.",
    resetFilters: "બધા ફિલ્ટર રીસેટ કરો",
    loadingProducts: "પ્રોડક્ટ્સ લોડ થઈ રહી છે...",
    noProductsYet: "હજુ કોઈ પ્રોડક્ટ ઉપલબ્ધ નથી",
    noProductsDesc: "એડમિન પેનલમાંથી ઉમેરેલી પ્રોડક્ટ્સ અહીં દેખાશે.",

    // Our Shop & Contact Page
    shopBadge: "GSJ શોરૂમની મુલાકાત લો",
    shopTitle: "GSJ ફ્લેગશિપ લક્ઝરી શોરૂમ",
    shopSubtitle: "BIS હોલમાર્ક પ્રમાણિત સોના અને ચાંદીના ઘરેણાં, લાઇવ કેરેટમીટર શુદ્ધતા ટેસ્ટિંગ અને કસ્ટમ કન્સલ્ટેશન માટે અમારા શોરૂમની મુલાકાત લો.",
    openNow: "અત્યારે ખુલ્લું છે",
    closedNow: "અત્યારે બંધ છે",
    showroomLocation: "શોરૂમ સરનામું અને લોકેશન",
    getDirections: "Google Maps પર રસ્તો મેળવો",
    workingHoursTitle: "શોરૂમ સમયપત્રક",
    contactNumbers: "શોરૂમ ફોન લાઇન",
    emailUs: "ઇમેઇલ સંપર્ક",
    bisGstin: "સરકારી રજીસ્ટ્રેશન",
    bisLicenseText: "BIS હોલમાર્ક લાયસન્સ:",
    gstinText: "GSTIN નંબર:",
    virtualTour: "શોરૂમ ફોટો ગેલેરી",
    virtualTourDesc: "અમારા VIP બ્રાઇડલ લાઉન્જ અને ઇન્ટરેક્ટિવ ડિસ્પ્લે કાઉન્ટરની ઝાંખી જુઓ.",
    bookAppointment: "VIP શોરૂમ મુલાકાત બુક કરો",
    appointmentDesc: "લગ્ન સંગ્રહ, કસ્ટમ ડિઝાઇન અથવા જૂના સોનાના મૂલ્યાંકન માટે એપોઇન્ટમેન્ટ બુક કરો.",
    fullNameLabel: "પૂરું નામ",
    phoneLabel: "મોબાઇલ નંબર",
    emailLabel: "ઇમેઇલ (મરજિયાત)",
    visitDateLabel: "પસંદગીની તારીખ",
    visitTimeLabel: "પસંદગીનો સમય",
    purposeLabel: "મુલાકાતનો હેતુ",
    purposeOption1: "બ્રાઇડલ જ્વેલરી ખરીદી",
    purposeOption2: "જૂના સોનાનું એક્સચેન્જ અને મૂલ્યાંકન",
    purposeOption3: "કસ્ટમ ડિઝાઇન સલાહ",
    purposeOption4: "ચાંદીની વસ્તુઓ અને સિક્કા",
    purposeOption5: "સામાન્ય શોરૂમ નિરીક્ષણ",
    notesLabel: "વધારાની નોંધો / વિગતો",
    submitAppointmentBtn: "એપોઇન્ટમેન્ટ કન્ફર્મ કરો",
    appointmentSuccessMsg: "આભાર! તમારી એપોઇન્ટમેન્ટ સબમિટ થઈ ગઈ છે. વિગતો માટે WhatsApp ખુલી રહ્યું છે.",
    amenitiesTitle: "શોરૂમ સુવિધાઓ",
    faqTitle: "વારંવાર પૂછાતા પ્રશ્નો",
    whatsappConcierge: "GSJ લાઇવ WhatsApp હેલ્પડેસ્ક",
    whatsappStatus: "ઓનલાઇન • ઝડપી ઉત્તર",
    whatsappGreeting: "લાઇવ સોનાના ભાવ, કસ્ટમ ઓર્ડર અથવા દિશા જાણવા માટે સંપર્ક કરો",
    whatsappPresetRates: "📈 આજના લાઇવ ભાવ જુઓ",
    whatsappPresetAppointment: "📅 શોરૂમ મુલાકાત બુક કરો",
    whatsappPresetCustom: "✨ કસ્ટમ ઘરેણાં ક્વોટ",
    whatsappPresetDirections: "📍 શોરૂમનું લોકેશન મેળવો",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("gsj-lang") || "en";
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "gu" : "en";
      localStorage.setItem("gsj-lang", next);
      return next;
    });
  }, []);

  const t = useCallback(
    (key) => translations[lang]?.[key] || translations.en[key] || key,
    [lang]
  );

  const value = useMemo(() => ({ lang, toggleLang, t }), [lang, toggleLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}

export default LanguageContext;
