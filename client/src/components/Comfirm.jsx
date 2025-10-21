import React from "react";
import { SecondaryButton } from "./ui/Buttons";

export default function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 " onClick={onCancel}></div>

      <div className="relative bg-white p-6 rounded-2xl shadow-lg w-[400px] animate-fadeIn">
        <p className="text-xl  text-gray-900 mb-6 text-center">{message}</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-1 rounded-xl cursor-pointer bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <SecondaryButton
            editStyle="px-6 py-1"
            title="Ok"
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
}
