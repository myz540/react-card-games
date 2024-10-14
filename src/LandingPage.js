import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { createItem, getItem } from "./utils/dynamodb";

const LandingPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { sub: googleId, name, email } = decoded;

    try {
      let user = await getItem("Users", { id: googleId });

      if (!user) {
        user = {
          id: googleId,
          name,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await createItem("Users", user);
      }

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error handling login:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  if (!user) {
    return (
      <div className="landing-page">
        <h1>Welcome to Card Games</h1>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    );
  }

  return (
    <div className="landing-page">
      <h1>Welcome to Card Games, {user.name}!</h1>
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
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default LandingPage;
