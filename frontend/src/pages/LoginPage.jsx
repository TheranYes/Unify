import { useState } from "react";
import { AudioLines } from "lucide-react"; // Import specific icons you need

export default function LoginPage() {
  const handleSpotifyLogin = () => {
    window.location.href = "https://accounts.spotify.com/authorize";
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cream via-gray-100 to-cream dark:from-charcoal dark:via-gray-800 dark:to-charcoal">
      {/* Login container */}
      <div className="relative w-full max-w-md p-8 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl z-20">
        {/* Catchphrase */}
        <div className="flex flex-col items-center space-y-3">
          {/* Icon + Header Container */}
          <div className="flex items-center gap-4">
            {/* Icon */}
            <AudioLines className="w-12 h-12 bg-cream">
              {/* Your Spotify icon SVG here */}
            </AudioLines>

            {/* Header Text */}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Unify
            </h1>
          </div>

          {/* Slogan Text */}
          <p className="text-xl text-gray-700 dark:text-gray-300 -mt-2">
            Be Your Own Radio
          </p>
        </div>

        {/* Spotify Login Button */}
        <div className="relative z-30">
          <button
            onClick={handleSpotifyLogin}
            className="w-full bg-orange-700 text-white p-4 rounded-full 
              hover:bg-orange-600/90 transition-all duration-200
              text-lg font-semibold shadow-lg transform hover:scale-[1.02]
              flex items-center justify-center space-x-2"
          >
            <span>Login With Spotify</span>
          </button>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Connect your Spotify account to start sharing your musical world
        </p>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 z-10 bg-gradient-to-tr from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-900/50" />
    </div>
  );
}
