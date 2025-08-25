import React from "react";
import DesktopSidebar from "../DesktopSidebar";
import MobileSidebar from "../MobileSidebar";
import { useSidebar } from "../../../hooks/toggleContext";
import { navItems } from "./Links";

const Index = () => {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useSidebar();
  return (
    <div className="flex">
      <DesktopSidebar navItems={navItems} />
      <MobileSidebar
        navItems={navItems}
        isMobileSidebarOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />
    </div>
  );
};

export default Index;
