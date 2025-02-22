// src/pages/BroadcastPage.jsx
export default function BroadcastPage() {
  const handleStartBroadcast = () => {
    console.log("Starting broadcast...");
    // Add broadcast logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cream dark:from-charcoal">
      <div className="w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
            Start Your Broadcast
          </h1>

          <button
            onClick={handleStartBroadcast}
            className="px-8 py-3 bg-orange-700 text-white rounded-full 
                     hover:bg-orange-600 transition-all duration-200
                     text-lg font-semibold shadow-md hover:scale-105"
          >
            Start Broadcast
          </button>
        </div>
      </div>
    </div>
  );
}
