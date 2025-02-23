// src/pages/BroadcastPage.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Ban, Loader2 } from "lucide-react";

export default function BroadcastPage() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [statusMessage, setStatusMessage] = useState("");

  const handleBroadcastAction = async () => {
    setStatus("loading");

    try {
      if (isBroadcasting) {
        // Stop broadcast
        const response = await fetch("http://localhost:3001/host", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to stop broadcast");

        setIsBroadcasting(false);
        setStatus("success");
        setStatusMessage("Broadcast stopped successfully");
      } else {
        // Start broadcast
        const spotifyWindow = window.open("https://open.spotify.com", "_blank");

        const response = await fetch("http://localhost:3001/host", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(response.status);
        if (!response.ok) throw new Error("Failed to start broadcast");

        setIsBroadcasting(true);
        setStatus("success");
        setStatusMessage("Broadcast started successfully");

        // Focus on new tab if possible
        spotifyWindow?.focus();
      }
    } catch (error) {
      setStatus("error");
      setStatusMessage(error.message);
    }
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
          className="w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-xl bg-white/80 dark:bg-slate-700 backdrop-blur-sm shadow-lg"
        >
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
              {isBroadcasting ? "Active Broadcast" : "Start Your Broadcast"}
            </h1>

            <motion.button
              onClick={handleBroadcastAction}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-full transition-all duration-200 text-lg font-semibold shadow-md ${
                isBroadcasting
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-orange-700 hover:bg-orange-600 text-white"
              }`}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              ) : isBroadcasting ? (
                "Stop Broadcast"
              ) : (
                "Start Broadcast"
              )}
            </motion.button>

            {status && (
              <div
                className={`flex items-center space-x-2 ${
                  status === "success" ? "text-green-600" : "text-red-600"
                }`}
              >
                {status === "success" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Ban className="h-5 w-5" />
                )}
                <span className="text-sm">{statusMessage}</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
