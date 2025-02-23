// 3. Updated BroadcastContainer.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BroadcastContainer() {
  const [isPressed, setIsPressed] = useState(false);
  const navigate = useNavigate();

  const handleBroadcastPress = () => {
    navigate("/broadcast");
  };

  return (
    <div className="relative z-30 mx-auto w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg transition-all duration-300 my-8">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Or start your own
          </h1>
        </div>

        <button
          onClick={handleBroadcastPress}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={`px-8 py-3 bg-orange-700 text-white rounded-full 
            hover:bg-orange-600/90 transition-all duration-200
            text-lg font-semibold shadow-md ${
              isPressed ? "scale-95 brightness-75" : "hover:scale-105"
            }`}
        >
          Broadcast
        </button>
      </div>
    </div>
  );
}
