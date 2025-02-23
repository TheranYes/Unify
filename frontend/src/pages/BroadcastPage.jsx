// src/pages/BroadcastPage.jsx
import { motion } from "framer-motion";

export default function BroadcastPage() {
  const handleStartBroadcast = () => {
    console.log("Starting broadcast...");
    // Add broadcast logic here
  };

  return (
    <motion.main
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "-100%" }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-100 to-white dark:from-slate-800 dark:to-gray-700">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
        >
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
              Start Your Broadcast
            </h1>

            <motion.button
              onClick={handleStartBroadcast}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-orange-700 text-white rounded-full 
                     hover:bg-orange-600 transition-all duration-200
                     text-lg font-semibold shadow-md"
            >
              Start Broadcast
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
