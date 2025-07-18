import React from "react";
import Sidebar from "../Sidebar";
import { Outlet } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Index;
