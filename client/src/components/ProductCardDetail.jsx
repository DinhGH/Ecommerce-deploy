/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Tag,
  Package,
  Truck,
  RotateCcw,
  ShieldCheck,
  Ruler,
  Barcode,
  QrCode,
  Layers,
  Calendar,
  ShoppingCart,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Announcement from "./Announcement";
import { ElegantSpinner } from "./ui/Loading";

export default function ProductCardDetail({ product, onClose, onCartUpdate }) {
  const [announcement, setAnnouncement] = useState(0);
  const [loading, setLoading] = useState(false);
  if (!product) return null;

  const [mainImage, setMainImage] = useState(product.thumbnail);
  const navigate = useNavigate();

  // Tính giá sau giảm
  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;

  const fetchQuantity = async () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/cart`, {
        withCredentials: true,
      })
      .then((res) => {
        const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
        onCartUpdate(total);
      })
      .catch((err) => console.error(err));
  };

  const handleAddToCart = async () => {
    setLoading(true);
    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId: product.id },
        { withCredentials: true }
      );

      setAnnouncement(1);
      setTimeout(() => setAnnouncement(0), 4000);
      fetchQuantity();
    } catch (err) {
      if (err.response && err.response.status === 403) {
        navigate("/auth");
      } else {
        setAnnouncement(2);
        setTimeout(() => setAnnouncement(0), 4000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Product detail card */}
      <motion.div
        layoutId={`card-${product.id}`}
        className="fixed top-1/2 left-1/2 w-[95%] md:w-[750px] max-h-[95vh] overflow-y-auto bg-white shadow-2xl rounded-2xl z-50 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        {/* Header with main image */}
        <div className="relative px-15 sm:px-50">
          {mainImage && (
            <motion.img
              src={mainImage}
              alt={product.title}
              className="w-full h-72 sm:h-96 object-cover"
              whileHover={{
                scale: 1.03,
                filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.3))",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-gray-600/70 text-white rounded-full p-2 hover:bg-black transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Carousel images */}
        {product.images && product.images.length > 0 && (
          <div className="flex gap-2 p-3 overflow-x-auto">
            {[...product.images].map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`image-${idx}`}
                onClick={() => setMainImage(img)}
                className={`h-20 w-20 object-cover rounded-md shadow-sm cursor-pointer hover:scale-105 transition ${
                  mainImage === img ? "ring-2 ring-gray-500" : ""
                }`}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-5">
          <h2 className="text-3xl font-bold text-gray-900">{product.title}</h2>

          {/* Category + Brand + Tags */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-700">
            {product.category && (
              <p className="bg-gray-100 px-3 py-1 rounded-md">
                <span className="font-semibold">Category</span>:{" "}
                {product.category}
              </p>
            )}
            {product.brand && (
              <p className="bg-gray-100 px-3 py-1 rounded-md">
                <span className="font-semibold">Brand</span>: {product.brand}
              </p>
            )}
            {product.tags &&
              product.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-md gap-1"
                >
                  <Tag size={14} className="text-gray-500" />
                  {tag}
                </span>
              ))}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={
                    index < Math.round(product.rating) ? "gold" : "lightgray"
                  }
                  viewBox="0 0 24 24"
                  stroke="none"
                  className="w-4 h-4"
                >
                  <path d="M12 .587l3.668 7.568L24 9.75l-6 5.858 1.416 8.392L12 19.771l-7.416 4.229L6 15.608 0 9.75l8.332-1.595z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 ml-2">
                {product.rating.toFixed(1)}/5
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-green-600">
              ${discountedPrice}
            </span>
            {product.discountPercentage && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            )}
            {product.discountPercentage && (
              <span className="text-xs bg-[#aeaeae] text-white px-2 py-1 rounded-md">
                -{product.discountPercentage}%
              </span>
            )}
          </div>

          {/* Stock + Status */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <p className="flex items-center gap-1">
              <Package size={16} /> Stock: {product.stock}
            </p>
            {product.availabilityStatus && (
              <p
                className={`${
                  product.availabilityStatus === "In Stock"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {product.availabilityStatus}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Technical Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            {product.sku && (
              <p className="flex items-center gap-2">
                <Layers size={16} /> SKU: {product.sku}
              </p>
            )}
            {product.weight && (
              <p className="flex items-center gap-2">
                <Package size={16} /> Weight: {product.weight}
              </p>
            )}
            {product.width && product.height && product.depth && (
              <p className="flex items-center gap-2">
                <Ruler size={16} /> {product.width} x {product.height} x{" "}
                {product.depth} cm
              </p>
            )}
            {product.barcode && (
              <p className="flex items-center gap-2">
                <Barcode size={16} /> {product.barcode}
              </p>
            )}
            {product.qrCode && (
              <p className="flex items-center gap-2">
                <QrCode size={16} /> {product.qrCode}
              </p>
            )}
          </div>

          {/* Policies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
            {product.warrantyInformation && (
              <p className="flex items-center gap-2">
                <ShieldCheck size={16} /> {product.warrantyInformation}
              </p>
            )}
            {product.shippingInformation && (
              <p className="flex items-center gap-2">
                <Truck size={16} /> {product.shippingInformation}
              </p>
            )}
            {product.returnPolicy && (
              <p className="flex items-center gap-2">
                <RotateCcw size={16} /> {product.returnPolicy}
              </p>
            )}
            {product.minimumOrderQuantity && (
              <p className="flex items-center gap-2">
                Min Order: {product.minimumOrderQuantity}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 text-xs text-gray-500">
            <p className="flex items-center gap-1">
              <Calendar size={14} /> Created:{" "}
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
            <p className="flex items-center gap-1">
              <Calendar size={14} /> Updated:{" "}
              {new Date(product.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md shadow transition"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>
          </div>
        </div>
      </motion.div>

      {announcement === 1 && <Announcement message="Product added to cart!" />}
      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner message="Adding..." />}
      </div>
      {announcement === 2 && (
        <Announcement type="error" message="Failed to add to cart!" />
      )}
    </>
  );
}
