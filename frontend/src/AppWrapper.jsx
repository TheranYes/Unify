import { AnimatePresence } from "framer-motion";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RedirectPage from "./pages/RedirectPage";
import ProfilePage from "./pages/ProfilePage";
import BroadcastPage from "./pages/BroadcastPage";

export default function AppWrapper() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-800/80 transition-colors duration-300">
      {/* Fixed background layer */}
      <div className="fixed inset-0 bg-orange-100 dark:bg-slate-800 -z-10" />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<RedirectPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/broadcast" element={<BroadcastPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
