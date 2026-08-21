import React, { useState, useEffect } from "react";
import { Search, Filter, Sparkles, SlidersHorizontal, Grid, ArrowUpDown } from "lucide-react";
import ProductCard from "../Components/ProductCard";
import ProductModal from "../Components/ProductModal";
import { SITE_CONFIG } from "../config/siteConfig";

import heroGoldNecklace from "../assets/hero_gold_necklace.png";


import axiosInstance from "../api/axios";

const ProductCatalog = ({ liveRates }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetal, setSelectedMetal] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  useEffect(() => {
    const fetchBackendProducts = async () => {
      try {
        const { data } = await axiosInstance.get("api/products");
        if (data && data.success && Array.isArray(data.data)) {
          const formatted = data.data.map((p) => ({
            ...p,
            metal: p.collectionId?.name || (p.name?.toLowerCase().includes("silver") ? "Silver" : "Gold"),
            category: p.categoryId?.name || p.label || "Jewellery",
            weight: typeof p.weight === "string" ? parseFloat(p.weight) || 10 : (p.weight || 10),
            image: p.images?.[0] || p.image || heroGoldNecklace
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.warn("Could not fetch products from MongoDB API:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBackendProducts();
  }, []);

  // Derive categories dynamically from actual products
  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  // Filter Logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMetal =
      selectedMetal === "all" || p.metal?.toLowerCase() === selectedMetal.toLowerCase();
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesMetal && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-wrap justify-between items-end gap-4 border-b border-amber-500/20 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" /> Exclusive Showcase
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-100">
              Gold & Silver Jewellery Collection
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Showing authentic BIS hallmarked items. Dynamic prices reflect live market bullion rates.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search necklace, ring, coins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900/80 p-4 rounded-2xl border border-amber-500/20">
          
          {/* Metal Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-amber-400 uppercase mr-1">Metal:</span>
            {[
              { id: "all", label: "All Metals" },
              { id: "gold", label: "✨ Gold Jewellery" },
              { id: "silver", label: "💎 Silver Collection" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedMetal(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedMetal === item.id
                    ? "bg-amber-500 text-neutral-950 shadow-md font-bold"
                    : "bg-neutral-950 text-neutral-300 border border-neutral-800 hover:border-amber-500/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-400 uppercase hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-amber-200 focus:outline-none focus:border-amber-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-amber-400">
            <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-sm">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod._id}
                product={prod}
                liveRates={liveRates}
                onQuickView={(p) => setSelectedProductForModal(p)}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-neutral-800">
            <p className="text-5xl mb-4">💎</p>
            <h3 className="text-lg font-bold text-amber-300">No Products Available Yet</h3>
            <p className="text-xs text-neutral-500 mt-2">Products added from the admin panel will appear here.</p>
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-900/50 rounded-3xl border border-neutral-800">
            <Filter className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-neutral-300">No items match your criteria</h3>
            <p className="text-xs text-neutral-500 mt-1">
              Try searching with another keyword or resetting metal filters.
            </p>
            <button
              onClick={() => {
                setSelectedMetal("all");
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      {selectedProductForModal && (
        <ProductModal
          product={selectedProductForModal}
          liveRates={liveRates}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}
    </div>
  );
};

export default ProductCatalog;
