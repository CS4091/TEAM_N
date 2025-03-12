import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import ProjectLandingPage from "./main_page";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Landing page (default route) */}
        <Route path="/" element={<ProjectLandingPage />} />

        {/* App page */}
        <Route path="/app" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
