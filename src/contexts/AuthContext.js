import React, { createContext, useState, useEffect, useContext } from "react";
import { getItem, createItem, updateItem } from "../utils/dynamodb";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("Stored user found:", JSON.parse(storedUser));
      setUser(JSON.parse(storedUser));
    } else {
      console.log("No stored user found");
    }
    setLoading(false);
  }, []);

  const login = async (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const { sub: googleId, name, email } = decoded;

    try {
      console.log("Attempting to get user from DynamoDB:", googleId);
      let user = await getItem("Users", { id: googleId });
      console.log("User from DynamoDB:", user);

      if (!user) {
        console.log("User not found. Creating new user.");
        user = {
          id: googleId,
          name,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        console.log("New user object:", user);
        await createItem("Users", user);
        console.log("New user created in DynamoDB");
      } else {
        console.log("Existing user found. Updating lastLogin.");
        user.updatedAt = new Date().toISOString();
        console.log("Updating user in DynamoDB:", user);
        await updateItem(
          "Users",
          { id: googleId },
          { updatedAt: user.updatedAt }
        );
        console.log("User updated in DynamoDB");
      }

      console.log("Setting user in state:", user);
      setUser(user);
      console.log("Storing user in localStorage");
      localStorage.setItem("user", JSON.stringify(user));
      console.log("Login process completed successfully");
    } catch (error) {
      console.error("Error during login:", error);
      console.error("Error details:", error.message);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
