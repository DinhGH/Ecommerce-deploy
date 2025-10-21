/* eslint-disable no-unused-vars */
"use client";
import { motion } from "framer-motion";

export default function Title() {
  const text = "E-commerce";

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.07 * i },
    }),
  };

  const child = {
    hidden: {
      y: 50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <motion.h1
      style={{ fontFamily: "'Bungee', cursive" }}
      className="text-3xl sm:text-4xl lg:text-5xl mb-6 flex gap-1"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={child}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
