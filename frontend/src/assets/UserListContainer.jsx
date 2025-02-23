import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Check, Ban } from "lucide-react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

const UserListContainer = forwardRef(
  ({ isLoading, scrollRef, onRefresh }, ref) => {
    const SERVER_URL = "http://localhost:3001";
  const [users, setUsers] = useState([]);
  const [ listeningTo, setListeningTo ] = useState(null);
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
    useImperativeHandle(ref, () => ({
      setUsers,
    }));

  useEffect(() => {
    async function fetchListeningTo() {
      const body = await fetch(`${SERVER_URL}/listen`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!body.ok) {
        throw new Error("Failed to fetch listening to");
      }
      const data = await body.json();
      setListeningTo(data.listening_to);
    }
    fetchListeningTo();
  }, []);
  async function listen(userId) {
    if (listeningTo === userId) {
      const body = await fetch(`${SERVER_URL}/listen`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!body.ok) {
        throw new Error("Failed to stop listening");
      }
      setListeningTo(null);
      setStatus("success");
      setStatusMessage("Stopped listening");
      return;
    }
    const body = await fetch(`${SERVER_URL}/listen`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ host_username: userId }),
    });
    
    if (!body.ok) {
      if (body.status === 404) {
        setStatus("error");
        setStatusMessage("Please open spotify");
        throw new Error(await body.json().message);
      } else {
        setStatus("error");
        setStatusMessage("Failed to listen");
        throw new Error(await body.json().message);
      }
      return;
    }
    setListeningTo(userId);
    setStatus("success");
    setStatusMessage("Started listening");
  }

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
          Near You
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
                  src={user.images?.[1]?.url || '/default-avatar.png'}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                  alt={user.display_name}
                />

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {user.display_name}
                    </h3>
                    {user.currentSong && (
                      <div className="flex items-center mt-1 space-x-3">
                        {/* Album Art */}
                        <img
                          src={
                            user.currentSongImg?.[1]?.url ||
                            "/default-album.png"
                          }
                          className="w-8 h-8 rounded-sm"
                          alt="Current track"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          Listening to: {user.currentSong}
                        </span>
                      </div>
                    )}
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
              No nearby users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default UserListContainer;
