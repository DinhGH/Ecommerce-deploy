/* eslint-disable react-hooks/exhaustive-deps */

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PrimaryButton } from "./ui/Buttons";
import Title from "./ui/Title";

export default function Intro({ scrollToMain }) {
  const imageUrls = [
    "https://res.cloudinary.com/micrservice0/image/upload/v1757163465/kwynett-bragado-T27JS-d2JGo-unsplash_utg9wt.jpg",
    "https://res.cloudinary.com/micrservice0/image/upload/v1757163466/the-blowup-Rmjq07KI20U-unsplash_rohvw0.jpg",
    "https://res.cloudinary.com/micrservice0/image/upload/v1757163465/ryan-hoffman-Cs4GVbMqKGY-unsplash_bfdrcw.jpg",
    "https://res.cloudinary.com/micrservice0/image/upload/v1757163465/freestocks-_3Q3tsJ01nc-unsplash_ihp9oz.jpg",
    "https://res.cloudinary.com/micrservice0/image/upload/v1757163466/ubaid-e-alyafizi-g4W3SLjcvMA-unsplash_mvrdlk.jpg",
    "https://res.cloudinary.com/micrservice0/image/upload/v1757163465/natasa-grabovac-65GdmvSnvr4-unsplash_wqjthi.jpg",
    "https://res.cloudinary.com/micrservice0/image/upload/v1757163464/growtika--_jFGWIE6fg-unsplash_dv7g3n.jpg",
    "https://res.cloudinary.com/micrservice0/image/upload/v1757163464/shutter-speed-BQ9usyzHx_w-unsplash_d88jkw.jpg",
    "https://res.cloudinary.com/micrservice0/image/upload/v1757163465/thankvisuals-WTwcuYHPDEE-unsplash_n0cj9r.jpg",
  ];
  const [index, setIndex] = useState(0);
  const MotionPrimaryButton = motion.create(PrimaryButton);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % imageUrls.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
        flex w-full h-screen
        flex-row
        max-lg:flex-col
        text-white
        bg-[#1F1F1F]
        relative
      "
    >
      {/* image container */}
      <div className="flex justify-center items-center w-full pb-5 sm:pb-0 lg:w-5/12 relative">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={imageUrls[index]}
            src={imageUrls[index]}
            alt="Slide image"
            variants={{
              enter: { x: "110%", opacity: 0 },
              center: { x: "-6%", opacity: 1 },
              exit: { x: "-110%", opacity: 0 },
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 2.7, ease: "easeInOut" }}
            className="w-10/12 h-80 lg:w-5/6 lg:h-5/6  object-cover"
            style={{
              boxShadow:
                "6px 10px 40px rgba(158,213,234,0.5), 12px 20px 80px rgba(20,20,20,0.2)",
            }}
          />
        </AnimatePresence>
      </div>

      {/* right content */}
      <motion.div
        initial={{ x: -700, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="
          flex flex-col justify-center
          w-full lg:w-7/12 h-full
          px-6 sm:px-10 lg:px-20
          bg-[#302E2F]
        "
      >
        <div className="text-3xl sm:text-4xl lg:text-5xl mb-6">
          <Title />
        </div>

        <p
          style={{ fontFamily: "'Oswald', sans-serif" }}
          className="
            text-base sm:text-lg lg:text-2xl
            text-gray-300 leading-relaxed
            mb-8
          "
        >
          Welcome to <span className="font-bold">E-commerce</span> – your
          ultimate online shopping destination. Discover everything you need,
          from fashion, technology, and home essentials to beauty products and
          more. Enjoy easy shopping, fair prices, and fast delivery all in one
          place!
        </p>

        <div className="flex justify-center lg:justify-start">
          <MotionPrimaryButton
            editStyle="px-6 py-3 text-lg rounded-xl hover:scale-105 cursor-pointer"
            title={"Explore Products"}
            animate={{
              backgroundColor: ["#CFCFCF", "#F0F3F3"],
              scale: [1, 1.025, 1.05, 1.025, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            onClick={scrollToMain}
          />
        </div>
      </motion.div>
    </div>
  );
}
