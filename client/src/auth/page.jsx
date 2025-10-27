/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Eye,
  EyeOff,
  User,
  MapPin,
  Calendar,
  Users,
  Phone,
} from "lucide-react";
import { IoLogoGoogle, IoLogoFacebook } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { TbHomeMove } from "react-icons/tb";
import { Link } from "react-router-dom";
import { ElegantSpinner } from "../components/ui/Loading";
import { useNavigate } from "react-router-dom";
import Announcement from "../components/Announcement";

axios.defaults.withCredentials = true;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header with toggle */}
        <div className="bg-gradient-to-r from-gray-800 to-black rounded-t-2xl p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {isLogin ? "Login" : "Create an Account"}
          </h1>
          <div className="flex bg-white/20 rounded-full p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                isLogin
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-white text-gray-900 shadow-md"
                  : "text-white hover:bg-white/10"
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {/* Form container with animation */}
        <div className="bg-white/90 backdrop-blur-sm rounded-b-2xl shadow-xl border border-gray-200 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <LoginForm />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.4 }}
              >
                <RegisterForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Link to={"/"}>
        <TbHomeMove className="fixed bottom-0 right-0 mr-3 mb-2 sm:mr-5 sm:mb-5 text-2xl text-black transition hover:text-white hover:bg-[#292929] border-2 border-[#292929] rounded-full w-[45px] h-[45px] p-2" />
      </Link>
    </div>
  );
}

// Login Form
const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  useEffect(() => {
    // Kiểm tra xem URL có loggedIn=true không
    const params = new URLSearchParams(window.location.search);
    const loggedIn = params.get("loggedIn");

    if (loggedIn === "true") {
      // Gọi API /me để lấy thông tin user từ backend
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/me`, {
          withCredentials: true,
        })
        .then((res) => {
          const user = res.data;
          // Lưu user vào localStorage
          localStorage.setItem("user", JSON.stringify(user));
          console.log("✅ Logged in via social login:", user);

          // Chuyển hướng sang trang chính hoặc dashboard
          if (user.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("❌ Lỗi khi lấy user sau social login:", err);
        });
    }
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/user/loginUser`,
        formData,
        { withCredentials: true }
      );
      if (res.status == 201) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setAnnouncement({ message: "Login successfully!" });
        setTimeout(() => {
          if (res.data.role === "ADMIN") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }, 3000);
      } else {
        alert("Login failed!");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setAnnouncement({
          type: "error",
          message: error.response.data.message,
        });
      } else {
        setAnnouncement({ type: "error", message: "Registration failed!" });
      }
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/user/google`;
  };

  const loginFacebook = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/user/facebook`;
  };

  return (
    <>
      <div className="p-6">
        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              <IoLogoGoogle className="inline w-4 h-4 mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-700">Remember me</span>
            </label>

            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-gray-700 hover:text-black hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Login
          </button>
        </div>

        {/* Divider */}
        <div className="mt-6 mb-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="space-y-3">
          <button
            onClick={loginGoogle}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 transition-all group"
          >
            <IoLogoGoogle className="w-5 h-5 text-red-500 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-gray-800 font-medium">
              Continue with Google
            </span>
          </button>

          <button
            onClick={loginFacebook}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 transition-all group"
          >
            <IoLogoFacebook className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-gray-800 font-medium">
              Continue with Facebook
            </span>
          </button>
        </div>
      </div>
      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner message="Login..." />}
      </div>

      {announcement && (
        <Announcement
          type={announcement.type}
          message={announcement.message}
          onClose={() => setAnnouncement(null)}
        />
      )}
    </>
  );
};

// Register Form
const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    age: "",
    gender: "male",
    agreeTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.gender ||
      !formData.age ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setAnnouncement({
        type: "error",
        message: "Please fill in all required fields!",
      });
      return;
    }

    if (!formData.email.includes("@")) {
      setAnnouncement({
        type: "error",
        message: "Email is invalid!",
      });
      return;
    }

    if (formData.fullName.length >= 50) {
      setAnnouncement({
        type: "error",
        message: "Full name cannot exceed 50 characters",
      });
      return;
    }
    if (formData.phone.length !== 10) {
      setAnnouncement({
        type: "error",
        message: "Phone number is invalid!",
      });
      return;
    }

    if (formData.age < 0 || formData.age > 150) {
      setAnnouncement({
        type: "error",
        message: "Age is invalid!",
      });
      return;
    } else {
      setAnnouncement(null);
    }

    const value = formData.password;
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(value)) {
      setAnnouncement({
        type: "error",
        message: "Password is invalid!",
      });
      return;
    } else {
      setAnnouncement(null);
    }

    if (formData.password !== formData.confirmPassword) {
      setAnnouncement({ type: "error", message: "Passwords do not match!" });
      return;
    }

    if (!formData.agreeTerms) {
      setAnnouncement({
        type: "error",
        message: "You must agree to the terms!",
      });

      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/user/createUser`,
        formData
      );
      if (res.status === 201) {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          address: "",
          age: "",
          gender: "",
          agreeTerms: false,
        });
        setAnnouncement({ message: "Register successfully" });
        setTimeout(() => {
          navigate(0);
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setAnnouncement({
          type: "error",
          message: error.response.data.message,
        });
      } else {
        setAnnouncement({ type: "error", message: "Registration failed!" });
      }
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/user/google`;
  };

  const loginFacebook = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/user/facebook`;
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">
            <User className="inline w-4 h-4 mr-2" />
            Full Name
          </label>
          <input
            type="text"
            required
            name="fullName"
            value={formData.fullName}
            onChange={(e) => {
              handleInputChange(e);
              const value = e.target.value;

              if (value.length >= 50) {
                setAnnouncement({
                  type: "error",
                  message: "Full name cannot exceed 50 characters.",
                });
              } else {
                setAnnouncement(null);
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="Enter your full name"
            maxLength={50}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">
            <IoLogoGoogle className="inline w-4 h-4 mr-2" />
            Email
          </label>
          <input
            type="email"
            required
            name="email"
            value={formData.email}
            onChange={(e) => {
              handleInputChange(e);
              const value = e.target.value;

              if (!value.includes("@")) {
                setAnnouncement({
                  type: "error",
                  message: "Email must contain '@'.",
                });
              } else {
                setAnnouncement(null);
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="Enter your email address"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">
            <Phone className="inline w-4 h-4 mr-2" />
            Phone Number
          </label>
          <input
            type="number"
            required
            name="phone"
            value={formData.phone}
            onChange={(e) => {
              handleInputChange(e);
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Address */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">
            <MapPin className="inline w-4 h-4 mr-2" />
            Address
          </label>
          <input
            type="text"
            required
            maxLength={100}
            name="address"
            value={formData.address}
            onChange={(e) => {
              handleInputChange(e);
              const value = e.target.value;

              if (value.length >= 100) {
                setAnnouncement({
                  type: "error",
                  message: "Address cannot exceed 50 characters.",
                });
              } else {
                setAnnouncement(null);
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="Enter your address"
          />
        </div>

        {/* Age & Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              <Calendar className="inline w-4 h-4 mr-2" />
              Age
            </label>
            <input
              type="number"
              required
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Age"
              min="0"
              max="150"
              onInput={(e) => {
                const value = Number(e.target.value);
                if (value < 0 || value > 150) {
                  setAnnouncement({
                    type: "error",
                    message: "Age must be between 0 and 150",
                  });
                } else {
                  setAnnouncement(null);
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              <Users className="inline w-4 h-4 mr-2" />
              Gender
            </label>
            <select
              name="gender"
              required
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={(e) => {
                handleInputChange(e);
                const value = e.target.value;
                const regex =
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                if (!regex.test(value)) {
                  setAnnouncement({
                    type: "error",
                    message:
                      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
                  });
                } else {
                  setAnnouncement(null);
                }
              }}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Create a strong password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-800">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              placeholder="Re-enter password"
              onChange={(e) => {
                handleInputChange(e);
                const value = e.target.value;
                const regex =
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
                if (!regex.test(value)) {
                  setAnnouncement({
                    type: "error",
                    message:
                      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.",
                  });
                } else {
                  setAnnouncement(null);
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="space-y-3">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleInputChange}
              className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded focus:ring-black mt-0.5"
            />
            <span className="ml-2 text-sm text-gray-700">
              I agree to the{" "}
              <button
                onClick={() => alert("Terms of Service")}
                className="text-black hover:underline"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                onClick={() => alert("Privacy Policy")}
                className="text-black hover:underline"
              >
                Privacy Policy
              </button>
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Create Account
        </button>
      </div>

      {/* Divider */}
      <div className="mt-6 mb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              Or register with
            </span>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="space-y-3">
        <button
          onClick={loginGoogle}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 transition-all group"
        >
          <IoLogoGoogle className="w-5 h-5 text-red-500 mr-3 group-hover:scale-110 transition-transform" />
          <span className="text-gray-800 font-medium">
            Register with Google
          </span>
        </button>

        <button
          onClick={loginFacebook}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 transition-all group"
        >
          <IoLogoFacebook className="w-5 h-5 text-blue-600 mr-3 group-hover:scale-110 transition-transform" />
          <span className="text-gray-800 font-medium">
            Register with Facebook
          </span>
        </button>
      </div>

      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner message="Register..." />}
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
};
