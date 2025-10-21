/* eslint-disable no-unused-vars */
import { motion, useMotionValue } from "framer-motion";

export default function DragSwitch({ onPrev, onNext, value }) {
  const x = useMotionValue(0);

  const handleDragEnd = () => {
    const latest = x.get();
    if (latest > 30) {
      onNext();
    } else if (latest < -30) {
      onPrev();
    }
    x.set(0);
  };

  return (
    <div className="inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        drag="x"
        style={{ x }}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="
          w-8 h-8 
          bg-white border
          rounded-full shadow-lg 
          flex items-center justify-center text-black
          pointer-events-auto cursor-grab active:cursor-grabbing z-20
        "
      >
        {value}
      </motion.div>
    </div>
  );
}
