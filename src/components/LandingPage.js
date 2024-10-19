import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = ({ user, signOut }) => {
  console.log("Full user object:", user);
  console.log("User attributes:", user.attributes);

  const displayName = user.attributes?.email?.split("@")[0] || user.username;
  return (
    <div className="landing-page">
      <h1>Welcome to Card Games, {displayName}!</h1>
      <nav>
        <ul>
          <li>
            <Link to="/solitaire">Solitaire</Link>
          </li>
          <li>
            <Link to="/durac">Durac</Link>
          </li>
        </ul>
      </nav>
      <button onClick={signOut} className="sign-out-button">
        Sign out
      </button>
    </div>
  );
};

export default LandingPage;
