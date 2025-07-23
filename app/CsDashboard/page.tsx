"use client"

import Image from "next/image";
import Header from "../Components/Header";
import { useState } from "react";

const CsDashboard = () => {
  const [selectedDashboard, setSelectedDashboard] =
    useState("Customer Service");

  const handleDashboardChange = (dashboard: string) => {
    setSelectedDashboard(dashboard);
    //navigation to switch dashboards here
  };

  const dropdownOptions = [
    "Customer Service",
    "Warehouse",
    "Printer",
    "Manager",
  ];

  return (
    <div className="w-full h-screen text-white">
      <Header
        userName="NAME"
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        onDropdownChange={handleDashboardChange}
      />

      <div className="pt-16 h-full flex">
        {/* panels */}
      </div>
    </div>
  );
};

export default CsDashboard;
