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
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentialResponse) => {
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
      } else {
        user.updatedAt = new Date().toISOString();
        await updateItem(
          "Users",
          { id: googleId },
          { updatedAt: user.updatedAt }
        );
      }

      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error during login:", error);
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
