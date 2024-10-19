import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./index.css";
import LandingPage from "./components/LandingPage";
import Solitaire from "./games/Solitaire";
import Durac from "./games/Durac";

function App({ signOut, user }) {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<LandingPage user={user} signOut={signOut} />}
          />
          <Route path="/solitaire" element={<Solitaire />} />
          <Route path="/durac" element={<Durac />} />
        </Routes>
      </div>
    </Router>
  );
}

export default withAuthenticator(App, {
  socialProviders: ["google"],
});
