import { useState } from "react";
import { AudioLines } from "lucide-react"; // Import specific icons you need
import RedirectToHome from "../assets/RedirectToHome";

export default function LoginPage() {
  const CLIENT_ID = 'e79f3d3f007545a1a45f490cc789f63f';
  const REDIRECT_URI = 'http://localhost:5173/callback';
  const SCOPES = 'user-read-playback-state user-modify-playback-state user-read-currently-playing streaming';
  const handleSpotifyLogin = async () => {
    const authUrl = new URL("https://accounts.spotify.com/authorize");
    const generateRandomString = (length) => {
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const values = crypto.getRandomValues(new Uint8Array(length));
      return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    };
    const sha256 = async (plain) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(plain);
      return window.crypto.subtle.digest("SHA-256", data);
    };
    const base64encode = (input) => {
      return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    };
    const codeVerifier = generateRandomString(64);
    localStorage.setItem("code_verifier", codeVerifier);
    const codeChallenge = base64encode(await sha256(codeVerifier));
    const params = {
      response_type: "code",
      client_id: CLIENT_ID,
      scope: SCOPES,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: REDIRECT_URI,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  return (
    <div className="w-full h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-100 via-gray-100 to-white dark:from-slate-800 dark:via-gray-400 dark:to-slate-800">
      {/* Login container */}
      <div className="relative w-full max-w-md p-8 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl z-20">
        {/* Catchphrase */}
        <div className="flex flex-col items-center space-y-3">
          {/* Icon + Header Container */}
          <div className="flex items-center gap-4">
            {/* Icon */}
            <AudioLines className=" stroke-orange-700 w-12 h-12 ">
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
      <RedirectToHome></RedirectToHome>
    </div>
  );
}
