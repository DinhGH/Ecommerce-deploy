import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Announcement from "../components/Announcement";
import { ElegantSpinner } from "../components/ui/Loading";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const items = state?.items || [];

  const [recipientName, setRecipientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [altRecipientName, setAltRecipientName] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [ward, setWard] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handleCheckout = async () => {
    if (
      !recipientName ||
      !email ||
      !phone ||
      !altRecipientName ||
      !altPhone ||
      !houseNumber ||
      !street ||
      !ward ||
      !province ||
      !country ||
      !deliveryTime
    ) {
      setAnnouncement({
        type: "error",
        message: "Please fill in all required fields!",
      });
      return;
    }

    if (recipientName.length >= 50) {
      setAnnouncement({
        type: "error",
        message: "Recipient name cannot exceed 50 characters.",
      });
      return;
    }
    if (altRecipientName.length >= 50) {
      setAnnouncement({
        type: "error",
        message: "AltRecipient name cannot exceed 50 characters.",
      });
      return;
    }

    if (phone.length !== 10) {
      setAnnouncement({
        type: "error",
        message: "Phone number is invalid!",
      });
      return;
    }
    if (altPhone.length !== 10) {
      setAnnouncement({
        type: "error",
        message: "AltPhone number is invalid!",
      });
      return;
    }

    if (!email.includes("@")) {
      setAnnouncement({
        type: "error",
        message: "Email is invalid!",
      });
      return;
    }

    const selectedDate = new Date(deliveryTime);
    const now = new Date();

    const minDateTime = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    if (selectedDate < minDateTime) {
      setAnnouncement({
        type: "error",
        message: "Delivery date must be at least 48 hours from now!",
      });
      return;
    }

    if (!paymentProof) {
      setAnnouncement({
        type: "error",
        message: "Please provide the evidence of payment!",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("recipientName", recipientName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("altRecipientName", altRecipientName);
      formData.append("altPhone", altPhone);
      formData.append("houseNumber", houseNumber);
      formData.append("street", street);
      formData.append("ward", ward);
      formData.append("province", province);
      formData.append("country", country);
      formData.append("deliveryTime", deliveryTime);
      if (paymentProof) {
        formData.append("paymentProof", paymentProof);
      }
      formData.append(
        "items",
        JSON.stringify(
          items.map((item) => ({
            id: item.id,
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          }))
        )
      );

      await axios.post("http://localhost:5000/api/orders", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAnnouncement({ message: "Order placed successfully!" });

      setTimeout(() => {
        navigate("/orders");
      }, 3000);
    } catch (err) {
      console.error(err);
      setAnnouncement({ type: "error", message: "Checkout failed!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>
        <a href="/" className="text-2xl font-bold mb-4 hover:underline">
          Home
        </a>
      </div>

      {/* Recipient Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-medium">Recipient Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={recipientName}
            onChange={(e) => {
              setRecipientName(e.target.value);
              const value = e.target.value;

              if (value.length >= 50) {
                setAnnouncement({
                  type: "error",
                  message: "AltRecipient name cannot exceed 50 characters.",
                });
              } else {
                setAnnouncement(null);
              }
            }}
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Phone Number</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              const value = e.target.value;

              if (value.length !== 10) {
                setAnnouncement({
                  type: "error",
                  message: "Phone number must be exactly 10 digits.",
                });
              } else {
                setAnnouncement(null);
              }
            }}
          />
        </div>

        <div>
          <label className="block font-medium">Alternate Recipient Name</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={altRecipientName}
            onChange={(e) => {
              setAltRecipientName(e.target.value);
              const value = e.target.value;

              if (value.length >= 50) {
                setAnnouncement({
                  type: "error",
                  message: "AltRecipient name cannot exceed 50 characters.",
                });
              } else {
                setAnnouncement(null);
              }
            }}
          />
        </div>

        <div>
          <label className="block font-medium">Alternate Phone</label>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={altPhone}
            onChange={(e) => {
              setAltPhone(e.target.value);
              const value = e.target.value;

              if (value.length !== 10) {
                setAnnouncement({
                  type: "error",
                  message: "Phone number must be exactly 10 digits.",
                });
              } else {
                setAnnouncement(null);
              }
            }}
          />
        </div>
      </div>

      {/* Address */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Shipping Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          placeholder="House Number"
          className="border px-3 py-2 rounded"
          value={houseNumber}
          onChange={(e) => setHouseNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Street"
          className="border px-3 py-2 rounded"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ward"
          className="border px-3 py-2 rounded"
          value={ward}
          onChange={(e) => setWard(e.target.value)}
        />
        <input
          type="text"
          placeholder="Province"
          className="border px-3 py-2 rounded"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        />
        <input
          type="text"
          placeholder="Country"
          className="border px-3 py-2 rounded col-span-2"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </div>

      {/* Delivery Time */}
      <div className="mb-4">
        <label className="block font-medium">Preferred Delivery Time</label>
        <input
          type="datetime-local"
          className="w-full border px-3 py-2 rounded"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(e.target.value)}
        />
      </div>

      {/* Payment QR Code */}
      <div className="mb-4">
        <label className="block font-medium mb-2">Scan to Pay</label>
        <img
          src="/qr-payment.png"
          alt="Payment QR Code"
          className="w-48 h-48 border rounded mx-auto"
        />
      </div>

      {/* Proof of Payment */}
      <div className="mb-4">
        <label className="block font-medium">Upload Payment Proof</label>
        <input type="file" onChange={handleFileChange} />
      </div>

      {/* Product List */}
      <h3 className="text-lg font-semibold mt-4 mb-2">Order Items</h3>
      <ul className="divide-y mb-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between py-3 gap-4"
          >
            <img
              src={item.product.thumbnail}
              alt={item.product.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="font-semibold">{item.product.title}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <span className="font-bold">
              {(item.quantity * item.product.price).toLocaleString()}$
            </span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between font-bold text-lg mb-4">
        <span>Total:</span>
        <span>{total.toLocaleString()}$</span>
      </div>

      <button
        onClick={handleCheckout}
        className="w-full bg-[#282828] hover:bg-[#242424] text-white py-2 rounded"
      >
        Confirm Payment
      </button>
      {announcement && (
        <Announcement
          type={announcement.type}
          message={announcement.message}
          onClose={() => setAnnouncement(null)}
        />
      )}

      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner message="Checking..." />}
      </div>
    </div>
  );
}
