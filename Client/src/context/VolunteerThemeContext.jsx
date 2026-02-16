import React, { createContext, useContext, useState, useEffect } from "react";

const VolunteerThemeContext = createContext();

export const VolunteerThemeProvider = ({ children }) => {
  // Check localStorage or system preference, default to 'dark' for the premium feel
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("volunteer-theme");
    return savedTheme || "dark";
  });

  useEffect(() => {
    localStorage.setItem("volunteer-theme", theme);
    // Optionally apply a class to the body or a root element if needed globally,
    // but we will handle it in the Layout for the module specific styling.
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <VolunteerThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </VolunteerThemeContext.Provider>
  );
};

export const useVolunteerTheme = () => useContext(VolunteerThemeContext);
