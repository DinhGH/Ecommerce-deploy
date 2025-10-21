/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaCartShopping } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Cart({ open, onClose, onCartUpdate }) {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFirstOpen, setIsFirstOpen] = useState(true);

  // Toggle chọn sản phẩm
  const handleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/cart", {
        withCredentials: true,
      });
      const newIds = res.data.map((item) => item.id);
      setCart(res.data);

      setSelectedItems((prev) => {
        if (isFirstOpen) {
          return newIds;
        }

        return prev.filter((id) => newIds.includes(id));
      });

      setIsFirstOpen(false);

      const total = res.data.reduce((sum, item) => sum + item.quantity, 0);
      onCartUpdate(total);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    if (open) fetchCart();
  }, [open]);

  const updateQuantity = async (id, newQty) => {
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${id}`,
        { quantity: newQty },
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const increaseQty = (id, currentQty) => {
    const newQty = currentQty + 1;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
    updateQuantity(id, newQty);
  };

  const decreaseQty = (id, currentQty) => {
    if (currentQty <= 1) return;
    const newQty = currentQty - 1;
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
    updateQuantity(id, newQty);
  };

  // Tổng cộng chỉ tính sản phẩm được chọn
  const total = cart
    .filter((item) => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        withCredentials: true,
      });

      // Xóa khỏi state để UI cập nhật ngay
      setCart((prev) => prev.filter((item) => item.id !== id));
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
      fetchCart();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Không thể xóa sản phẩm khỏi giỏ hàng!");
    }
  };
  const variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
    exit: {
      x: "100%",
      opacity: 0.4,
      transition: { duration: 0.4, ease: "easeInOut" }, // dùng tween cho mượt
    },
  };

  const navigate = useNavigate();

  const goToCheckout = () => {
    const selected = cart.filter((item) => selectedItems.includes(item.id));

    if (selected.length === 0) return;

    navigate("/checkout", { state: { items: selected } });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 bg-black/60 flex justify-end z-50"
          onClick={onClose} // click outside đóng
        >
          {/* Giỏ hàng trượt từ phải vào */}

          <motion.div
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white w-96 h-full shadow-lg p-4 overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // ngăn đóng khi click trong
          >
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <h2 className="text-lg font-bold">
                {" "}
                <FaCartShopping size={20} />
              </h2>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-black"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="text-gray-500">Empty</p>
            ) : (
              <ul className="space-y-4 max-h-9/12 overflow-y-auto pr-2">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 border-b pb-2"
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelect(item.id)}
                    />

                    {/* Ảnh sản phẩm */}
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="w-14 h-14 object-cover rounded"
                    />

                    {/* Thông tin */}
                    <div className="flex-1 flex flex-col justify-between">
                      {/* Tên + Giá */}
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.product.title}
                        </p>

                        <p className="text-sm text-gray-500">
                          {item.product.price.toLocaleString()}$
                        </p>
                      </div>

                      {/* Hàng dưới: tăng giảm + xóa */}
                      <div className="flex mt-2">
                        {/* Tăng/giảm số lượng */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => decreaseQty(item.id, item.quantity)}
                            className="px-2  border rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="min-w-[20px] text-center ">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(item.id, item.quantity)}
                            className="px-2  border rounded hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Thành tiền */}
                    <div className="flex flex-col">
                      <span className="font-bold text-lg my-2 text-gray-800">
                        {(item.quantity * item.product.price).toLocaleString()}$
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-500  hover:text-gray-700"
                      >
                        <FaTrash size={18} className="mx-auto" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Tổng cộng */}
            <div className="mt-6 pt-4 flex justify-between font-bold">
              <span>Total:</span>
              <span>{total.toLocaleString()}$</span>
            </div>

            <button
              className="mt-4 w-full bg-[#333] text-white py-2 rounded hover:bg-[#242424] disabled:bg-gray-400"
              disabled={selectedItems.length === 0}
              onClick={goToCheckout}
            >
              Pay
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default Cart;
