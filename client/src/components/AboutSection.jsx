/* eslint-disable no-unused-vars */
"use client";
import { motion } from "framer-motion";
import { SecondaryButton } from "./ui/Buttons";
import { useNavigate } from "react-router-dom";

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <section
      id="about"
      className="flex justify-center items-center py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 flex justify-center">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -27 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="text-center max-w-2xl"
        >
          <h2 className="text-3xl font-bold mb-6">About Us</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Welcome to{" "}
            <span className="font-semibold text-black">E-commerce</span>, your
            trusted online shopping destination. We are committed to offering
            high-quality products at the best prices, ensuring a seamless
            shopping experience for every customer.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            With fast delivery, secure payment, and a dedicated support team
            available 24/7,{" "}
            <span className="font-semibold text-black">E-commerce</span> is here
            to make your shopping not only easy but also enjoyable.
          </p>

          {/* Button */}
          <div className="flex justify-center">
            <SecondaryButton
              title="Learn more"
              editStyle="px-6 py-3 text-lg rounded-xl"
              onClick={() => navigate("/about")}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
