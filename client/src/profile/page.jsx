import { useEffect, useState } from "react";
import axios from "axios";
import { ElegantSpinner } from "../components/ui/Loading";
import Announcement from "../components/Announcement";

export default function Profile() {
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [announcement, setAnnouncement] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    gender: "",
    avatar: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/user/me`,
          {
            withCredentials: true,
          }
        );

        if (res.data.success) {
          // setUser(res.data.user);
          setFormData({
            fullName: res.data.user.fullName || "",
            email: res.data.user.email || "",
            phone: res.data.user.phone || "",
            address: res.data.user.address || "",
            age: res.data.user.age || "",
            gender: res.data.user.gender || "",
            avatar: res.data.user.avatar || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (!formData.address) {
        setAnnouncement({
          type: "error",
          message: "Please type your address!",
        });
        return;
      }
      if (!formData.email) {
        setAnnouncement({
          type: "error",
          message: "Please type your email!",
        });
        return;
      }
      if (!formData.phone) {
        setAnnouncement({
          type: "error",
          message: "Please type your phone number!",
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

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (avatarFile) {
        data.append("avatarFile", avatarFile);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/user/update`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setAnnouncement({ message: "Profile updated successfully!" });
        // setUser(res.data.user);
        setFormData({
          ...formData,
          avatar: res.data.user.avatar ? res.data.user.avatar : "",
        });
        setEditMode(false);
        setAvatarFile(null);
      } else {
        setAnnouncement({ type: "error", message: "Update failed!" });
      }
    } catch (err) {
      console.error("Update error:", err);
      setAnnouncement({ type: "error", message: "Error updating profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 m-5 bg-white shadow-xl rounded">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <a href="/" className="text-2xl font-bold mb-4 hover:underline">
          Home
        </a>
      </div>
      {/* Avatar Upload */}
      <div>
        <label className="block font-medium">Avatar</label>
        <input
          type="file"
          accept="image/*"
          disabled={!editMode}
          onChange={(e) => setAvatarFile(e.target.files[0] || null)}
        />
        <img
          src={
            avatarFile
              ? URL.createObjectURL(avatarFile)
              : formData.avatar || "https://via.placeholder.com/100"
          }
          alt="avatar preview"
          className="w-24 h-24 object-cover mt-2 rounded-full"
        />
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={(e) => {
            handleChange(e);
            const value = e.target.value;

            if (value.length >= 50) {
              setAnnouncement({
                type: "error",
                message: "Phone number must be exactly 10 digits.",
              });
            } else {
              setAnnouncement(null);
            }
          }}
          disabled={!editMode}
          placeholder="Full Name"
          className="border px-3 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => {
            handleChange(e);
            const value = e.target.value;

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(value)) {
              setAnnouncement({
                type: "error",
                message: "Please enter a valid email address.",
              });
            } else {
              setAnnouncement(null);
            }
          }}
          disabled={!editMode}
          placeholder="Email"
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={(e) => {
            handleChange(e);
            const value = e.target.value;

            if (!/^\d{10}$/.test(value)) {
              setAnnouncement({
                type: "error",
                message: "Phone number must be exactly 10 digits.",
              });
            } else {
              setAnnouncement(null);
            }
          }}
          disabled={!editMode}
          placeholder="Phone"
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          disabled={!editMode}
          placeholder="Address"
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={(e) => {
            handleChange(e);
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
          disabled={!editMode}
          placeholder="Age"
          className="border px-3 py-2 rounded"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          disabled={!editMode}
          className="border px-3 py-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex ">
        {editMode ? (
          <>
            <button
              onClick={handleUpdate}
              className="bg-[#333] mx-2 hover:bg-[#1d1d1d] text-white px-4 py-2 rounded-lg"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditMode(false);
                setAvatarFile(null);
              }}
              className="bg-gray-400 mx-2 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-[#333] hover:bg-[#1d1d1d] text-white px-4 py-2 rounded-lg"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner message="Updating..." />}
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
