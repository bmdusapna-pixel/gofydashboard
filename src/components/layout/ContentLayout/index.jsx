import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";

const Index = () => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header />
      <Outlet />
    </div>
  );
};

export default Index;
