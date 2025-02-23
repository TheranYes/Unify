// src/pages/BroadcastPage.jsx
import { motion } from "framer-motion";
import { useState } from "react";
import { Check, Ban, Loader2 } from "lucide-react";

export default function BroadcastPage() {
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [spotifyWindow, setSpotifyWindow] = useState(null);

  const DEVICE_REGISTRATION_DELAY = 5000; // 5 seconds

  const handleBroadcastAction = async () => {
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
      return;
    }

    setStatus("loading");
    setStatusMessage("Opening Spotify and registering device...");

    try {
      // Open Spotify in new tab
      const newWindow = window.open("https://open.spotify.com", "_blank");
      setSpotifyWindow(newWindow);

      // Wait for device registration
      await new Promise(async (resolve, reject) => {
        setTimeout(async () => {
          try {
            if (newWindow.closed) {
              throw new Error(
                "Spotify window closed before registration completed"
              );
            }

            // Get user's location
            const position = await new Promise((posResolve, posReject) => {
              navigator.geolocation.getCurrentPosition(posResolve, posReject, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              });
            });

            // Update location
            setStatusMessage("Updating your location...");
            const token = localStorage.getItem("token");
            const locationResponse = await fetch(
              "http://localhost:3001/location/update",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }),
              }
            );

            if (!locationResponse.ok)
              throw new Error("Failed to update broadcast location");

            // Start broadcast
            setStatusMessage("Finalizing broadcast setup...");
            const hostResponse = await fetch("http://localhost:3001/host", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (!hostResponse.ok) throw new Error("Failed to start broadcast");

            setIsBroadcasting(true);
            setStatus("success");
            setStatusMessage("Broadcast started successfully");
            resolve();
          } catch (error) {
            reject(error);
          }
        }, DEVICE_REGISTRATION_DELAY);
      });
    } catch (error) {
      setStatus("error");
      setStatusMessage(error.message);
      spotifyWindow?.close();
      setIsBroadcasting(false);
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
            {/* ... existing title ... */}

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
                <div className="flex items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  {isBroadcasting ? "Stopping..." : "Starting..."}
                </div>
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

            {status === "loading" && !isBroadcasting && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Please keep the Spotify tab open for device registration...
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
