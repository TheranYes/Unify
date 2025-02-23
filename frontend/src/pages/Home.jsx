import { motion } from "framer-motion";
import { useRef, useState } from "react";
import WelcomeContainer from "../assets/WelcomeContainer";
import UserListContainer from "../assets/UserListContainer";
import BroadcastContainer from "../assets/BroadcastContainer";
import OldUserListContainer from "../assets/OldUserListContainer";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  const userListRef = useRef(null);
  const oldUserListRef = useRef(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Add this state

  // Back button handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Go back to login
  };

  const handleDiscoverClick = async () => {
    setIsLoading(true); // Set loading state
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

      const oldUserList = await fetch("http://localhost:3001/nearby/old", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!oldUserList.ok) {
        throw new Error("Failed to fetch old nearby users");
      }

      const oldUsers = await oldUserList.json();
      // Set oldUserListRef to the fetched old users
      oldUserListRef.current?.setUsers(oldUsers);
    } catch (error) {
      console.error("Error updating location:", error);
      // Handle errors (e.g., show error message to user)
    } finally {
      setIsLoading(false); // Clear loading state
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
      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-4 left-4 z-20 px-4 py-2 bg-orange-700 text-white rounded-full 
          hover:bg-orange-600 transition-all duration-200 text-sm font-semibold 
          shadow-md flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Logout</span>
      </motion.button>
      {/* Background layers */}
      {/* Updated background layers */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-orange-100/50 via-orange-400 to-orange-100 dark:from-gray-100 dark:via-gray-700 dark:to-slate-800" />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-orange-100/50 to-white-800/50 dark:from-grey-200/50 dark:to-slate-800" />
      <div className="flex flex-col items-center pt-8 pb-8">
        <WelcomeContainer onDiscoverClick={handleDiscoverClick} />
        <BroadcastContainer />
      </div>
      <UserListContainer
        ref={userListRef}
        scrollRef={scrollRef}
        isLoading={isLoading}
        onRefresh={handleDiscoverClick}
      />
      <OldUserListContainer ref={oldUserListRef} className="mt-5 pt-5" />
    </motion.main>
  );
}
