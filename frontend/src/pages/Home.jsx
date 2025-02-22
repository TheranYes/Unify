// frontend/src/pages/Home.jsx
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
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Background layers */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-cream via-gray-100 to-cream dark:from-charcoal dark:via-gray-800 dark:to-charcoal" />
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50" />

      <div className="flex flex-col items-center pt-8 pb-8">
        <WelcomeContainer onDiscoverClick={handleDiscoverClick} />
        <BroadcastContainer />
      </div>
      <UserListContainer ref={userListRef} />
    </div>
  );
}
