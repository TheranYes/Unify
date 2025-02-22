// components/UserListContainer.jsx
import { forwardRef } from "react";

const UserListContainer = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="relative z-20 w-full md:w-3/4 
           h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] 
           min-h-[800px] md:min-h-[900px]
           mx-auto rounded-xl shadow-xl"
    >
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl h-full flex flex-col">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white p-6 text-center border-b border-gray-200 dark:border-gray-700">
          Near You
        </h2>

        {/* Scrollable User List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="w-full h-24 bg-gray-100/50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center transition-all hover:scale-[1.01]"
            >
              {/* Placeholder content */}
              <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 mr-4" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
export default UserListContainer;
