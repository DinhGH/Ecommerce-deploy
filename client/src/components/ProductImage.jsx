/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useState } from "react";

export default function ProductImage({ src, alt }) {
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    const { offsetWidth, offsetHeight } = e.currentTarget;
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const rotateY = (x / offsetWidth - 0.5) * 75;
    const rotateX = (y / offsetHeight - 0.5) * -75;

    setTransform({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0 });
  };

  return (
    <motion.img
      src={src}
      alt={alt}
      className="mt-3 w-full h-30 sm:h-42 object-cover rounded drop-shadow-lg"
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: transform.rotateX,
        rotateY: transform.rotateY,
        scale: 1.02,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}
