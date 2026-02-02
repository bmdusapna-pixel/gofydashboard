import React, { useMemo } from "react";
import DesktopSidebar from "../DesktopSidebar";
import MobileSidebar from "../MobileSidebar";
import { useSidebar } from "../../../hooks/toggleContext";
import { navItems } from "./Links";
import { filterSidebarByRole } from "../../../utils/roleBasedSidebar";

const Index = () => {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useSidebar();
  
  // Get user role from sessionStorage and filter sidebar items
  const filteredNavItems = useMemo(() => {
    const role = sessionStorage.getItem("adminRole");
    const token = sessionStorage.getItem("adminToken");
    
    // If no token, return empty array (user should login)
    if (!token) {
      return [];
    }
    
    // If no role but token exists, return all items (fallback - should not happen after login)
    // In production, you might want to fetch profile here
    if (!role) {
      console.warn("Role not found in sessionStorage, showing all items as fallback");
      return navItems;
    }
    
    return filterSidebarByRole(navItems, role);
  }, []);

  return (
    <div className="flex">
      <DesktopSidebar navItems={filteredNavItems} />
      <MobileSidebar
        navItems={filteredNavItems}
        isMobileSidebarOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />
    </div>
  );
};

export default Index;
