import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to Card Games</h1>
      <nav>
        <ul>
          <li>
            <Link to="/solitaire">Solitaire</Link>
          </li>
          {/* Add more game links here as they are developed */}
          <li>
            <Link to="/future-game">Future Game (Coming Soon)</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default LandingPage;
