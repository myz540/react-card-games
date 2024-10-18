import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import LandingPage from "./LandingPage";
import Solitaire from "./Solitaire";

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
        </Routes>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);
