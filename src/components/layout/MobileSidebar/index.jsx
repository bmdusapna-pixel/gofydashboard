import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // Import NavLink and useLocation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faChevronDown,
  faChevronUp,
  faEllipsisV, // New: for user dropdown toggle
  faUserCircle, // New: for profile link
  faSignOutAlt, // New: for logout link
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../assets/images/logo.webp"; // Using the specified path

// This component is designed to be a standalone mobile sidebar.
// It assumes `isMobileSidebarOpen` and `toggleMobileSidebar` are passed as props
// from a parent component that controls its overall visibility.
const App = ({ isMobileSidebarOpen, toggleMobileSidebar, navItems }) => {
  const location = useLocation(); // Get the current location object
  const navigate = useNavigate();
  // State to manage which dropdown is currently open (e.g., "Products", "Categories", "Orders", or null)
  const [openDropdown, setOpenDropdown] = useState(null);
  // State to manage the user dropdown visibility
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Effect to open the relevant dropdown on initial load or path change
  useEffect(() => {
    // Find if the current path belongs to any dropdown's sub-items
    const currentPath = location.pathname;
    let foundDropdown = null;
    for (const item of navItems) {
      if (item.type === "dropdown") {
        // Check if the current path starts with the dropdown's base path
        // and is not just the root path "/" (to avoid opening all dropdowns on dashboard)
        if (currentPath.startsWith(item.path) && item.path !== "/") {
          foundDropdown = item.name;
          break;
        }
        // Also check if any sub-item path matches exactly
        if (item.subItems.some((subItem) => subItem.path === currentPath)) {
          foundDropdown = item.name;
          break;
        }
      }
    }
    setOpenDropdown(foundDropdown);
  }, [location.pathname, navItems]); // Re-run when the path changes

  /**
   * Toggles the visibility of a dropdown menu.
   * If the clicked item's dropdown is already open, it closes it.
   * Otherwise, it opens the clicked item's dropdown.
   * @param {string} itemName - The name of the navigation item whose dropdown is to be toggled.
   */
  const handleDropdownToggle = (itemName) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
  };

  /**
   * Toggles the visibility of the user account dropdown.
   */
  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  /**
   * Handles logout action.
   * This is a placeholder function. In a real app, you would implement
   * actual logout logic (e.g., clearing tokens, redirecting).
   */
  const handleLogout = () => {
    console.log("User logged out!");
    // Close the user dropdown
    setIsUserDropdownOpen(false);
    // Optionally, close the mobile sidebar
    if (toggleMobileSidebar) {
      toggleMobileSidebar();
    }
    localStorage.removeItem("token");
    navigate("/login");
    // Implement actual logout logic here (e.g., redirect to login page)
  };

  /**
   * Handles clicks on navigation links.
   * Closes the mobile sidebar if it's open.
   * Also closes the user dropdown if it's open.
   */
  const handleLinkClick = () => {
    if (toggleMobileSidebar) {
      // Check if toggleMobileSidebar prop is provided
      toggleMobileSidebar();
    }
    // Close user dropdown when any link is clicked
    setIsUserDropdownOpen(false);
  };

  /**
   * Determines if a dropdown should be considered "active" for styling.
   * A dropdown is active if its base path matches the current path, or if any of its sub-items match.
   * @param {object} item - The navigation item (dropdown type).
   * @returns {boolean} - True if the dropdown or any of its sub-items are active.
   */
  const isDropdownActive = (item) => {
    const currentPath = location.pathname;
    // Check if the current path is the base path of the dropdown (exact match, but not for '/')
    if (item.path === currentPath && item.path !== "/") {
      return true;
    }
    // Check if any sub-item path matches the current path
    return item.subItems.some((subItem) =>
      currentPath.startsWith(subItem.path)
    );
  };

  // Common Tailwind CSS classes for active and inactive links
  const baseLinkClasses =
    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200";
  const activeLinkClasses = "text-white bg-primary-500";
  const inactiveLinkClasses =
    "text-primary-50 hover:bg-primary-500 hover:text-white";
  const activeIconClasses = "text-white";
  const inactiveIconClasses = "text-primary-100";

  return (
    <>
      {/* Mobile Sidebar (visible on small screens, hidden on md and up) */}
      <div
        className={`md:hidden fixed inset-0 z-40 h-full transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Overlay for mobile sidebar, closes sidebar on click */}
        <div
          className="fixed inset-0 bg-transparent bg-opacity-75 transition-opacity duration-300 ease-in-out" // Reverted to bg-transparent
          aria-hidden="true"
          onClick={toggleMobileSidebar} // Close sidebar when clicking overlay
        />
        {/* Mobile sidebar content */}
        <div className="relative flex flex-col w-full max-w-xs h-full bg-primary-400">
          <div className="flex items-center justify-between h-16 px-4 bg-custom-light border-b border-custom-light">
            <div className="flex items-center">
              <img src={Logo} alt="logo" className="w-auto h-16 mr-2" />
            </div>
            {/* Close button for mobile sidebar */}
            <button
              onClick={toggleMobileSidebar}
              className="text-primary-400 hover:text-primary-300"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
            {/* Navigation for mobile */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.type === "link" ? (
                    // Regular navigation link using NavLink
                    <NavLink
                      to={item.path}
                      onClick={handleLinkClick}
                      // isActive is provided by NavLink's render prop
                      className={({ isActive }) =>
                        `${baseLinkClasses} ${
                          isActive ? activeLinkClasses : inactiveLinkClasses
                        }`
                      }
                      end={item.path === "/"} // Use 'end' for exact match on '/'
                    >
                      {({ isActive }) => (
                        <>
                          <FontAwesomeIcon
                            icon={item.icon}
                            className={`mr-3 ${
                              isActive ? activeIconClasses : inactiveIconClasses
                            }`}
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  ) : (
                    // Dropdown navigation item
                    <>
                      <button
                        onClick={() => handleDropdownToggle(item.name)}
                        className={`${baseLinkClasses} justify-between w-full ${
                          isDropdownActive(item) || openDropdown === item.name
                            ? activeLinkClasses
                            : inactiveLinkClasses
                        }`}
                      >
                        <div className="flex items-center">
                          <FontAwesomeIcon
                            icon={item.icon}
                            className={`mr-3 ${
                              isDropdownActive(item) ||
                              openDropdown === item.name
                                ? activeIconClasses
                                : inactiveIconClasses
                            }`}
                          />
                          {item.name}
                        </div>
                        <FontAwesomeIcon
                          icon={
                            openDropdown === item.name
                              ? faChevronUp
                              : faChevronDown
                          }
                          className="text-xs text-primary-100 transition-transform duration-200"
                        />
                      </button>
                      {/* Sub-items for the dropdown */}
                      {openDropdown === item.name && (
                        <div className="pl-8 space-y-1">
                          {item.subItems.map((subItem) => (
                            <NavLink
                              key={subItem.name}
                              to={subItem.path}
                              onClick={handleLinkClick}
                              className={({ isActive }) =>
                                `block px-4 py-2 text-sm rounded-lg transition-colors duration-200 ${
                                  isActive
                                    ? "text-white bg-primary-500"
                                    : "text-primary-50 hover:bg-primary-500 hover:text-white"
                                }`
                              }
                            >
                              {subItem.name}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </nav>
            {/* User account section with dropdown */}
            <div className="relative mt-2 mb-4">
              {/* Parent div now handles the click */}
              <div
                className="flex items-center p-3 bg-primary-500 rounded-lg cursor-pointer"
                onClick={handleUserDropdownToggle}
              >
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="User avatar"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    Sarah Johnson
                  </p>
                  <p className="text-xs text-primary-100">Admin</p>
                </div>
                {/* Remove onClick from the button, it's now just a visual icon */}
                <button className="ml-auto text-primary-100 hover:text-white pointer-events-none">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </button>
              </div>
              {isUserDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg py-1 z-10">
                  <NavLink
                    to="/profile"
                    onClick={handleLinkClick}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
