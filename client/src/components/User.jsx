// src/admin/component/User.jsx
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import Confirm from "./Comfirm";
import Announcement from "./Announcement";
import { ElegantSpinner } from "./ui/Loading";

export default function User() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [originalUser, setOriginalUser] = useState({ email: "", phone: "" });

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    age: "",
    gender: "",
    avatarUrlText: "",
    role: "USER",
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users?page=${page}&limit=10`
      );
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("❌ Error fetchUsers:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      address: "",
      age: "",
      gender: "",
      avatarUrlText: "",
      role: "USER",
    });
    setAvatarFile(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (
        !form.fullName ||
        !form.email ||
        !form.phone ||
        !form.address ||
        !form.gender ||
        !form.age ||
        (!form.password && !editing)
      ) {
        setAnnouncement({
          type: "error",
          message: "Please fill in all required fields!",
        });
        return;
      }

      if (form.fullName.length > 50) {
        setAnnouncement({
          type: "error",
          message: "Full name cannot exceed 50 characters",
        });
        return;
      }

      if (!form.email.includes("@")) {
        setAnnouncement({
          type: "error",
          message: "Email is invalid!",
        });
        return;
      }

      if (form.phone.length !== 10) {
        setAnnouncement({
          type: "error",
          message: "Phone number is invalid!",
        });
        return;
      }

      if (form.age < 0 || form.age > 150) {
        setAnnouncement({
          type: "error",
          message: "Age is invalid!",
        });
        return;
      }

      if (form.password) {
        const value = form.password;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!regex.test(value)) {
          setAnnouncement({
            type: "error",
            message:
              "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.!",
          });
          return;
        }
      }

      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== "avatarUrlText") {
          if (editing && (k === "email" || k === "phone")) {
            if (v === originalUser[k]) return;
          }
          fd.append(k, v);
        }
      });

      if (avatarFile) {
        fd.append("avatar", avatarFile);
      } else if (form.avatarUrlText) {
        fd.append("avatar", form.avatarUrlText);
      }

      const url = editing
        ? `${import.meta.env.VITE_API_URL}/api/admin/users/${editing}`
        : `${import.meta.env.VITE_API_URL}/api/admin/users`;
      const method = editing ? "put" : "post";

      await axios[method](url, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let mess = null;
      if (editing) {
        mess = "Update user complete!";
      } else {
        mess = "Create user complete!";
      }

      setAnnouncement({
        type: "success",
        message: mess,
      });
      fetchUsers();
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
          message: "Registration/Updating failed!",
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
        `${import.meta.env.VITE_API_URL}/api/admin/users/${selectedId}`
      );
      setAnnouncement({ message: "Delete user successfully" });
      setTimeout(() => {
        fetchUsers();
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setShowConfirm(false);
      setSelectedId(null);
      setLoading(false);
    }
  };

  const onCancelDelete = () => {
    setShowConfirm(false);
    setSelectedId(null);
  };

  return (
    <div className="w-full">
      <h2 className="mb-6 text-2xl font-bold text-gray-300">Manage Users</h2>

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

          <div className="overflow-x-auto overflow-y-auto w-full max-h-[420px] rounded-lg border-2 border-gray-400">
            <table className="table-auto w-full border-gray-400 border-2 rounded-lg">
              <thead className="text-white text-sm bg-[#55575d]">
                <tr>
                  <th className="px-4 py-2 border-2 border-gray-400 w-[60px]">
                    ID
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-400 w-[150px]">
                    FullName
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-400">Email</th>
                  <th className="px-4 py-2 border-2 border-gray-400 w-[120px]">
                    Phone
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-400">
                    Address
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-400 w-[70px]">
                    Age
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-400 w-[90px]">
                    Gender
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-400 w-[90px]">
                    Avatar
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-400 w-[90px]">
                    Role
                  </th>
                  <th className="px-4 py-2 border-2 border-gray-400 w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200">
                {users.length ? (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="h-18 hover:bg-[#050b19] text-center"
                    >
                      <td className="px-4 py-2">{u.id}</td>
                      <td className="px-4 py-2">{u.fullName}</td>
                      <td className="px-4 py-2 text-left">{u.email}</td>
                      <td className="px-4 py-2">{u.phone}</td>
                      <td className="px-4 py-2 text-left">{u.address}</td>
                      <td className="px-4 py-2">{u.age}</td>
                      <td className="px-4 py-2">{u.gender}</td>
                      <td className="px-4 py-2">
                        {u.avatar && (
                          <img
                            src={u.avatar}
                            alt="avatar"
                            className="w-12 h-12 rounded-full mx-auto"
                          />
                        )}
                      </td>
                      <td className="px-4 py-2">{u.role}</td>
                      <td className="px-4 py-2 flex gap-2 justify-center">
                        <td className="px-4 py-2 flex gap-2 justify-center">
                          <button
                            onClick={() => {
                              setShowForm(true);
                              setEditing(u.id);
                              setForm({
                                fullName: u.fullName || "",
                                email: u.email,
                                phone: u.phone || "",
                                password: "",
                                address: u.address || "",
                                age: u.age || "",
                                gender: u.gender || "",
                                avatarUrlText: u.avatar || "",
                                role: u.role || "USER",
                              });
                              setOriginalUser({
                                email: u.email,
                                phone: u.phone,
                              });
                            }}
                            className="p-2 text-blue-500 hover:text-blue-700"
                          >
                            <PencilSquareIcon className="w-7 h-7" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(u.id)}
                            className="p-2 text-gray-700 hover:text-gray-500"
                          >
                            <TrashIcon className="w-7 h-7" />
                          </button>
                        </td>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="text-center py-4">
                      No users found
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

      {showForm && (
        <div
          className="overflow-y-auto
            w-full h-[470px]
            p-6
            bg-[#101021]
            rounded-lg
            shadow-md"
        >
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <label className="block font-medium">Full Name</label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block font-medium">Password</label>
              <input
                type="password"
                placeholder={`${editing ? "Your new password" : ""}`}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>

            <div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block font-medium">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full border rounded px-2 py-1"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full border bg-[#101021] rounded px-2 py-1"
                >
                  <option value=""></option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0] || null)}
              />
              {(avatarFile || form.avatarUrlText) && (
                <img
                  src={
                    avatarFile
                      ? URL.createObjectURL(avatarFile)
                      : form.avatarUrlText
                  }
                  alt="avatar preview"
                  className="w-24 h-24 object-cover mt-2 rounded-full"
                />
              )}
            </div>

            <div>
              <label className="block font-medium">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full border bg-[#101021] rounded px-2 py-1"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              >
                {editing ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showConfirm && (
        <Confirm
          message="Are you sure to delete this user?"
          onConfirm={onConfirmDelete}
          onCancel={onCancelDelete}
        />
      )}

      <div className="relative top-0 left-0">
        {loading && <ElegantSpinner />}
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
