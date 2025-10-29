import { Routes, Route } from "react-router-dom";

import "./App.css";
import Admin from "./admin/page.jsx";
import Home from "./home/page.jsx";
import Auth from "./auth/page.jsx";
import Profile from "./profile/page.jsx";
import Order from "./order/page.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Reject from "./reject/page.jsx";
import Checkout from "./checkout/page.jsx";
import About from "./aboutus/page.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/orders" element={<Order />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/reject"
        element={
          <Reject messsage={"You don't have permission to access this page."} />
        }
      />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
