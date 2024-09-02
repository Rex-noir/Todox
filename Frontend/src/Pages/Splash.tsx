import { motion } from "framer-motion";

export default function Splash() {
  return (
    <div className="flex h-screen w-screen animate-pulse flex-col items-center justify-center bg-gradient-to-br from-neutral-300 to-slate-400">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-4 text-6xl font-bold text-black"
      >
        Todox
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-xl font-bold text-black"
      >
        Fast, simple and free
      </motion.p>
    </div>
  );
}
