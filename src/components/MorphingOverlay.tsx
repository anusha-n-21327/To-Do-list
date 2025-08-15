import { motion } from "framer-motion";

export const MorphingOverlay = () => {
  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-violet-600 z-50 origin-center"
      initial={{ clipPath: "circle(150% at 50% 50%)" }}
      animate={{ clipPath: "circle(0% at 50% 50%)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    />
  );
};