import React from "react";
import { useSidebar } from "../../../hooks/toggleContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faBell,
  faEnvelope,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const Index = () => {
  const { toggleMobileSidebar } = useSidebar();
  return (
    <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-primary-100">
      <div className="flex items-center">
        <button
          onClick={toggleMobileSidebar}
          className="mr-4 text-gray-500 hover:text-gray-600 md:hidden"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          {/* GOFFY */}
          <span className="font-bubble text-blue-500">G</span>
          <span className="font-bubble text-orange-500">O</span>
          <span className="font-bubble text-green-500">F</span>
          <span className="font-bubble text-pink-500">Y</span>
          {/* Kids */}
          <span className="font-bubble text-red-500 ml-2">K</span>
          <span className="font-bubble text-yellow-500">i</span>
          <span className="font-bubble text-green-400">d</span>
          <span className="font-bubble text-blue-400">s</span>
          {/* Mall */}
          <span className="font-bubble text-indigo-500 ml-2">M</span>
          <span className="font-bubble text-teal-500">a</span>
          <span className="font-bubble text-amber-500">l</span>
          <span className="font-bubble text-rose-500">l</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-amber-400 hover:text-amber-600 transition-colors duration-200">
          <FontAwesomeIcon icon={faBell} />
        </button>
        <button className="p-2 text-sky-400 hover:text-sky-600 transition-colors duration-200">
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-3 text-primary-300"
          />
        </div>
      </div>
    </header>
  );
};

export default Index;
