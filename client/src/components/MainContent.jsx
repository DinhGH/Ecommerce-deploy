/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { easeIn, easeInOut, motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { DangerButton, SecondaryButton } from "./ui/Buttons";
import DragSwitch from "./ui/DragSwitch";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import ProductCardDetail from "./ProductCardDetail";
import {
  Truck,
  ShieldCheck,
  Headphones,
  CreditCard,
  Star,
  RotateCcw,
} from "lucide-react";
import FeatureCard from "./FeatureCard";
import AboutSection from "./AboutSection";
import { ElegantSpinner } from "./ui/Loading";
import Cart from "./Cart";

export default function MainContent() {
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedopt, setSelectedopt] = useState("All");
  const [selected, setSelected] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [brands, setBrands] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [selectedbrand, setSelectedbrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [options, setOptions] = useState([]);

  const features = [
    { icon: Truck, title: "Fast Shipping" },
    { icon: CreditCard, title: "Secure Payment" },
    { icon: Headphones, title: "24/7 Support" },
    { icon: ShieldCheck, title: "Trusted Quality" },
    { icon: Star, title: "Premium Service" },
    { icon: RotateCcw, title: "Easy Returns" },
  ];

  const goNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const goPrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const [sortOrder, setSortOrder] = useState("");
  const [priceRange, setPriceRange] = useState([]);

  const togglePriceRange = (range) => {
    setPriceRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products/brands");
      setBrands(res.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const filterByBrand = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/products/filter-brand?brand=${selectedbrand}&page=${page}&limit=12`
      );
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brand) => {
    if (selectedbrand === brand) {
      setSelectedbrand("");
    } else {
      setSelectedbrand(brand);
    }
    setPage(1);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/products?page=${page}&limit=12`;
      if (keyword) {
        url = `http://localhost:5000/api/products/search?q=${encodeURIComponent(
          keyword
        )}&page=${page}&limit=12`;
      }

      const res = await axios.get(url);

      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/products/category"
      );
      setOptions(res.data);
    } catch (error) {
      console.error("Error get Category: ", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const filterByCategory = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/products/filter-category?category=${selectedopt}&page=${page}&limit=12`
      );
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keyword) {
      fetchProducts();
    } else if (selectedbrand) {
      filterByBrand(selectedbrand);
    } else if (selectedopt && selectedopt !== "All") {
      filterByCategory(selectedopt);
    } else {
      fetchProducts();
    }
  }, [page, keyword, selectedbrand, selectedopt]);

  const handleFilter = async () => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/products/filter?page=${page}&limit=12`;

      if (selectedopt && selectedopt !== "All") {
        url += `&category=${encodeURIComponent(selectedopt)}`;
      }
      if (selectedbrand) {
        url += `&selectedbrand=${encodeURIComponent(selectedbrand)}`;
      }
      if (keyword) {
        url += `&keyword=${encodeURIComponent(keyword)}`;
      }
      if (priceRange.length > 0) {
        url += `&priceRange=${priceRange.join(",")}`;
      }

      // Mặc định sắp xếp theo giá tăng dần nếu sortOrder chưa có
      url += `&sortOrder=${sortOrder}`;

      const res = await axios.get(url);
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setShowModal(false);
    } catch (error) {
      console.error("Error fetching filter:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFilter();
  }, [page]);

  // Fetch số lượng giỏ hàng
  useEffect(() => {
    fetchQuantity();
  });

  const fetchQuantity = async () => {
    axios
      .get("http://localhost:5000/api/cart", { withCredentials: true })
      .then((res) => {
        const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(total);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen flex flex-col overflow-y-auto  ">
      <Navbar
        onSearch={setKeyword}
        setPage={setPage}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCartUpdate={(newCount) => setCartCount(newCount)}
      />

      <div className="px-5 sm:px-10 md:px-20 text-black">
        {/* Category + Brand Section */}
        <section id="filter" className=" py-6">
          <div className="container mx-auto">
            {/* Brand */}
            <div className="w-1/1">
              <h2 className="text-2xl font-bold mb-4">Top Brands</h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 gap-4">
                {brands.map((item) => (
                  <button
                    onClick={() => {
                      handleBrandClick(item);
                    }}
                    key={item}
                    className={` px-6 py-5 shadow-lg rounded hover:scale-102 transition hover:bg-[#e3e3e3e3] ${
                      selectedbrand == item ? "bg-[#e3e3e3e3]" : "bg-white"
                    } text-center border border-black`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Product Section */}
        <section id="products" className=" py-2 sm:py-3 md:py-5 bg-[#f5f4f4f1]">
          {/* Filter */}
          <div className="flex justify-end mb-4 sm:my-4 md:my-7 gap-4 px-5">
            <div className="relative md:w-1/3 flex justify-end">
              <div
                className="w-full sm:w-10/12 md:w-7/12 py-2 px-4 
                   rounded-2xl border-2 border-gray-700 
                   bg-white text-black font-medium shadow-lg 
                   cursor-pointer select-none
                   flex justify-between items-center"
                onClick={() => setOpen(!open)}
              >
                {selectedopt}
                <span className="ml-2">▼</span>
              </div>

              {open && (
                <ul
                  className="absolute top-full mt-2 w-[200px] sm:w-10/12 md:w-7/12 
                     bg-white border border-gray-300 rounded-xl shadow-lg z-10 overflow-x-auto h-[350px]"
                >
                  <li
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-lg "
                    onClick={() => {
                      setSelectedopt("All");
                      setOpen(false);
                    }}
                  >
                    All
                  </li>
                  {options.map((opt) => (
                    <li
                      key={opt.category}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer rounded-lg "
                      onClick={() => {
                        setSelectedopt(opt.category);
                        setPage(1);
                        setOpen(false);
                      }}
                    >
                      {opt.category}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Nút mở modal */}
            <button onClick={() => setShowModal(true)}>
              <SecondaryButton title={"Filter"} editStyle="px-4 py-2" />
            </button>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-xl font-bold mb-4">Product Filters</h3>

                {/* Price Range */}
                <div className="mb-4">
                  <p className="font-semibold mb-2">Price Range</p>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={priceRange.includes("0-100")}
                      onChange={() => togglePriceRange("0-100")}
                    />
                    0 - 100$
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={priceRange.includes("100-500")}
                      onChange={() => togglePriceRange("100-500")}
                    />
                    100 - 500$
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={priceRange.includes("500+")}
                      onChange={() => togglePriceRange("500+")}
                    />
                    500$+
                  </label>
                </div>

                {/* Sort */}
                <div className="mb-4">
                  <p className="font-semibold mb-2">Sort by Price</p>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sort"
                      value="asc"
                      checked={sortOrder === "asc"}
                      onChange={(e) => setSortOrder(e.target.value)}
                    />
                    Ascending
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sort"
                      value="desc"
                      checked={sortOrder === "desc"}
                      onChange={(e) => setSortOrder(e.target.value)}
                    />
                    Descending
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowModal(false)}>
                    <DangerButton title={"Cancel"} editStyle="px-4 py-2" />
                  </button>
                  <button onClick={handleFilter}>
                    <SecondaryButton title={"Ok"} editStyle="px-7 py-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-3 sm:px-7 md:px-10">
              {products.map((item) => (
                <motion.div
                  key={item.id}
                  layoutId={`card-${item.id}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  onClick={() => setSelected(item)}
                  className="bg-white p-4 h-[410px] md:h-[460px] shadow rounded cursor-pointer"
                >
                  <ProductCard product={item} />
                </motion.div>
              ))}
            </div>

            {/* Overlay khi chọn product */}

            <AnimatePresence>
              {selected && (
                <ProductCardDetail
                  product={selected}
                  onClose={() => setSelected(null)}
                  onCartUpdate={(newCount) => setCartCount(newCount)}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="w-[120px] sm:w-[130px] md:w-[150px] h-8 bg-[#333] rounded-full relative left-1/2 -translate-x-1/2 mt-3 sm:mt-5">
            <span className="absolute top-0 left-0 text-3xl text-white">
              <FaArrowLeft />
            </span>
            <DragSwitch onNext={goNext} onPrev={goPrev} value={page} />
            <span className="absolute top-0 right-0 text-3xl text-white">
              <FaArrowRight />
            </span>
          </div>
        </section>

        {/* Why Choose Us */}
        <section
          id="features"
          className="py-16 px-5 sm:px-15 bg-gradient-to-b from-gray-50 to-white  my-5 sm:my-10"
        >
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Why Choose Us?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <FeatureCard key={i} icon={f.icon} title={f.title} />
              ))}
            </div>
          </div>
        </section>

        {/* About Us */}
        <AboutSection />
      </div>

      {/* Footer */}
      <Footer />

      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner />}
      </div>
    </div>
  );
}
