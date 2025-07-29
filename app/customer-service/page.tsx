"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../Components/Header";
import LabelsPanel from "../Components/LabelsPanel";
import DateSelector from "../Components/DateSelector";
import OrderSearch from "../Components/OrderSearch";

const CsDashboard = () => {
  const router = useRouter();

  const [selectedDashboard, setSelectedDashboard] =
    useState("Customer Service");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedOrderFromPanel, setSelectedOrderFromPanel] = useState<
    string | null
  >(null);

  // Mock data - replace with real data later
  const unshippedOrders = [
    "Order #114-5870221-9199429",
    "Order #113-8742621-6071408",
    "Order #112-3080067-7901827",
    "Order #111-3902312-6833829",
    "Order #133-1111111-1111111",
    "Order #134-2222222-2222222",
    "Order #135-3333333-3333333",
    "Order #136-4444444-4444444",
    "Order #137-5555555-5555555",
    "Order #138-6666666-6666666",
    "Order #139-7777777-7777777",
    "Order #140-8888888-8888888",
  ];

  const mockShippedOrders = [
    "Order #113-2565431-7744232",
    "Order #112-4102767-8543429",
    "Order #115-7128507-6526632",
    "Order #118-9876543-1234567",
    "Order #113-8292160-4582667",
    "Order #216205-1",
    "Order #216206",
    "Order #216207-2",
    "Order #112-9300928-7129830",
    "Order #111-1520400-0921820",
    "Order #119-8348262-9536234",
    "Order #113-3273216-9601051",
    "Order #120-0366922-6617039",
    "Order #121-5870221-9199429",
    "Order #122-8742621-6071408",
    "Order #123-3080067-7901827",
    "Order #124-3902312-6833829",
    "Order #125-9876543-2109876",
    "Order #126-1234567-8901234",
    "Order #127-5555555-5555555",
    "Order #128-1111111-1111111",
    "Order #129-2222222-2222222",
    "Order #130-3333333-3333333",
    "Order #131-4444444-4444444",
    "Order #132-6666666-6666666",
    "Order #133-7777777-77777777",
    "Order #134-8888888-8888888",
    "Order #135-9999998-9999999",
    "Order #136-0000000-0000000",
  ];

  const handleDashboardChange = (dashboard: string) => {
    setSelectedDashboard(dashboard);

    // Navigate to the corresponding page
    switch (dashboard) {
      case "Customer Service":
        // Already on CS dashboard, no need to navigate
        break;
      case "Printer":
        // For now, show alert since printer page doesn't exist yet
        router.push("/printer");
        break;
      case "Manager":
        router.push("/manager");
        break;
      default:
        // Unknown dashboard
        console.log("Unknown dashboard:", dashboard);
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleOrderClick = (orderId: string) => {
    console.log("Order clicked:", orderId);
    // Set the order to be displayed in OrderSearch
    setSelectedOrderFromPanel(orderId);
  };

  const handleOrderSearch = (searchTerm: string) => {
    console.log("Searching for:", searchTerm);
  };

  // Database-ready function - replace with actual database call
  const fetchOrderDetails = async (orderNumber: string) => {
    try {
      // For now, return mock data
      return {
        id: "39060312948",
        orderNumber: orderNumber,
        location: "ABB - 8",
        shipped: true,
        carrier: "FEDEX",
        store: "Shopify",
        primeStatus: false,
        priority: 1,
        timestamp: "7/2/2025, 10:40:54 AM",
        items: [
          {
            name: "3/16 12 Double - (2 rolls)",
            sku: "316-12inch-17SQ2",
            upc: "850015891045",
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching order details:", error);
      return null;
    }
  };

  // Updated dropdown options - removed "Warehouse"
  const dropdownOptions = ["Customer Service", "Printer", "Manager"];

  return (
    <div className="w-full h-screen text-white overflow-hidden">
      <Header
        userName="NAME"
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        onDropdownChange={handleDashboardChange}
        selectedOption={selectedDashboard}
      />

      {/* Main Content - 3 Panel Grid Layout matching Manager style */}
      <div
        className="pt-16 w-full grid grid-cols-1 md:grid-cols-3 gap-2 px-2 pb-2"
        style={{ height: "100vh" }}
      >
        {/* LEFT PANEL - Labels Printed */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col min-h-0">
          <div className="p-3 border-b border-slate-700 flex-shrink-0">
            <h2 className="text-lg font-semibold">Labels Printed</h2>
          </div>
          <div className="flex-1 p-3 overflow-hidden min-h-0">
            <LabelsPanel
              shippedOrders={[]}
              unshippedOrders={unshippedOrders}
              onOrderClick={handleOrderClick}
              selectedOrder={selectedOrderFromPanel}
            />
          </div>
        </div>

        {/* CENTER PANEL - Date Selector + Order Search and Details */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col min-h-0">
          {/* Date Selector - Fixed at top inside panel */}
          <div className="p-3 border-b border-slate-700 flex-shrink-0">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              selectedDays={selectedDays}
              onDayToggle={handleDayToggle}
            />
          </div>

          {/* Order Search and Details */}
          <div className="flex-1 p-3 overflow-hidden min-h-0">
            <OrderSearch
              onSearch={handleOrderSearch}
              shippedOrders={mockShippedOrders}
              unshippedOrders={unshippedOrders}
              onFetchOrderDetails={fetchOrderDetails}
              selectedOrderFromPanel={selectedOrderFromPanel}
            />
          </div>
        </div>

        {/* RIGHT PANEL - Left Behind */}
        <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col min-h-0">
          <div className="p-3 border-b border-slate-700 flex-shrink-0">
            <h2 className="text-lg font-semibold">Left Behind (#)</h2>
          </div>
          <div className="flex-1 p-3 overflow-y-auto scrollbar-visible min-h-0">
            <div className="text-green-400">
              Order # 123-123456789-54321 - ABB1
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Custom scrollbar styles - consistent across all panels */
        .scrollbar-visible {
          scrollbar-width: thin;
          scrollbar-color: #6b7280 #374151;
        }

        .scrollbar-visible::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-visible::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 4px;
          border: 1px solid #4b5563;
        }

        .scrollbar-visible::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 4px;
          border: 1px solid #4b5563;
        }

        .scrollbar-visible::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .scrollbar-visible::-webkit-scrollbar-thumb:active {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default CsDashboard;
