import { motion } from "framer-motion";

export const TransitionOverlay = () => {
  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-full h-full bg-slate-800 z-50"
        initial={{ scaleY: 1, originY: "top" }}
        animate={{ scaleY: 0, originY: "top" }}
        exit={{ scaleY: 1, originY: "top" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="fixed top-0 left-0 w-full h-full bg-violet-600 z-40"
        initial={{ scaleY: 1, originY: "top" }}
        animate={{ scaleY: 0, originY: "top" }}
        exit={{ scaleY: 1, originY: "top" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      />
    </>
  );
};