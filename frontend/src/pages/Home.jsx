import { motion } from "framer-motion";
import { useRef } from "react";
import WelcomeContainer from "../assets/WelcomeContainer";
import UserListContainer from "../assets/UserListContainer";
import BroadcastContainer from "../assets/BroadcastContainer";

export default function Home() {
  const userListRef = useRef(null);
  const scrollRef = useRef(null);

  const handleDiscoverClick = async () => {
    try {
      // First try to get the user's location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      // Get the JWT token from storage
      const token = localStorage.getItem("token");

      // Send to backend server at localhost:3001
      const response = await fetch("http://localhost:3001/location/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update location");
      }

      // Log success (you can add a toast notification here)
      console.log("Location updated successfully");

      const userList = await fetch("http://localhost:3001/nearby", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userList.ok) {
        throw new Error("Failed to fetch nearby users");
      }

      const users = await userList.json();
      // Set userListRef to the fetched users
      userListRef.current?.setUsers(users);
      
      console.log("Fetched nearby users successfully. Count: ", users.length);
    } catch (error) {
      console.error("Error updating location:", error);
      // Handle errors (e.g., show error message to user)
    }

    // Scroll to user list regardless of location update success
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.main
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen relative"
    >
      {/* Background layers */}
      {/* Updated background layers */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-100 via-gray-100 to-orange-100 dark:from-gray-100 dark:via-gray-700 dark:to-slate-800" />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-orange-100/50 to-gray-800/50 dark:from-orange-100/50 dark:to-slate-800" />
      <div className="flex flex-col items-center pt-8 pb-8">
        <WelcomeContainer onDiscoverClick={handleDiscoverClick} />
        <BroadcastContainer />
      </div>
      <UserListContainer ref={userListRef} scrollRef={scrollRef} />
    </motion.main>
  );
}
