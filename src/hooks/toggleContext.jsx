// sidebarContext.js
import React, { createContext, useState, useContext } from "react";

// 1. Create the Context
// It holds the state of the mobile sidebar (open/closed) and a function to update it.
const SidebarContext = createContext(null);

// 2. Create a Provider Component
// This component will wrap parts of your application that need access to the sidebar state.
// It manages the 'isMobileSidebarOpen' state and provides it to its children.
export const SidebarProvider = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Function to toggle the sidebar's open/closed state
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  // The value provided to consumers of this context
  const contextValue = {
    isMobileSidebarOpen,
    setMobileSidebarOpen: setIsMobileSidebarOpen, // Allow direct setting
    toggleMobileSidebar, // Provide a convenient toggle function
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

// 3. Create a Custom Hook to Consume the Context
// This makes it easier for components to access the sidebar state and functions.
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    // This check ensures the hook is used within a SidebarProvider
    console.error("useSidebar must be used within a SidebarProvider");
    // Provide a fallback to prevent crashes if used incorrectly, though a warning is also issued.
    return {
      isMobileSidebarOpen: false,
      setMobileSidebarOpen: () =>
        console.warn("setMobileSidebarOpen called outside SidebarProvider"),
      toggleMobileSidebar: () =>
        console.warn("toggleMobileSidebar called outside SidebarProvider"),
    };
  }
  return context;
};
