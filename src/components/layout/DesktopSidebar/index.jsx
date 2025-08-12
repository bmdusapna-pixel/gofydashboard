import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBoxOpen,
  faChevronDown,
  faChevronUp,
  faTags,
  faShoppingCart,
  faUsers,
  faEllipsisV,
  faTimes,
  faClipboardList,
  faFileInvoiceDollar,
  faSignOutAlt,
  faUserCircle,
  faLayerGroup,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../assets/images/logo.webp";

// Define your navigation items with updated paths
const navItems = [
  { name: "Dashboard", icon: faHome, path: "/", type: "link" },
  {
    name: "Products",
    icon: faBoxOpen,
    type: "dropdown",
    path: "/products", // Base path for dropdown
    subItems: [
      { name: "All Products", path: "/products/list" },
      { name: "Add New", path: "/products/add-new" },
      // Removed Inventory from here
    ],
  },
  {
    name: "Categories",
    icon: faTags,
    type: "dropdown",
    path: "/categories", // Base path for dropdown
    subItems: [
      { name: "All Categories", path: "/categories/list" },
      { name: "Add New", path: "/categories/add-new" },
      { name: "Age Groups", path: "/age-groups" },
    ],
  },
  {
    name: "Collections",
    icon: faLayerGroup,
    type: "dropdown",
    path: "/collections", // Base path for dropdown
    subItems: [
      { name: "All Collections", path: "/collections/list" },
      { name: "Add Collection", path: "/collections/add-collection" },
    ],
  },
  {
    name: "Inventory", // New top-level item
    icon: faClipboardList, // Using a new icon for Inventory
    type: "dropdown",
    path: "/inventory", // Base path for Inventory dropdown
    subItems: [
      { name: "Received Orders", path: "/received" },
      { name: "Warehouse", path: "/inventory/warehouse" }, // Warehouse as a sub-item
    ],
  },
  {
    name: "Orders",
    icon: faShoppingCart,
    type: "dropdown",
    path: "/orders", // Base path for dropdown
    subItems: [{ name: "All Orders", path: "/orders" }],
  },
  {
    name: "Purchase",
    icon: faClipboardList,
    type: "dropdown",
    subItems: [
      {
        name: "List",
        path: "/purchase/list",
      },
      {
        name: "Order",
        path: "/purchase/order",
      },
      {
        name: "Return",
        path: "/purchase/return",
      },
    ],
  },
  {
    name: "Invoices",
    icon: faFileInvoiceDollar,
    path: "/invoices",
    type: "link",
  }, // Added Invoices
  {
    name: "Banners",
    icon: faFileInvoiceDollar,
    path: "/banners",
    type: "link",
  },
  {
    name: "Filter",
    icon: faPalette,
    subItems: [
      { name: "Color", path: "/color" },
      { name: "Material", path: "/material" },
    ],
    type: "dropdown",
  },
  { name: "Customers", icon: faUsers, path: "/customers", type: "link" },
];

const App = ({ isMobileSidebarOpen, toggleMobileSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    let foundDropdown = null;
    for (const item of navItems) {
      if (item.type === "dropdown") {
        if (currentPath.startsWith(item.path) && item.path !== "/") {
          foundDropdown = item.name;
          break;
        }
        if (item.subItems.some((subItem) => subItem.path === currentPath)) {
          foundDropdown = item.name;
          break;
        }
      }
    }
    setOpenDropdown(foundDropdown);
  }, [location.pathname]);

  const handleDropdownToggle = (itemName) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
    setIsUserDropdownOpen(false); // Close user dropdown when other dropdowns are toggled
  };

  // This handler will now be on the parent div
  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setOpenDropdown(null); // Close other dropdowns when user dropdown is toggled
  };

  const handleLinkClick = () => {
    if (isMobileSidebarOpen && toggleMobileSidebar) {
      toggleMobileSidebar();
    }
    setIsUserDropdownOpen(false); // Close user dropdown when any link is clicked
  };

  const handleLogout = () => {
    // Perform logout logic here (e.g., clear tokens, session storage)
    console.log("User logged out");
    handleLinkClick();
    navigate("/login");
  };

  const isDropdownActive = (item) => {
    const currentPath = location.pathname;
    if (item.path === currentPath && item.path !== "/") {
      return true;
    }
    return item.subItems.some((subItem) => subItem.path === currentPath);
  };

  const baseLinkClasses =
    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200";
  const activeLinkClasses = "text-white bg-primary-500";
  const inactiveLinkClasses =
    "text-primary-50 hover:bg-primary-500 hover:text-white";
  const activeIconClasses = "text-white";
  const inactiveIconClasses = "text-primary-100";

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 z-40 h-full transform transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-in-out"
          aria-hidden="true"
          onClick={toggleMobileSidebar}
        />
        <div className="relative flex flex-col w-full max-w-xs h-full bg-primary-400">
          <div className="flex items-center justify-between h-16 px-4 bg-custom-light border-b border-custom-light">
            <div className="flex items-center">
              <img src={Logo} alt="logo" className="w-auto h-16 mr-2" />
            </div>
            <button
              onClick={toggleMobileSidebar}
              className="text-primary-400 hover:text-primary-300"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.type === "link" ? (
                    <NavLink
                      to={item.path}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `${baseLinkClasses} ${
                          isActive ? activeLinkClasses : inactiveLinkClasses
                        }`
                      }
                      end={item.path === "/"}
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
            <div className="relative mt-auto mb-4">
              {/* Parent div now handles the click */}
              <div
                className="flex items-center p-3 bg-primary-500 rounded-lg cursor-pointer" // Add cursor-pointer for better UX
                onClick={handleUserDropdownToggle} // Attach handler here
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
                  {" "}
                  {/* Optional: Add pointer-events-none */}
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

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-primary-400 border-r border-custom-light">
          <div className="flex items-center justify-center h-16 px-4 bg-custom-light border-b border-custom-light">
            <div className="flex items-center">
              <img src={Logo} alt="logo" className="w-auto h-16 mr-2" />
            </div>
          </div>
          <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.type === "link" ? (
                    <NavLink
                      to={item.path}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `${baseLinkClasses} ${
                          isActive ? activeLinkClasses : inactiveLinkClasses
                        }`
                      }
                      end={item.path === "/"}
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
            <div className="relative mt-auto mb-4">
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
