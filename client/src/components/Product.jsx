/* eslint-disable react-hooks/exhaustive-deps */
// src/admin/component/Product.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { ElegantSpinner } from "./ui/Loading";
import Announcement from "./Announcement";
import Confirm from "./Comfirm";

export default function Product() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // form state
  const [simple, setSimple] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discountPercentage: "",
    rating: "",
    stock: "",
    brand: "",
    sku: "",
    weight: "",
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "In Stock",
    returnPolicy: "",
    minimumOrderQuantity: "",
    thumbnailUrlText: "",
    tagsText: "",
    width: "",
    height: "",
    depth: "",
    barcode: "",
    qrCode: "",
  });

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [barcodeFile, setBarcodeFile] = useState(null);
  const [qrCodeFile, setQrCodeFile] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/products?page=${page}&limit=10`
      );
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSimple({
      title: "",
      description: "",
      category: "",
      price: "",
      discountPercentage: "",
      rating: "",
      stock: "",
      brand: "",
      sku: "",
      weight: "",
      warrantyInformation: "",
      shippingInformation: "",
      availabilityStatus: "In Stock",
      returnPolicy: "",
      minimumOrderQuantity: "",
      thumbnailUrlText: "",
      tagsText: "",
      width: "",
      height: "",
      depth: "",
      barcode: "",
      qrCode: "",
    });
    setThumbnailFile(null);
    setImageFiles([]);
    setBarcodeFile(null);
    setQrCodeFile(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const {
        title,
        description,
        category,
        price,
        discountPercentage,
        rating,
        stock,
        brand,
        sku,
        weight,
        warrantyInformation,
        shippingInformation,
        availabilityStatus,
        returnPolicy,
        minimumOrderQuantity,
        thumbnailUrlText,
        tagsText,
        width,
        height,
        depth,
        barcode,
        qrCode,
      } = simple;

      // === 1. REQUIRED FIELDS ===
      if (
        !title ||
        !category ||
        !price ||
        !description ||
        !stock ||
        !brand ||
        !availabilityStatus
      ) {
        setAnnouncement({
          type: "error",
          message:
            "Please fill in all required fields (title, category, price, stock, brand, availability, description)!",
        });
        setLoading(false);
        return;
      }

      // === 2. STRING LENGTH VALIDATION ===
      if (title.trim().length > 150) {
        setAnnouncement({
          type: "error",
          message: "Product title must not exceed 150 characters!",
        });
        setLoading(false);
        return;
      }

      if (brand.trim().length > 50) {
        setAnnouncement({
          type: "error",
          message: "Brand name must not exceed 50 characters!",
        });
        setLoading(false);
        return;
      }

      if (sku && sku.length > 30) {
        setAnnouncement({
          type: "error",
          message: "SKU must not exceed 30 characters!",
        });
        setLoading(false);
        return;
      }

      if (description.trim().length > 500) {
        setAnnouncement({
          type: "error",
          message: "Description must not exceed 500 characters!",
        });
        setLoading(false);
        return;
      }

      if (warrantyInformation && warrantyInformation.length > 100) {
        setAnnouncement({
          type: "error",
          message: "Warranty information must not exceed 100 characters!",
        });
        setLoading(false);
        return;
      }

      if (shippingInformation && shippingInformation.length > 100) {
        setAnnouncement({
          type: "error",
          message: "Shipping information must not exceed 100 characters!",
        });
        setLoading(false);
        return;
      }

      if (returnPolicy && returnPolicy.length > 100) {
        setAnnouncement({
          type: "error",
          message: "Return policy must not exceed 100 characters!",
        });
        setLoading(false);
        return;
      }

      // === 3. NUMERIC VALIDATION ===
      const numFields = {
        price,
        discountPercentage,
        rating,
        stock,
        weight,
        width,
        height,
        depth,
        minimumOrderQuantity,
      };
      for (const [key, val] of Object.entries(numFields)) {
        if (val && isNaN(val)) {
          setAnnouncement({
            type: "error",
            message: `${key} must be a number!`,
          });
          setLoading(false);
          return;
        }
      }

      if (price <= 0) {
        setAnnouncement({
          type: "error",
          message: "Price must be greater than 0!",
        });
        setLoading(false);
        return;
      }

      if (
        discountPercentage &&
        (discountPercentage < 0 || discountPercentage > 100)
      ) {
        setAnnouncement({
          type: "error",
          message: "Discount must be between 0 and 100!",
        });
        setLoading(false);
        return;
      }

      if (rating && (rating < 0 || rating > 5)) {
        setAnnouncement({
          type: "error",
          message: "Rating must be between 0 and 5!",
        });
        setLoading(false);
        return;
      }

      if (stock < 0) {
        setAnnouncement({
          type: "error",
          message: "Stock cannot be negative!",
        });
        setLoading(false);
        return;
      }

      if (minimumOrderQuantity && minimumOrderQuantity < 1) {
        setAnnouncement({
          type: "error",
          message: "Minimum order quantity must be at least 1!",
        });
        setLoading(false);
        return;
      }

      // === 4. FILE VALIDATION ===
      if (!editing && !thumbnailFile && !thumbnailUrlText) {
        setAnnouncement({
          type: "error",
          message: "Please upload a thumbnail image for the product!",
        });
        setLoading(false);
        return;
      }

      if (
        thumbnailFile &&
        !["image/jpeg", "image/png", "image/webp"].includes(thumbnailFile.type)
      ) {
        setAnnouncement({
          type: "error",
          message: "Thumbnail must be JPG, PNG, or WEBP format!",
        });
        setLoading(false);
        return;
      }

      if (imageFiles?.length > 0) {
        for (const file of imageFiles) {
          if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
            setAnnouncement({
              type: "error",
              message: `Invalid image format: ${file.name}. Only JPG, PNG, or WEBP allowed.`,
            });
            setLoading(false);
            return;
          }
          if (file.size > 2 * 1024 * 1024) {
            setAnnouncement({
              type: "error",
              message: `${file.name} is too large (max 2MB).`,
            });
            setLoading(false);
            return;
          }
        }
      }

      // === 5. BARCODE + QRCODE ===
      if (!barcodeFile && !barcode) {
        setAnnouncement({
          type: "error",
          message: "Please upload or provide a barcode!",
        });
        setLoading(false);
        return;
      }

      if (!qrCodeFile && !qrCode) {
        setAnnouncement({
          type: "error",
          message: "Please upload or provide a QR code!",
        });
        setLoading(false);
        return;
      }

      // === 6. TAGS ===
      if (tagsText) {
        const tags = tagsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (tags.length > 10) {
          setAnnouncement({
            type: "error",
            message: "You can only add up to 10 tags!",
          });
          setLoading(false);
          return;
        }
        for (const tag of tags) {
          if (tag.length > 20) {
            setAnnouncement({
              type: "error",
              message: `Tag '${tag}' is too long (max 20 characters).`,
            });
            setLoading(false);
            return;
          }
        }
      }

      const fd = new FormData();

      // Thêm tất cả các trường text
      Object.entries(simple).forEach(([k, v]) => {
        if (k !== "tagsText" && k !== "thumbnailUrlText" && k !== "images") {
          fd.append(k, v);
        }
      });

      // QUAN TRỌNG: Xử lý thumbnail - chỉ gửi 1 giá trị string
      if (thumbnailFile) {
        fd.append("thumbnail", thumbnailFile);
      } else if (simple.thumbnailUrlText) {
        // Đảm bảo chỉ gửi string, không phải array
        fd.append("thumbnail", simple.thumbnailUrlText);
      } else {
        fd.append("thumbnail", "");
      }

      // Xử lý images - gửi nhiều file
      // Ảnh cũ còn giữ lại
      fd.append("existingImages", JSON.stringify(imageUrls || []));

      // Ảnh mới upload
      if (imageFiles?.length > 0) {
        imageFiles.forEach((file) => {
          fd.append("newImages", file);
        });
      }

      // Xử lý barcode
      if (barcodeFile) {
        fd.append("barcode", barcodeFile);
      } else if (simple.barcode) {
        fd.append("barcode", simple.barcode);
      }

      // Xử lý qrCode
      if (qrCodeFile) {
        fd.append("qrCode", qrCodeFile);
      } else if (simple.qrCode) {
        fd.append("qrCode", simple.qrCode);
      }

      // Tags
      // Nếu người dùng không nhập gì => vẫn append [] thay vì chuỗi rỗng
      const tags =
        simple.tagsText && simple.tagsText.trim()
          ? simple.tagsText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      fd.delete("tags");
      fd.append("tags", JSON.stringify(tags.length ? tags : [])); // luôn gửi []

      const url = editing
        ? `${import.meta.env.VITE_API_URL}/api/admin/products/${editing}`
        : `${import.meta.env.VITE_API_URL}/api/admin/products`;

      const method = editing ? "put" : "post";

      await axios[method](url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (editing) {
        setAnnouncement({ message: "Update product successfully!" });
      } else {
        setAnnouncement({ message: "Add product successfully!" });
      }
      fetchProducts();
      setShowForm(false);
      setEditing(null);
      resetForm();
    } catch (error) {
      if (error.response && error.response.data) {
        setAnnouncement({
          type: "error",
          message: error.response.data.message,
        });
      } else {
        setAnnouncement({
          type: "error",
          message: "Add/Update product failed!",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/products/${selectedId}`
      );
      setAnnouncement({ message: "Delete product successfully" });
      setTimeout(() => {
        fetchProducts();
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
      setLoading(false);
    }
  };

  const onCancel = () => {
    setSelectedId(null);
    setShowConfirm(false);
  };

  return (
    <div
      className="
        w-full
      "
    >
      <h2
        className="
          mb-6
          text-2xl font-bold text-gray-300
        "
      >
        Manage Products
      </h2>

      {!showForm && (
        <>
          <button
            onClick={() => {
              setShowForm(true);
              resetForm();
            }}
            className="
              flex
              px-4 py-2 mb-4
              text-white
              bg-blue-600
              rounded-lg
              items-center gap-2 hover:bg-blue-500
            "
          >
            <PlusCircleIcon
              className="
                w-5 h-5
              "
            />{" "}
            Create New
          </button>

          <div
            className="
              overflow-x-auto overflow-y-auto
              w-full max-h-[420px]
              rounded-lg border-2 border-gray-400
            "
          >
            <table
              className="
                overflow-x-scroll
                min-w-max
                border-gray-400 border-2 rounded-lg
              "
            >
              <thead
                className="
                  text-white text-sm
                  bg-[#55575d]
                "
              >
                <tr>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Id
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Title
                  </th>
                  <th
                    className="
                      w-130
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Description
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Category
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Price
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Discount %
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Rating
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Stock
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Tags
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Brand
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Sku
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Weight
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    WarrantyInformation
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    ShippingInformation
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    AvailabilityStatus
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    ReturnPolicy
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    MinimumOrderQuantity
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Width
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Height
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Depth
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Thumbnail
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Images
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    BarCode
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    QRCode
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    CreatAt
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    UpdateAt
                  </th>
                  <th
                    className="
                      px-4 py-2
                      border-2 border-gray-400
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className="
                  text-sm
                  divide-y divide-gray-200
                "
              >
                {products.length ? (
                  products.map((p) => (
                    <tr
                      key={p.id}
                      className="
                        h-18
                        hover:bg-[#050b19]
                      "
                    >
                      <td
                        className="
                          w-fit
                          px-4 py-2
                        "
                      >
                        {p.id}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.title}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.description}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.category}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        ${p.price}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.discountPercentage}%
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.rating}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.stock}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        [{p.tags?.join(", ")}]
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.brand}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.sku}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.weight}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.warrantyInformation}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.shippingInformation}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.availabilityStatus}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.returnPolicy}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.minimumOrderQuantity}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.width}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.height}
                      </td>
                      <td
                        className="
                          px-4 py-2
                        "
                      >
                        {p.depth}
                      </td>
                      <td
                        className="
                          px-4
                        "
                      >
                        {p.thumbnail && (
                          <img
                            src={p.thumbnail}
                            alt="thumb"
                            onClick={() => setPreviewImg(p.thumbnail)}
                            className="
                              object-cover
                              w-12 h-12
                              rounded
                            "
                          />
                        )}
                      </td>
                      <td
                        className="
                          px-4
                        "
                      >
                        <div
                          className="
                            flex overflow-x-auto
                            max-w-[150px]
                            gap-2
                          "
                        >
                          {Array.isArray(p.images) &&
                            p.images.map((item, idx) => (
                              <img
                                key={`${p.id}-${idx}`}
                                src={item}
                                onClick={() => setPreviewImg(item)}
                                alt="thumb"
                                className="
                                  object-cover flex-shrink-0
                                  w-11 h-11
                                  border
                                  rounded
                                "
                              />
                            ))}
                        </div>
                      </td>
                      <td
                        className="
                          px-4
                        "
                      >
                        {p.barcode && (
                          <img
                            src={p.barcode}
                            alt="barcode"
                            onClick={() => setPreviewImg(p.barcode)}
                            className="
                              object-cover
                              w-12 h-12
                              rounded
                            "
                          />
                        )}
                      </td>
                      <td
                        className="
                          px-4
                        "
                      >
                        {p.qrCode && (
                          <img
                            src={p.qrCode}
                            alt="qrCode"
                            onClick={() => setPreviewImg(p.qrCode)}
                            className="
                              object-cover
                              w-12 h-12
                              rounded
                            "
                          />
                        )}
                      </td>
                      <td
                        className="
                          px-3 py-2
                        "
                      >
                        {new Date(p.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td
                        className="
                          px-3 py-2
                        "
                      >
                        {new Date(p.updatedAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>

                      <td
                        className="
                          flex
                          px-4 py-2
                          gap-2
                        "
                      >
                        <button
                          onClick={() => {
                            setEditing(p.id);
                            setSimple({
                              ...p,
                              tagsText: p.tags?.join(", ") || "",
                              thumbnailUrlText: p.thumbnail || "",
                              width: p.width || "",
                              height: p.height || "",
                              depth: p.depth || "",
                              barcode: p.barcode || "",
                              qrCode: p.qrCode || "",
                            });

                            setImageUrls(p.images || []);
                            setImageFiles([]);
                            setThumbnailFile(null);
                            setBarcodeFile(null);
                            setQrCodeFile(null);
                            setShowForm(true);
                          }}
                          className="
                            text-blue-600
                            hover:text-blue-400 hover:cursor-pointer
                          "
                        >
                          <PencilSquareIcon
                            className="
                              w-7 h-7
                              m-3 mr-1
                            "
                          />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(p.id)}
                          className="
                           text-gray-700 hover:text-gray-500 hover:cursor-pointer
                          "
                        >
                          <TrashIcon
                            className="
                              w-7 h-7
                              m-3 ml-1
                            "
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key="empty">
                    <td
                      colSpan="8"
                      className="
                        px-4 py-6
                        text-center
                      "
                    >
                      Chưa có sản phẩm
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div
            className="
              flex
              py-2
              justify-end
            "
          >
            <div
              className="

              "
            >
              {page} of {totalPages}
            </div>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              <FaAngleLeft
                className="
                  ml-2
                  text-2xl
                "
              />
            </button>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <FaAngleRight
                className="
                  mr-2
                  text-2xl
                "
              />
            </button>
          </div>
        </>
      )}

      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          className="
            flex z-50
            bg-black bg-opacity-70
            fixed inset-0 items-center justify-center
          "
        >
          <img
            src={previewImg}
            alt="preview"
            className="
              max-w-[90%] max-h-[90%]
              shadow-lg
              rounded
            "
          />
        </div>
      )}

      {showForm && (
        <div
          className="
            overflow-y-auto
            w-full h-[470px]
            p-6
            bg-[#101021]
            rounded-lg
            shadow-md
          "
        >
          <div
            className="
              flex
              mb-4
              justify-between items-center
            "
          >
            <h3
              className="
                text-lg font-semibold
              "
            >
              {editing ? "Edit product" : "Create new product"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
              className="
                text-gray-500
                hover:text-gray-100
              "
            >
              <XMarkIcon
                className="
                  w-6 h-6
                "
              />
            </button>
          </div>

          <form
            onSubmit={onSubmit}
            className="
              space-y-3
            "
          >
            <input
              placeholder="Title"
              value={simple.title}
              onChange={(e) => setSimple({ ...simple, title: e.target.value })}
              className="
                w-full
                px-3 py-2
                border
                rounded
              "
            />
            <textarea
              placeholder="Description"
              value={simple.description}
              onChange={(e) =>
                setSimple({ ...simple, description: e.target.value })
              }
              className="
                w-full
                px-3 py-2
                border
                rounded
              "
            />
            <div
              className="
                grid grid-cols-4
                gap-3
              "
            >
              <input
                placeholder="Category"
                value={simple.category}
                onChange={(e) =>
                  setSimple({ ...simple, category: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />
              <input
                type="number"
                placeholder="Price"
                value={simple.price}
                onChange={(e) =>
                  setSimple({ ...simple, price: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />
              <input
                type="number"
                placeholder="Discount-%"
                value={simple.discountPercentage}
                onChange={(e) =>
                  setSimple({
                    ...simple,
                    discountPercentage: e.target.value,
                  })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating"
                value={simple.rating}
                onChange={(e) =>
                  setSimple({ ...simple, rating: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />
              <input
                type="number"
                placeholder="Stock"
                value={simple.stock}
                onChange={(e) =>
                  setSimple({ ...simple, stock: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />
              <input
                placeholder="Tags (comma separated)"
                value={simple.tagsText}
                onChange={(e) =>
                  setSimple({ ...simple, tagsText: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />

              <input
                placeholder="Brand"
                value={simple.brand}
                onChange={(e) =>
                  setSimple({ ...simple, brand: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />

              <input
                placeholder="Sku"
                value={simple.sku}
                onChange={(e) => setSimple({ ...simple, sku: e.target.value })}
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />

              <input
                placeholder="Weight"
                value={simple.weight}
                onChange={(e) =>
                  setSimple({ ...simple, weight: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />

              <input
                placeholder="Width"
                type="number"
                value={simple.width}
                onChange={(e) =>
                  setSimple({ ...simple, width: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />

              <input
                placeholder="Height"
                type="number"
                value={simple.height}
                onChange={(e) =>
                  setSimple({ ...simple, height: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />

              <input
                placeholder="Depth"
                type="number"
                value={simple.depth}
                onChange={(e) =>
                  setSimple({ ...simple, depth: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />

              <input
                placeholder="Warranty Information"
                value={simple.warrantyInformation}
                onChange={(e) =>
                  setSimple({ ...simple, warrantyInformation: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />

              <input
                placeholder="Shipping Information"
                value={simple.shippingInformation}
                onChange={(e) =>
                  setSimple({ ...simple, shippingInformation: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />

              <input
                placeholder="Availability Status"
                value={simple.availabilityStatus}
                onChange={(e) =>
                  setSimple({ ...simple, availabilityStatus: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />
              <input
                placeholder="Return Policy"
                value={simple.returnPolicy}
                onChange={(e) =>
                  setSimple({ ...simple, returnPolicy: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />
              <input
                placeholder="Minimum Order Quantity"
                value={simple.minimumOrderQuantity}
                type="number"
                onChange={(e) =>
                  setSimple({ ...simple, minimumOrderQuantity: e.target.value })
                }
                className="
                  px-3 py-2
                  border
                  rounded
                "
              />
            </div>

            <div
              className="
                grid grid-cols-2
                gap-3
              "
            ></div>

            <div
              className="
                space-y-4
              "
            >
              {/* Thumbnail file */}
              <div>
                <label
                  className="
                    block
                    mb-1
                    text-sm font-medium text-gray-700
                  "
                >
                  Thumbnail file
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0] || null)}
                  className="
                    w-full
                    px-2 py-1
                    text-sm
                    rounded-lg border border-gray-300
                    cursor-pointer
                    file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700
                  "
                />
                {(thumbnailFile || simple.thumbnailUrlText) && (
                  <img
                    src={
                      thumbnailFile
                        ? URL.createObjectURL(thumbnailFile)
                        : simple.thumbnailUrlText
                    }
                    alt="thumbnail preview"
                    className="
                      object-cover
                      w-24 h-24
                      mt-2
                      border
                      rounded
                    "
                  />
                )}
              </div>

              {/* Images file */}
              <div>
                <label
                  className="
                    block
                    mb-1
                    text-sm font-medium text-gray-700
                  "
                >
                  Images file
                </label>
                <input
                  multiple
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImageFiles(Array.from(e.target.files) || [])
                  }
                  className="
                    w-full
                    px-2 py-1
                    text-sm
                    rounded-lg border border-gray-300
                    cursor-pointer
                    file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700
                  "
                />

                {/* Preview ảnh cũ từ DB */}
                {imageUrls?.length > 0 && (
                  <div
                    className="
                      flex flex-wrap
                      mt-2
                      gap-2
                    "
                  >
                    {imageUrls.map((url, idx) => (
                      <div
                        key={`db-${idx}`}
                        className="
                          relative
                        "
                      >
                        <img
                          src={url}
                          alt={`db-preview-${idx}`}
                          className="
                            object-cover
                            w-24 h-24
                            border
                            rounded
                          "
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImageUrls((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          title="Xóa ảnh cũ này"
                          className="
                            px-2 py-1
                            text-xs text-white
                            bg-red-600
                            rounded-full
                            absolute -top-2 -right-2 hover:bg-red-500
                          "
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview ảnh mới upload */}
                {imageFiles?.length > 0 && (
                  <div
                    className="
                      flex flex-wrap
                      mt-2
                      gap-2
                    "
                  >
                    {imageFiles.map((file, idx) => (
                      <div
                        key={`file-${idx}`}
                        className="
                          relative
                        "
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`new-preview-${idx}`}
                          className="
                            object-cover
                            w-24 h-24
                            border
                            rounded
                          "
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setImageFiles((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          title="Xóa ảnh mới này"
                          className="
                            px-2 py-1
                            text-white
                            bg-red-600
                            rounded-full
                            tex absolute -top-2 -right-2 hover:bg-red-500
                          "
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div
              className="
                flex grid-cols-2
                gap-2
              "
            >
              {/* Thumbnail */}

              {/* Barcode */}
              <div>
                <label
                  className="
                    block
                    mb-1
                    text-sm font-medium text-gray-700
                  "
                >
                  Barcode file
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBarcodeFile(e.target.files[0] || null)}
                  className="
                    w-full
                    px-2 py-1
                    text-sm
                    rounded-lg border border-gray-300
                    cursor-pointer
                    file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700
                  "
                />
                {(barcodeFile || simple.barcode) && (
                  <img
                    src={
                      barcodeFile
                        ? URL.createObjectURL(barcodeFile)
                        : simple.barcode
                    }
                    alt="barcode preview"
                    className="
                      object-contain
                      w-24 h-24
                      mt-2
                      border
                      rounded
                    "
                  />
                )}
              </div>

              {/* QR Code */}
              <div>
                <label
                  className="
                    block
                    mb-1
                    text-sm font-medium text-gray-700
                  "
                >
                  QR Code file
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setQrCodeFile(e.target.files[0] || null)}
                  className="
                    w-full
                    px-2 py-1
                    text-sm
                    rounded-lg border border-gray-300
                    cursor-pointer
                    file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700
                  "
                />
                {(qrCodeFile || simple.qrCode) && (
                  <img
                    src={
                      qrCodeFile
                        ? URL.createObjectURL(qrCodeFile)
                        : simple.qrCode
                    }
                    alt="qrCode preview"
                    className="
                      object-contain
                      w-24 h-24
                      mt-2
                      border
                      rounded
                    "
                  />
                )}
              </div>
            </div>

            <div
              className="
                flex
                gap-3
              "
            >
              <button
                type="submit"
                className="
                  px-4 py-2
                  text-white
                  bg-blue-600
                  rounded-lg
                  hover:bg-blue-500
                "
              >
                {editing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="
                  px-4 py-2
                  bg-gray-500
                  rounded-lg
                  hover:bg-gray-600
                "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner />}
      </div>

      {showConfirm && (
        <Confirm
          message="Are you sure to delete this product?"
          onConfirm={onConfirmDelete}
          onCancel={onCancel}
        />
      )}

      {/* Announcement */}
      {announcement && (
        <Announcement
          type={announcement.type}
          message={announcement.message}
          onClose={() => setAnnouncement(null)}
        />
      )}
    </div>
  );
}
