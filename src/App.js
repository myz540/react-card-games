import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LandingPage from "./LandingPage";
import Solitaire from "./Solitaire";

function App() {
  return (
    <GoogleOAuthProvider clientId="638086351716-32tfmv9r4da45v1rb8j4g29qdihv56ho.apps.googleusercontent.com">
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/solitaire" element={<Solitaire />} />
            {/* Add more routes here as you develop more games */}
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
