import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./LandingPage";
import Solitaire from "./Solitaire";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/solitaire" element={<Solitaire />} />
          {/* Add more routes here as you develop more games */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
