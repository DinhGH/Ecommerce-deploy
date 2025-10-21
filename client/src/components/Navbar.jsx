/* eslint-disable no-unused-vars */

import { FaUser, FaCartShopping, FaMagnifyingGlass } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function Navbar({ onSearch, setPage, cartCount, onCartClick }) {
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef();

  const defaultAvatar =
    "https://res.cloudinary.com/micrservice0/image/upload/v1758112216/avatar_qvtxsf.jpg";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const handleSearch = () => {
    onSearch(input);
    setPage(1); // gọi hàm từ MainContent
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleUserClick = () => {
    if (user) {
      setIsModalOpen(!isModalOpen);
    } else {
      navigate("/auth");
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/user/logoutUser",
        {},
        { withCredentials: true }
      );
      navigate(0);
    } catch (err) {
      console.error("Logout error:", err);
    }

    // Xóa user trên client
    localStorage.removeItem("user");
    setUser(null);
    setIsModalOpen(false);
    // window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false); // đóng modal
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:5000/auth/user/me", {
          withCredentials: true,
        });

        if (res.data.success) {
          setUser(res.data.user);
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          console.error(err); // chỉ log lỗi khác 401
        }
        setUser(null);
      }
    };

    const query = new URLSearchParams(window.location.search);
    const loggedIn = query.get("loggedIn");

    if (loggedIn === "true") {
      // vừa đăng nhập xong
      checkAuth();
      window.history.replaceState({}, document.title, "/");
    } else {
      // load lại trang -> check xem còn cookie/session không
      checkAuth();
    }
  }, []);

  return (
    <header className=" bg-[#000000] text-white p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-end items-center">
        <nav className="flex md:flex items-center gap-6">
          <div className="flex items-center  rounded-full overflow-hidden border-2 hover:border-[#f7f7f7] border-[#8e8e8e]">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 w-45 md:w-56 bg-transparent text-white placeholder-white focus:outline-none"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={(e) => e.target.select()}
            />
            <button
              title="Find"
              className="bg-[#000000] px-4 py-3 "
              onClick={handleSearch}
            >
              <FaMagnifyingGlass className="text-white" />
            </button>
          </div>

          <button
            title="Cart"
            onClick={onCartClick}
            className="hover:text-gray-300 hover:scale-108 transition-colors relative"
          >
            <FaCartShopping size={20} />
            {cartCount >= 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            title="Login"
            onClick={handleUserClick}
            className="hover:text-gray-300 hover:scale-108 transition-colors"
          >
            {user ? (
              <img
                src={user.avatar || defaultAvatar}
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <FaUser size={20} />
            )}
          </button>

          {isModalOpen && user && (
            <motion.div
              ref={modalRef}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 top-full mt-2 w-64 bg-white text-black rounded-md shadow-2xl p-6 z-50"
            >
              {/* User Info */}
              <div className="text-center mb-4">
                <p className="font-semibold text-xl">{user.fullName}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <hr className="border-gray-700 my-3" />

              {/* Actions */}
              <div className="flex flex-col gap-2 text-black">
                <Link
                  className="w-full block text-center"
                  to="/profile"
                  rel="noopener noreferrer"
                >
                  <button className="px-3 py-2 hover:bg-[#101010c9] hover:text-white transition w-full">
                    Profile
                  </button>
                </Link>

                <Link
                  className="w-full block text-center"
                  to="/orders"
                  rel="noopener noreferrer"
                >
                  <button className="px-3 py-2 hover:bg-[#101010c9] hover:text-white transition w-full">
                    My Order
                  </button>
                </Link>

                <button
                  className="px-3 py-2 hover:bg-[#101010c9] hover:text-white transition w-full text-center"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="mt-4 flex justify-center w-full"
              >
                <IoCloseCircleOutline className="w-7 h-7 text-gray-700 hover:text-black transition" />
              </button>
            </motion.div>
          )}
        </nav>
      </div>
    </header>
  );
}
