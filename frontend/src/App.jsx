// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RedirectPage from "./pages/RedirectPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Home />} />

        {/* Route for the login page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<RedirectPage />} />
      </Routes>
    </Router>
  );
}

export default App;
