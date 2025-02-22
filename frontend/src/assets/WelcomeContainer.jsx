// components/WelcomeContainer.jsx
import { useState } from "react";

export default function WelcomeContainer( {onDiscoverClick} ) {
  const [isPressed, setIsPressed] = useState(false);

  const handleDiscoverPress = () => {
    // Add discovery logic here
    onDiscoverClick?.();
    console.log("Discover button pressed");
  };

  return (
    <div className="absolute z-30 top-1/6 left-0 right-0 mx-auto -translate-y-1/2 w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg transition-all duration-300">
      <div className="flex flex-col items-center space-y-4">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome,
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300">
            Start finding Spotify users
          </p>
        </div>

        {/* Discover Button */}
        <button
          onClick={handleDiscoverPress}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={`px-8 py-3 bg-orange-700 text-white rounded-full 
            hover:bg-orange-600/90 transition-all duration-200
            text-lg font-semibold shadow-md ${
              isPressed ? "scale-95 brightness-75" : "hover:scale-105"
            }`}
        >
          Discover
        </button>
      </div>
    </div>
  );
}
