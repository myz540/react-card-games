import React from "react";
import { Link } from "react-router-dom";

const LandingPage = ({ user, signOut }) => {
  return (
    <div className="landing-page">
      <h1>Welcome to Card Games, {user.username}!</h1>
      <nav>
        <ul>
          <li>
            <Link to="/solitaire">Solitaire</Link>
          </li>
          <li>
            <Link to="/future-game">Future Game (Coming Soon)</Link>
          </li>
        </ul>
      </nav>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default LandingPage;
