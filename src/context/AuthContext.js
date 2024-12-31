import React, { createContext, useState, useEffect } from 'react';

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Load user data from localStorage on initial load (if it exists)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser)); // Parse and set the user data from localStorage
    }
  }, []);

  // Login function to store user data in state and localStorage
  const login = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user)); // Persist user to localStorage
  };

  // Logout function to clear user data and localStorage
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user'); // Clear user from localStorage
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
