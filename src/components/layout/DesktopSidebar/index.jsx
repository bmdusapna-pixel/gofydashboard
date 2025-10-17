import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faEllipsisV,
  faSignOutAlt,
  faUserCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../../../assets/images/logo.webp";

const App = ({ navItems }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState(navItems);

  useEffect(() => {
    const currentPath = location.pathname;
    let foundDropdown = null;
    for (const item of navItems) {
      if (item.type === "dropdown") {
        if (currentPath.startsWith(item.path) && item.path !== "/") {
          foundDropdown = item.name;
          break;
        }
        if (item.subItems?.some((subItem) => subItem.path === currentPath)) {
          foundDropdown = item.name;
          break;
        }
      }
    }
    setOpenDropdown(foundDropdown);
  }, [location.pathname, navItems]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(navItems);
      return;
    }

    try {
      const regex = new RegExp(searchTerm, "i");

      const filtered = navItems
        .map((item) => {
          if (item.type === "link" && regex.test(item.name)) {
            return item;
          }

          if (item.type === "dropdown") {
            // If parent name matches, include all subItems
            if (regex.test(item.name)) {
              return item;
            }

            // Otherwise, only include subItems that match
            const matchedSubs = item.subItems?.filter((sub) =>
              regex.test(sub.name)
            );

            if (matchedSubs?.length) {
              return { ...item, subItems: matchedSubs };
            }
          }

          return null;
        })
        .filter(Boolean);

      setFilteredItems(filtered);
    } catch {
      setFilteredItems(navItems);
    }
  }, [searchTerm, navItems]);

  const handleDropdownToggle = (itemName) => {
    setOpenDropdown(openDropdown === itemName ? null : itemName);
    setIsUserDropdownOpen(false);
  };

  const handleUserDropdownToggle = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setOpenDropdown(null);
  };

  const handleLinkClick = () => {
    setIsUserDropdownOpen(false);
  };

  const handleLogout = () => {
    console.log("User logged out");
    handleLinkClick();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isDropdownActive = (item) => {
    const currentPath = location.pathname;
    if (item.path === currentPath && item.path !== "/") return true;
    return item.subItems?.some((subItem) => subItem.path === currentPath);
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
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-primary-400 border-r border-custom-light">
          <div className="flex items-center justify-center h-16 px-4 bg-custom-light border-b border-custom-light">
            <img src={Logo} alt="logo" className="w-auto h-16 mr-2" />
          </div>

          <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
            {/* 🔍 Search input */}
            <div className="relative mb-4">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-3 text-primary-100"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-primary-300 placeholder-primary-100 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Navigation items */}
            <nav className="flex-1 space-y-2">
              {filteredItems.map((item) => (
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
                      {(openDropdown === item.name || searchTerm) &&
                        item.subItems?.length > 0 && (
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

            {/* 👤 User Section */}
            <div className="relative mt-2 mb-4">
              <div
                className="flex items-center p-3 bg-primary-500 rounded-lg cursor-pointer"
                onClick={handleUserDropdownToggle}
              >
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                  alt="User avatar"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    Sarah Johnson
                  </p>
                  <p className="text-xs text-primary-100">Admin</p>
                </div>
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
