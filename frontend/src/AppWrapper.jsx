import { useEffect, useState } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RedirectPage from "./pages/RedirectPage";
import ProfilePage from "./pages/ProfilePage";
import BroadcastPage from "./pages/BroadcastPage";

export default function AppWrapper() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("in");

  useEffect(() => {
    console.log('Current location:', location.pathname);
    console.log('Display location:', displayLocation.pathname);
    if (location.pathname !== displayLocation.pathname) {
      console.log('Transition triggered!');
      setTransitionStage('out');
    }
  }, [location]);

  return (
    <div className=" h-screen w-screen relative">
      <div
        className={`page ${transitionStage}`}
        onAnimationEnd={() => {
          if (transitionStage === "out") {
            setTransitionStage("in");
            setDisplayLocation(location);
          }
        }}
      >
        <Routes location={displayLocation}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<RedirectPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/broadcast" element={<BroadcastPage />} />
        </Routes>
      </div>
    </div>
  );
}
