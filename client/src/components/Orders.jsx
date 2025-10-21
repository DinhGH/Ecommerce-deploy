/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import Confirm from "./Comfirm";
import Announcement from "./Announcement";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { ElegantSpinner } from "./ui/Loading";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form modal
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [form, setForm] = useState({
    userId: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    address: "",
    altRecipientName: "",
    altRecipientPhone: "",
    deliveryTime: "",
    total: 0,
    status: "PENDING",
    items: [{ title: "", quantity: 0, price: 0, productId: null }],
    proofImage: "",
  });

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/admin/orders?page=${page}&limit=10`
      );
      setOrders(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Error fetchOrders:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      userId: "",
      recipientName: "",
      recipientPhone: "",
      recipientEmail: "",
      address: "",
      altRecipientName: "",
      altRecipientPhone: "",
      deliveryTime: "",
      total: 0,
      status: "PENDING",
      items: [],
      proofImage: "",
    });
    setProofFile(null);
    setEditing(null);
  };

  // ---------- CRUD ----------
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const onConfirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `http://localhost:5000/api/admin/orders/${selectedId}`
      );
      setAnnouncement({
        type: "success",
        message: "Order deleted successfully!",
      });
      fetchOrders();
    } catch (err) {
      setAnnouncement({ type: "error", message: "Failed to delete order." });
      console.log(err);
    } finally {
      setShowConfirm(false);
      setLoading(false);
      setSelectedId(null);
    }
  };

  const onCancelDelete = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status: newStatus }
      );
      setAnnouncement({ type: "success", message: "Order status updated!" });
      fetchOrders();
    } catch (err) {
      console.log(err);
      setAnnouncement({ type: "error", message: "Failed to update status." });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const Fields = [
        { key: "userId", label: "User ID" },
        { key: "recipientName", label: "Recipient Name" },
        { key: "recipientPhone", label: "Recipient Phone" },
        { key: "recipientEmail", label: "Recipient Email" },
        { key: "address", label: "Address" },
        { key: "deliveryTime", label: "Delivery Time" },
        { key: "total", label: "Total Amount" },
      ];

      for (const field of Fields) {
        if (!form[field.key] || String(form[field.key]).trim() === "") {
          setAnnouncement({
            type: "error",
            message: `Please fill in the  field: ${field.label}!`,
          });
          setLoading(false);
          return;
        }
      }

      // 🧩 2️⃣ Validate độ dài chuỗi
      if (form.recipientName.length > 50) {
        setAnnouncement({
          type: "error",
          message: "Recipient name must not exceed 50 characters!",
        });
        setLoading(false);
        return;
      }

      if (form.address.length > 200) {
        setAnnouncement({
          type: "error",
          message: "Address must not exceed 200 characters!",
        });
        setLoading(false);
        return;
      }

      if (form.altRecipientName && form.altRecipientName.length > 50) {
        setAnnouncement({
          type: "error",
          message: "Alternative recipient name must not exceed 50 characters!",
        });
        setLoading(false);
        return;
      }

      // 🧩 3️⃣ Validate số điện thoại
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(form.recipientPhone)) {
        setAnnouncement({
          type: "error",
          message: "Recipient phone must contain only 10 digits!",
        });
        setLoading(false);
        return;
      }
      if (form.altRecipientPhone && !phoneRegex.test(form.altRecipientPhone)) {
        setAnnouncement({
          type: "error",
          message: "Alternative recipient phone must contain only 10 digits!",
        });
        setLoading(false);
        return;
      }

      // 🧩 4️⃣ Validate email
      if (!form.recipientEmail.includes("@")) {
        setAnnouncement({
          type: "error",
          message: "Invalid recipient email format!",
        });
        setLoading(false);
        return;
      }

      // 🧩 5️⃣ Validate ngày giờ giao hàng
      const deliveryDate = new Date(form.deliveryTime);
      const now = new Date();
      const minDateTime = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      if (deliveryDate < minDateTime) {
        setAnnouncement({
          type: "error",
          message: "Delivery date must be at least 48 hours from now!",
        });
        setLoading(false);
        return;
      }

      // 🧩 6️⃣ Validate total tiền
      if (isNaN(form.total) || Number(form.total) <= 0) {
        setAnnouncement({
          type: "error",
          message: "Total must be a positive number!",
        });
        setLoading(false);
        return;
      }

      // 🧩 7️⃣ Validate items
      if (!form.items || form.items.length === 0) {
        setAnnouncement({
          type: "error",
          message: "Please add at least one item to the order!",
        });
        setLoading(false);
        return;
      }

      for (const [index, item] of form.items.entries()) {
        if (!item.productId) {
          setAnnouncement({
            type: "error",
            message: `Item #${index + 1}: Missing product ID!`,
          });
          setLoading(false);
          return;
        }
        if (isNaN(item.quantity) || item.quantity <= 0) {
          setAnnouncement({
            type: "error",
            message: `Item #${index + 1}: Quantity must be a positive number!`,
          });
          setLoading(false);
          return;
        }
        if (isNaN(item.price) || item.price < 0) {
          setAnnouncement({
            type: "error",
            message: `Item #${index + 1}: Price must be a non-negative number!`,
          });
          setLoading(false);
          return;
        }
      }

      // 🧩 8️⃣ Validate ảnh thanh toán (chứng từ)
      if (!editing && !proofFile && !form.proofImage) {
        setAnnouncement({
          type: "error",
          message: "Please upload a proof of payment image!",
        });
        setLoading(false);
        return;
      }

      if (
        proofFile &&
        !["image/jpeg", "image/png", "image/webp"].includes(proofFile.type)
      ) {
        setAnnouncement({
          type: "error",
          message: "Proof image must be JPG, PNG, or WEBP format!",
        });
        setLoading(false);
        return;
      }

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "items" && k !== "proofImage") fd.append(k, v);
      });
      if (proofFile) {
        fd.append("proofImage", proofFile);
      } else if (form.proofImage) {
        fd.append("proofImage", form.proofImage);
      }
      if (form.items.length) fd.append("items", JSON.stringify(form.items));

      const url = editing
        ? `http://localhost:5000/api/admin/orders/${editing}`
        : "http://localhost:5000/api/admin/orders";
      const method = editing ? "put" : "post";

      await axios[method](url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnnouncement({
        type: "success",
        message: editing ? "Order updated!" : "Order created!",
      });
      fetchOrders();
      setShowForm(false);
      resetForm();
    } catch (err) {
      setAnnouncement({ type: "error", message: "Failed to save order." });
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Thêm/xóa item
  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: "", quantity: 1, price: 0 }],
    }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    const newTotal = form.items.reduce((sum, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + qty * price;
    }, 0);

    setForm((prev) => ({ ...prev, total: newTotal }));
  }, [form.items]);

  return (
    <div className="w-full">
      <h2 className="mb-6 text-2xl font-bold text-gray-300">Manage Orders</h2>

      {!showForm && (
        <>
          <button
            onClick={() => {
              setShowForm(true);
              resetForm();
            }}
            className="flex px-4 py-2 mb-4 text-white bg-blue-600 rounded-lg items-center gap-2 hover:bg-blue-500"
          >
            <PlusCircleIcon className="w-5 h-5" /> Create New
          </button>

          {/* Table */}
          <div className="overflow-x-auto w-full max-h-[420px] rounded-lg border-2 border-gray-400">
            <table className="min-w-[1400px] border-gray-400 border-2 rounded-lg">
              <thead className="text-white text-sm bg-[#55575d]">
                <tr>
                  <th className="min-w-[50px]">ID</th>
                  <th className="min-w-[70px]">User</th>
                  <th className="min-w-[200px]">Email</th>
                  <th className="min-w-[100px]">Phone</th>
                  <th className="min-w-[200px]">Address</th>
                  <th className="min-w-[70px]">Alt Name</th>
                  <th className="min-w-[100px]">Alt Phone</th>
                  <th className="min-w-[70px]">Total</th>
                  <th className="min-w-[200px]">Status</th>
                  <th className="min-w-[100px]">Delivery Time</th>
                  <th className="min-w-[100px]">Proof</th>
                  <th className="min-w-[100px]">Created At</th>
                  <th className="min-w-[100px]">Updated At</th>
                  <th className="min-w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {orders.length ? (
                  orders.map((o) => (
                    <tr
                      key={o.id}
                      className="h-18 hover:bg-[#050b19] text-center"
                    >
                      <td>{o.id}</td>
                      <td>{o.recipientName}</td>
                      <td className="text-left">{o.recipientEmail || "-"}</td>
                      <td>{o.recipientPhone}</td>
                      <td className="text-left">{o.address}</td>
                      <td>{o.altRecipientName || "-"}</td>
                      <td>{o.altRecipientPhone || "-"}</td>
                      <td>${o.total.toFixed(2)}</td>
                      <td>
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleStatusChange(o.id, e.target.value)
                          }
                          className="border rounded px-2 py-1 bg-[#101021] text-white"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PAID">PAID</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td>{o.deliveryTime || "-"}</td>
                      <td>
                        {o.proofImage ? (
                          <img
                            src={o.proofImage}
                            alt="proof"
                            className="w-16 h-16 object-cover mx-auto cursor-pointer"
                            onClick={() => setPreviewImg(o.proofImage)}
                          />
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{new Date(o.createdAt).toLocaleString()}</td>
                      <td>{new Date(o.updatedAt).toLocaleString()}</td>
                      <td className="flex justify-center relative top-1/2 translate-y-1/2 gap-2">
                        <button
                          onClick={() => {
                            setEditing(o.id);
                            setShowForm(true);
                            setForm({
                              userId: o.userId,
                              recipientName: o.recipientName,
                              recipientPhone: o.recipientPhone,
                              recipientEmail: o.recipientEmail || "",
                              address: o.address,
                              altRecipientName: o.altRecipientName || "",
                              altRecipientPhone: o.altRecipientPhone || "",
                              deliveryTime: o.deliveryTime || "",
                              total: o.total,
                              status: o.status,
                              items: (o.items || []).map((i) => ({
                                productId: i.productId,
                                quantity: i.quantity,
                                price: i.price,
                                title: i.product?.title || "",
                              })),
                              proofImage: o.proofImage || "",
                            });
                          }}
                        >
                          <PencilSquareIcon className="w-7 h-7 text-blue-500" />
                        </button>
                        <button onClick={() => handleDeleteClick(o.id)}>
                          <TrashIcon className="w-7 h-7 text-gray-700 hover:text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="14" className="text-center py-4">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex py-2 justify-end items-center gap-2">
            <div>
              {page} of {totalPages}
            </div>
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>
              <FaAngleLeft className="ml-2 text-2xl" />
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              <FaAngleRight className="mr-2 text-2xl" />
            </button>
          </div>
        </>
      )}

      {/* Form Modal */}
      {showForm && (
        <div
          className="overflow-y-auto
            w-full h-[470px]
            p-6
            bg-[#101021]
            rounded-lg
            shadow-md"
        >
          <form onSubmit={handleFormSubmit} className=" space-y-3">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Order" : "Create Order"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                className="w-full border rounded px-2 py-1"
                type="number"
                placeholder="User ID"
                value={form.userId}
                onChange={(e) => setForm({ ...form, userId: e.target.value })}
              />
              <input
                className="w-full border rounded px-2 py-1"
                type="text"
                placeholder="Recipient Name"
                value={form.recipientName}
                onChange={(e) =>
                  setForm({ ...form, recipientName: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-2 py-1"
                type="text"
                placeholder="Recipient Phone"
                value={form.recipientPhone}
                onChange={(e) =>
                  setForm({ ...form, recipientPhone: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-2 py-1"
                type="text"
                placeholder="Recipient Email"
                value={form.recipientEmail}
                onChange={(e) =>
                  setForm({ ...form, recipientEmail: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-2 py-1"
                type="text"
                placeholder="Address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <input
                className="w-full border rounded px-2 py-1"
                type="text"
                placeholder="Alt Recipient Name"
                value={form.altRecipientName}
                onChange={(e) =>
                  setForm({ ...form, altRecipientName: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-2 py-1"
                type="text"
                placeholder="Alt Recipient Phone"
                value={form.altRecipientPhone}
                onChange={(e) =>
                  setForm({ ...form, altRecipientPhone: e.target.value })
                }
              />
              <input
                className="w-full border rounded px-2 py-1"
                type="datetime-local"
                value={form.deliveryTime}
                onChange={(e) =>
                  setForm({ ...form, deliveryTime: e.target.value })
                }
              />

              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="bg-[#101021] text-white px-2 py-1 outline-1 rounded"
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            {/* Proof Image */}
            <div>
              <label>Proof Image</label>
              <input
                className="w-full border rounded px-2 py-1"
                type="file"
                accept="image/*"
                onChange={(e) => setProofFile(e.target.files[0] || null)}
              />
              {(proofFile || form.proofImage) && (
                <img
                  src={
                    proofFile ? URL.createObjectURL(proofFile) : form.proofImage
                  }
                  alt="preview"
                  className="w-24 h-24 mt-2 object-cover"
                />
              )}
            </div>

            {/* Items */}
            <div>
              <label>Items</label>
              {form.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <input
                    type="text"
                    placeholder="Product Title"
                    value={item.title}
                    onChange={async (e) => {
                      const newTitle = e.target.value;
                      const newItems = [...form.items];
                      newItems[index].title = newTitle;

                      try {
                        if (newTitle.trim() !== "") {
                          const res = await axios.get(
                            `http://localhost:5000/api/admin/products/title/${newTitle}`
                          );
                          newItems[index].price = res.data.priceAfterDiscount;
                          newItems[index].productId = res.data.id;
                        }
                      } catch (err) {
                        console.error("❌ fetch product error:", err);
                        newItems[index].price = 0;
                      }

                      setForm({ ...form, items: newItems });
                    }}
                    className="border rounded px-2 py-1"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={item.quantity}
                    onChange={(e) => {
                      const newItems = [...form.items];
                      newItems[index].quantity = parseInt(e.target.value) || 0;
                      setForm({ ...form, items: newItems });
                    }}
                    className="border rounded px-2 py-1 w-24"
                  />
                  <span className="text-white">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="text-white bg-[#d22525] hover:bg-[#a41010] px-2 py-1 rounded-lg ml-3"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="bg-[#2242bf] hover:bg-[#2d13b0] text-white px-2 py-1 rounded-lg ml-3"
              >
                Add Item
              </button>
            </div>

            {/* Total (readonly) */}
            <div>
              <label>Total</label>
              <input
                className="w-full border rounded px-2 py-1  cursor-not-allowed"
                type="number"
                value={form.total}
                disabled
              />
            </div>

            <div className="flex gap-4 mt-4">
              <button type="submit" className="px-4 py-2 bg-blue-600 rounded">
                {editing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-500 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewImg(null)}
        >
          <img
            src={previewImg}
            alt="Preview"
            className="max-h-[90%] max-w-[90%] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Confirm Delete */}
      {showConfirm && (
        <Confirm
          message="Are you sure to delete this order?"
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}

      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner />}
      </div>

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
