import { motion } from "framer-motion";
import { useRef } from "react";
import WelcomeContainer from "../assets/WelcomeContainer";
import UserListContainer from "../assets/UserListContainer";
import BroadcastContainer from "../assets/BroadcastContainer";

export default function Home() {
  const userListRef = useRef(null);

  const handleDiscoverClick = () => {
    userListRef.current?.scrollIntoView({
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
      <UserListContainer ref={userListRef} />
    </motion.main>
  );
}
