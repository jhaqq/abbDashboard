"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import LabelsPanel from "../components/LabelsPanel";
import DateSelector from "../components/DateSelector";
import PickupAvailability from "../components/PickupAvailability";
import OrderSearch from "../components/OrderSearch";
import OrderDetails from "../components/OrderDetails";

const Printer = () => {
  const router = useRouter();

  // State management
  const [selectedDashboard, setSelectedDashboard] = useState("Printer");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Event handlers - navigation
  const handleDashboardChange = (dashboard: string) => {
    setSelectedDashboard(dashboard);

    // Navigate to the corresponding page
    switch (dashboard) {
      case "Customer Service":
        router.push("/customer-service");
        break;
      case "Printer":
        // Already on printer page, no need to navigate
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

  // This handles clicking on order numbers in Labels Printed
  const handleOrderClick = (orderId: string) => {
    console.log("Order clicked:", orderId);
    setSelectedOrder(orderId);
  };

  // This handles typing in the search box
  const handleOrderSearch = (searchTerm: string) => {
    console.log("Searching for:", searchTerm);
  };

  // This handles when Enter is pressed in search box
  const handleOrderFound = (orderData: any) => {
    console.log("Order found:", orderData);

    // Get all shipped orders from LabelsPanel mock data
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

    // Combine all orders (shipped and unshipped)
    const allOrders = [...mockShippedOrders, ...unshippedOrders];

    // Check if the searched order exists in our order lists
    const searchTerm = orderData.id.trim();

    const orderExists = allOrders.some((order) => {
      // Clean up both the order and search term for comparison
      // Remove "Order", "#", and whitespace in various combinations
      const cleanOrder = order.replace(/^(Order\s*)?#?\s*/i, "").trim();
      const cleanSearch = searchTerm.replace(/^(Order\s*)?#?\s*/i, "").trim();

      // Exact match of the cleaned order number
      return cleanOrder.toLowerCase() === cleanSearch.toLowerCase();
    });

    if (orderExists) {
      setSelectedOrder(orderData.id); // Set the selected order to show details
    } else {
      // Set a special state to show "order not found"
      setSelectedOrder("ORDER_NOT_FOUND");
    }
  };

  // This handles closing order details
  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Mock data
  const unshippedOrders = [
    "Order #114-5870221-9199429",
    "Order #113-8742621-6071408",
    "Order #112-3080067-7901827",
    "Order #111-3902312-6833829",
    "Order #133-1111111-1111111",
    "Order #134-2222222-2222222",
  ];

  // Dropdown options for Printer page
  const dropdownOptions = ["Customer Service", "Printer", "Manager"];

  return (
    <div className="w-full h-screen text-white overflow-hidden">
      <Header
        userName="NAME"
        location="ABB-#"
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        onDropdownChange={handleDashboardChange}
        selectedOption={selectedDashboard}
      />

      {/* Main Content */}
      <div className="pt-16 w-full h-full flex flex-col gap-2 px-2 pb-2">
        {/* TOP ROW - 3 Panels in a row */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2 min-h-0">
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
                selectedOrder={selectedOrder}
              />
            </div>
          </div>

          {/* CENTER PANEL - Date Selector + Pickup Availability */}
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

            {/* Pickup Availability */}
            <div className="flex-1 p-3 overflow-y-auto min-h-0">
              <PickupAvailability />
            </div>
          </div>

          {/* RIGHT PANEL - Order Search + Order Details */}
          <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col min-h-0">
            <div className="p-3 border-b border-slate-700 flex-shrink-0">
              <h2 className="text-lg font-semibold">Order Search</h2>
            </div>
            <div className="flex-1 p-3 overflow-hidden flex flex-col min-h-0">
              {/* Order Search - Fixed at top */}
              <div className="mb-4 flex-shrink-0">
                <div className="mb-4 flex-shrink-0">
                  <OrderSearch
                    onSearch={handleOrderSearch}
                    onOrderFound={handleOrderFound}
                  />
                </div>
              </div>

              {/* Order Details - Conditional scrolling */}
              <div className="flex-1 min-h-0">
                {selectedOrder === "ORDER_NOT_FOUND" ? (
                  // Show "Order Not Found" message - no scrollbar needed
                  <div className="text-center text-red-400 p-4">
                    <div className="mb-4">
                      <svg
                        className="w-16 h-16 mx-auto mb-4 text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833-.207 2.5 1.732 2.5z"
                        />
                      </svg>
                      <h3 className="text-lg font-semibold mb-2">
                        Order Not Found
                      </h3>
                      <p className="text-sm text-gray-400 mb-4">
                        The order number you searched for does not exist in our
                        shipped or unshipped orders.
                      </p>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded text-red-300 text-sm hover:bg-red-600/30 transition-colors cursor-pointer"
                      >
                        Clear Search
                      </button>
                    </div>
                  </div>
                ) : (
                  // Order Details with scrollbar when needed
                  <div className="overflow-y-auto scrollbar-visible h-full">
                    <OrderDetails
                      orderNumber={selectedOrder || undefined}
                      orderData={
                        selectedOrder && selectedOrder !== "ORDER_NOT_FOUND"
                          ? {
                              id: "39060312948",
                              orderNumber: selectedOrder
                                .replace(/^(Order\s*)?#?\s*/i, "")
                                .trim(),
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
                            }
                          : undefined
                      }
                      onClose={handleCloseOrderDetails}
                      showCloseButton={
                        !!selectedOrder && selectedOrder !== "ORDER_NOT_FOUND"
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW - Inventory Panel */}
        <div className="flex-1 bg-gray-800 rounded-lg overflow-hidden flex flex-col min-h-0">
          <div className="p-3 border-b border-slate-700 flex-shrink-0">
            <h2 className="text-lg font-semibold">Inventory as of #DATE#</h2>
          </div>
          <div className="flex-1 p-3 overflow-y-auto scrollbar-visible min-h-0">
            <h1>Content Here</h1>
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

export default Printer;
