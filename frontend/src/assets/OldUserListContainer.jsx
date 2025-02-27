// components/OldUserListContainer.jsx
import { forwardRef, useImperativeHandle, useState } from "react";

// Helper function to calculate time difference
const timeAgo = (timestamp) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes`;
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours`;
  }
};

const OldUserListContainer = forwardRef(({ isLoading, scrollRef }, ref) => {
  const [users, setUsers] = useState([]);

  useImperativeHandle(ref, () => ({
    setUsers,
  }));

  return (
    <div
      ref={scrollRef}
      className="relative z-20 w-full md:w-3/4 
           h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] 
           min-h-[800px] md:min-h-[900px]
           mx-auto rounded-xl shadow-xl"
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl h-full flex flex-col">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white p-6 text-center border-b border-gray-200 dark:border-gray-700">
          Users You've Passed
        </h2>

        {/* Scrollable User List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-full h-24 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center animate-pulse"
              >
                <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 mr-4" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-1/3" />
                </div>
              </div>
            ))
          ) : users?.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className="w-full h-24 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center transition-all hover:scale-[1.01] group"
              >
                {/* Profile Image */}
                <img
                  src={user.images?.[1]?.url || "/default-avatar.png"}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  alt={user.display_name}
                />

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {user.display_name}
                  </h3>
                  <h3 className="text-gray-500">
                    {user.lastNearby
                      ? `Passed by ${timeAgo(user.lastNearby)} ago`
                      : ""}
                  </h3>
                  <span className="text-gray-800 dark:text-white text-base overflow-x-scroll italic">
                    "{user.tagline}"
                  </span>
                </div>

                {/* Spotify Link */}
                <a
                  href={user.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-3 py-1.5 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Profile
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No old users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default OldUserListContainer;
