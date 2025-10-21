/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

export default function Announcement({ type = "success", message, onClose }) {
  // Auto close sau 3s
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Chọn icon theo type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="text-green-500 w-6 h-6" />;
      case "error":
        return <XCircle className="text-red-500 w-6 h-6" />;
      case "warn":
        return <AlertTriangle className="text-yellow-500 w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed z-100 bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white shadow-lg px-4 py-4 rounded-xl border w-[400px]"
      >
        {getIcon()}
        <p className="flex-1 text-md text-black font-semibold">{message}</p>
        <button onClick={onClose} className="text-gray-400 hover:text-black">
          <X size={18} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
