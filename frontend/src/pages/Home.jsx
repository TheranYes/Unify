import { useRef } from "react";
import WelcomeContainer from "../assets/WelcomeContainer";
import UserListContainer from "../assets/UserListContainer";

export default function Home() {
  const userListRef = useRef(null);

  const handleDiscoverClick = () => {
    userListRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Fixed background layers */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-cream via-gray-100 to-cream dark:from-charcoal dark:via-gray-800 dark:to-charcoal" />
      <div className="fixed inset-0 z-1 bg-gradient-to-tr from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50" />
      
      {/* Main content container */}
      <main className="relative z-10">
        <WelcomeContainer onDiscoverClick={handleDiscoverClick} />
        
        {/* Dynamic spacer for scroll target */}
        <div className="h-[40vh] w-full" aria-hidden="true" />
        
        <UserListContainer ref={userListRef} />
      </main>

      {/* Footer placeholder */}
      <footer className="fixed bottom-0 left-0 right-0 h-24 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-30">
        {/* Future buttons can be added here */}
      </footer>
    </div>
  );
}