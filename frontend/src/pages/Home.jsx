import React from "react";
import WelcomeContainer from "../assets/WelcomeContainer";

function Home() {
  return (
<div className="w-full h-screen flex flex-col items-center p-4 bg-gradient-to-br from-cream via-gray-100 to-cream dark:from-charcoal dark:via-gray-800 dark:to-charcoal">
      {/* Background layer */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50" />
      
      {/* Welcome Container */}
      <WelcomeContainer />
        
      {/* Rest of your page content */}
      <div className="relative z-20 mt-72 w-full"> {/* Adjust margin-top as needed */}
        {/* Add other components here */}
      </div>
    </div>
  );
}

export default Home;
