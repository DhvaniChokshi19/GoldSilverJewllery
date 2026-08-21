import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import HomePage from "./Pages/HomePage";
import ProductCatalog from "./Pages/ProductCatalog";
import ProductDetails from "./Pages/ProductDetails";
import PriceCalculator from "./Components/PriceCalculator";
import OldGoldCalculator from "./Components/OldGoldCalculator";
import BespokeOrder from "./Pages/BespokeOrder";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import AdminPanel from "./Pages/admin/adminPanel";
import OurShopPage from "./Pages/OurShopPage";
import WhatsAppSticker from "./Components/WhatsAppSticker";
import axiosInstance from "./api/axios";
import { SITE_CONFIG } from "./config/siteConfig";

const App = () => {
  const [liveRates, setLiveRates] = useState(SITE_CONFIG.defaultRates);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const { data } = await axiosInstance.get("api/rates/get");
        if (data && data.success && data.data) {
          setLiveRates(data.data);
        }
      } catch (e) {
        // Fallback silently to default rates
      }
    };
    fetchRates();
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-neutral-950 font-sans selection:bg-amber-500 selection:text-neutral-950">
            <Header liveRates={liveRates} />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage liveRates={liveRates} />} />
                <Route path="/catalog" element={<ProductCatalog liveRates={liveRates} />} />
                <Route path="/goldjewellery" element={<ProductCatalog liveRates={liveRates} />} />
                <Route path="/silverjewellery" element={<ProductCatalog liveRates={liveRates} />} />
                <Route path="/product/:id" element={<ProductDetails liveRates={liveRates} />} />
                <Route
                  path="/price-calculator"
                  element={
                    <div className="py-12 px-4 max-w-5xl mx-auto">
                      <PriceCalculator initialRates={liveRates} />
                    </div>
                  }
                />
                <Route
                  path="/old-gold-calculator"
                  element={
                    <div className="py-12 px-4 max-w-4xl mx-auto">
                      <OldGoldCalculator initialRates={liveRates} />
                    </div>
                  }
                />
                <Route path="/customorder" element={<BespokeOrder />} />
                <Route path="/our-shop" element={<OurShopPage liveRates={liveRates} />} />
                <Route path="/shop" element={<OurShopPage liveRates={liveRates} />} />
                <Route path="/contact" element={<OurShopPage liveRates={liveRates} />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>

            <Footer />

            {/* Floating WhatsApp Chat Sticker available across all pages */}
            <WhatsAppSticker />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
