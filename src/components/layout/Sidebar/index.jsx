import React from "react";
import DesktopSidebar from "../DesktopSidebar";
import MobileSidebar from "../MobileSidebar";
import { useSidebar } from "../../../hooks/toggleContext";

const Index = () => {
  const { isMobileSidebarOpen, toggleMobileSidebar } = useSidebar();
  return (
    <div className="flex">
      <DesktopSidebar />
      <MobileSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />
    </div>
  );
};

export default Index;
