import { useEffect, useState } from "react";
import axios from "axios";
import { DangerButton } from "../components/ui/Buttons";
import { useNavigate } from "react-router-dom";
import Announcement from "../components/Announcement";
import Confirm from "../components/Comfirm";
import { ElegantSpinner } from "../components/ui/Loading";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/orders/my-orders", {
        withCredentials: true,
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const onConfirmCancelOrder = async () => {
    if (!orderId) {
      setAnnouncement({ type: "error", message: "Order ID is invalid." });
      setShowConfirm(false);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.delete(
        `http://localhost:5000/api/orders/my-orders/${orderId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setAnnouncement({ type: "success", message: "Canceled Successfully" });

        setTimeout(() => {
          navigate(0);
        }, 3000);
      } else {
        setAnnouncement({ type: "error", message: "Cancel Failed" });
      }
    } catch (err) {
      console.error(err);

      if (err.response?.status === 400 && err.response.data?.message) {
        setAnnouncement({
          type: "error",
          message: (
            <span>
              {err.response.data.message}{" "}
              <a
                href="/about"
                className="underline text-blue-500 hover:text-blue-700"
              >
                Contact Admin
              </a>
            </span>
          ),
        });
      } else {
        setAnnouncement({ type: "error", message: "Server Error" });
      }
    } finally {
      setShowConfirm(false);
      setOrderId(null);
      setLoading(false);
    }
  };

  const onChangeOrder = (id) => {
    setOrderId(id);
    setShowConfirm(true);
  };

  const onCancelOrder = () => {
    setShowConfirm(false);
    setOrderId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        <a href="/" className="text-2xl font-bold mb-4 hover:underline">
          Home
        </a>
      </div>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border rounded p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Order #{order.id}</h3>
              <span
                className={`px-3 py-1 text-sm rounded ${
                  {
                    PENDING: "bg-gray-200 text-gray-800",
                    PAID: "bg-[#db34c5] text-white",
                    CANCELLED: "bg-red-500 text-white",
                    SHIPPED: "bg-yellow-400 text-white",
                    COMPLETED: "bg-green-500 text-white",
                  }[order.status] || "bg-gray-200 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              Recipient: {order.recipientName} | Phone: {order.recipientPhone}
            </p>
            <p className="text-sm text-gray-600">Address: {order.address}</p>
            <p className="text-sm text-gray-600">
              Order Date: {new Date(order.createdAt).toLocaleString()}
            </p>

            <ul className="divide-y mt-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.product.title}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold">
                    {(item.price * item.quantity).toLocaleString()}$
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between mt-3 font-bold">
              <span>Total:</span>
              <span>{order.total.toLocaleString()}$</span>
            </div>
            <div className="flex justify-end">
              {!(
                order.status === "CANCELLED" || order.status === "COMPLETED"
              ) && (
                <DangerButton
                  title={"Order cancellation"}
                  editStyle="px-3 py-2 w-fit my-2"
                  onClick={() => onChangeOrder(order.id)}
                />
              )}
            </div>
          </div>
        ))
      )}
      {showConfirm && (
        <Confirm
          message="Are you sure to cancel this order?"
          onConfirm={onConfirmCancelOrder}
          onCancel={onCancelOrder}
        />
      )}
      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner message="Loading..." />}
      </div>

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
