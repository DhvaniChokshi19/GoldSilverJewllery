import React, { useState, useEffect } from "react";
import shoplogo from "../assets/header.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogIn,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Crown,
  Gem,
  Calculator,
  Scale,
  Store,
  User,
  Home,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import RateBar from "./RateBar";
import { useTranslation } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const Header = ({ liveRates }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLang, t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [calcDropdownOpen, setCalcDropdownOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    setMobileMenuOpen(false);
    navigate("/");
  };

  // Set data-lang on html element for CSS font switching
  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
  }, [lang]);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setCalcDropdownOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    {
      name: t("home"),
      path: "/",
      icon: Home,
    },
    {
      name: t("goldJewellery"),
      path: "/goldjewellery",
      icon: Crown,
      badge: "Gold",
      badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    },
    {
      name: t("silverJewellery"),
      path: "/silverjewellery",
      icon: Gem,
      badge: "Silver",
      badgeClass: "bg-slate-500/15 text-slate-300 border-slate-400/30",
    },
    {
      name: t("customOrder"),
      path: "/customorder",
      icon: Sparkles,
    },
    {
      name: t("ourShop"),
      path: "/our-shop",
      icon: Store,
    },
  ];

  const calcLinks = [
    {
      name: t("priceCalculator"),
      path: "/price-calculator",
      description: lang === "gu" ? "લાઇવ ભાવ સાથે ઘરેણાંનો ખર્ચ ગણો" : "Estimate custom jewellery cost with live rates",
      icon: Calculator,
    },
    {
      name: t("oldGoldExchange"),
      path: "/old-gold-calculator",
      description: lang === "gu" ? "જૂના સોનાનું મૂલ્ય ગણો" : "Calculate resale value & purity estimation",
      icon: Scale,
    },
  ];

  return (
    <header className="header w-full sticky top-0 z-50 shadow-2xl transition-all">
      {/* 1. Live Market Rates Ticker Bar */}
      <RateBar rates={liveRates} />

      {/* 2. Top Header Logo Section */}
      <div className="top-header w-full bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 border-b border-amber-900/20 py-3 sm:py-4 px-4">
        <div className="w-full flex justify-center items-center">
          <Link to="/" className="inline-block group focus:outline-none">
            <img
              className="max-h-16 sm:max-h-28 md:max-h-24 w-auto object-contain drop-shadow-[0_4px_16px_rgba(217,119,6,0.25)] group-hover:scale-[1.02] transition-transform duration-300"
              src={shoplogo}
              alt="Gold Silver Jewellery Logo"
            />
          </Link>
        </div>
      </div>

      {/* 3. Responsive Navbar */}
      <nav className="bg-neutral-900/95 backdrop-blur-md border-b border-amber-500/15 shadow-lg">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center justify-center flex-1 space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-amber-500/15 to-amber-600/5 text-amber-300 border border-amber-500/30 shadow-sm"
                        : "text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-amber-400" : "text-neutral-500"}`} />
                    <span>{link.name}</span>
                    {/* {link.badge && (
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border font-semibold ${link.badgeClass}`}>
                        {link.badge}
                      </span>
                    )} */}
                  </Link>
                );
              })}

              {/* Calculators Dropdown */}
              <div className="relative" onMouseLeave={() => setCalcDropdownOpen(false)}>
                <button
                  type="button"
                  onClick={() => setCalcDropdownOpen(!calcDropdownOpen)}
                  onMouseEnter={() => setCalcDropdownOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/price-calculator") || isActive("/old-gold-calculator")
                      ? "bg-gradient-to-r from-amber-500/15 to-amber-600/5 text-amber-300 border border-amber-500/30"
                      : "text-neutral-300 hover:text-amber-300 hover:bg-neutral-800/50"
                  }`}
                >
                  <Calculator className="w-4 h-4 text-amber-400" />
                  <span>{t("calculators")}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${calcDropdownOpen ? "rotate-180 text-amber-400" : "text-neutral-500"}`} />
                </button>

                {calcDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-64 rounded-xl bg-neutral-900 border border-amber-500/25 shadow-2xl py-2 z-50 backdrop-blur-xl">
                    {calcLinks.map((calc) => {
                      const CalcIcon = calc.icon;
                      const active = isActive(calc.path);
                      return (
                        <Link
                          key={calc.path}
                          to={calc.path}
                          onClick={() => setCalcDropdownOpen(false)}
                          className={`flex items-start gap-3 px-4 py-2.5 transition-all ${
                            active
                              ? "bg-amber-500/10 text-amber-300"
                              : "text-neutral-300 hover:bg-neutral-800/60 hover:text-amber-300"
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15 text-amber-400 mt-0.5">
                            <CalcIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-neutral-100">{calc.name}</div>
                            <div className="text-xs text-neutral-500 font-normal">{calc.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Right: Theme Toggle + Language Toggle + Auth */}
            <div className="hidden md:flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 hover:border-amber-500/40 text-neutral-300 hover:text-amber-300 text-xs font-bold transition-all"
                title={isDark ? t("lightMode") : t("darkMode")}
              >
                {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                
              </button>

              {/* Language Toggle */}
              <button
                type="button"
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 hover:border-amber-500/40 text-neutral-300 hover:text-amber-300 text-xs font-bold transition-all"
                title={lang === "en" ? "ગુજરાતીમાં બદલો" : "Switch to English"}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{t("language")}</span>
              </button>

              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-amber-500/25 text-amber-300 text-xs font-medium">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span className="max-w-[90px] truncate">{userData.name || "Customer"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/60 text-neutral-300 hover:text-red-300 border border-neutral-700 hover:border-red-500/30 text-sm font-medium transition-all"
                  >
                    <span>{t("logout")}</span>
                    <LogOut className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 rounded-lg text-neutral-300 hover:text-amber-300 text-sm font-medium transition-colors"
                  >
                    {t("logIn")}
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-semibold text-sm shadow-md hover:shadow-amber-500/25 transition-all"
                  >
                    <span>{t("signUp")}</span>
                    <LogIn className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <div className="flex md:hidden items-center gap-1">
              {/* Mobile Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-amber-400 hover:bg-neutral-800"
                title={isDark ? t("lightMode") : t("darkMode")}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              {/* Mobile Language Toggle */}
              <button
                type="button"
                onClick={toggleLang}
                className="p-2 rounded-lg text-amber-400 hover:bg-neutral-800 text-xs font-bold"
                title={lang === "en" ? "ગુજરાતીમાં બદલો" : "Switch to English"}
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-amber-400 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 4. Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-900 border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-3 shadow-2xl">
            {/* Main Section */}
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/60 px-3 py-1">
                {lang === "gu" ? "નેવિગેશન મેનુ" : "Navigation Menu"}
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                      active
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "text-neutral-200 hover:bg-neutral-800 hover:text-amber-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${active ? "text-amber-400" : "text-neutral-500"}`} />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-bold ${link.badgeClass}`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Calculators Section */}
            <div className="pt-2 border-t border-neutral-800 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400/60 px-3 py-1">
                {lang === "gu" ? "કેલ્ક્યુલેટર અને મૂલ્યાંકન" : "Calculators & Valuation"}
              </div>
              {calcLinks.map((calc) => {
                const CalcIcon = calc.icon;
                const active = isActive(calc.path);
                return (
                  <Link
                    key={calc.path}
                    to={calc.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all ${
                      active
                        ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                        : "text-neutral-200 hover:bg-neutral-800 hover:text-amber-300"
                    }`}
                  >
                    <CalcIcon className={`w-5 h-5 ${active ? "text-amber-400" : "text-neutral-500"}`} />
                    <div className="flex flex-col">
                      <span>{calc.name}</span>
                      <span className="text-xs text-neutral-500 font-normal">{calc.description}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Actions */}
            <div className="pt-3 border-t border-neutral-800">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 text-amber-300 text-sm">
                    <User className="w-4 h-4 text-amber-400" />
                    <span>{lang === "gu" ? "લૉગ ઇન" : "Logged in as"} <strong>{userData.name || "Customer"}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-950/50 text-red-300 border border-red-500/30 text-base font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t("logout")}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-neutral-800 text-neutral-200 hover:text-amber-300 text-base font-medium border border-neutral-700"
                  >
                    {t("logIn")}
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-semibold text-base shadow-md"
                  >
                    <span>{t("signUp")}</span>
                    <LogIn className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
