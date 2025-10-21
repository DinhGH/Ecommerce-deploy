/* eslint-disable no-unused-vars */
"use client";
import { motion } from "framer-motion";

export default function FeatureCard({ icon: Icon, title }) {
  return (
    <motion.div
      className="relative bg-gray-100 p-6 shadow-xl rounded-2xl flex flex-col items-center justify-center text-center"
      whileHover={{
        scale: 1.08,
        rotate: [0, 1, -1, 0],
      }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="p-4 bg-gradient-to-r from-[#abccaf] to-[#81d7a4] rounded-full mb-4 shadow-lg">
        <Icon size={32} className="text-white" />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>

      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </motion.div>
  );
}
