"use client";

import { useState } from "react";
import Header from "../Components/Header";
import Panel from "../Components/Panel";
import LabelsPanel from "../Components/LabelsPanel";
import DateSelector from "../Components/DateSelector";
import OrderSearch from "../Components/OrderSearch";
import OrderDetails from "../Components/OrderDetails";

const CsDashboard = () => {
  const [selectedDashboard, setSelectedDashboard] =
    useState("Customer Service");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedDays, setSelectedDays] = useState<string[]>([]); // Changed to empty array for unchecked default
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

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
    "Order #140-8888888-8888888"
  ];

  const handleDashboardChange = (dashboard: string) => {
    setSelectedDashboard(dashboard);
    
    // You can add different logic here for each dashboard type
    switch(dashboard) {
      case "Customer Service":
        // Customer Service dashboard logic
        break;
      case "Warehouse":
        // Warehouse dashboard logic
        break;
      case "Printer":
        // Printer dashboard logic
        break;
      case "Manager":
        // Manager dashboard logic
        break;
      default:
        // Unknown dashboard
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
    // Here you would fetch order details
    setSelectedOrder(orderId);
  };

  const handleOrderSearch = (searchTerm: string) => {
    console.log("Searching for:", searchTerm);
  };

  const handleOrderFound = (orderData: any) => {
    console.log("Order found:", orderData);
    setSelectedOrder(orderData.id);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrder(null);
  };

  const dropdownOptions = [
    "Customer Service",
    "Warehouse",
    "Printer",
    "Manager",
  ];

  return (
    <div className="w-full h-screen text-white overflow-hidden">
      <Header
        userName="NAME"
        showDropdown={true}
        dropdownOptions={dropdownOptions}
        onDropdownChange={handleDashboardChange}
        selectedOption={selectedDashboard} // Pass the selected option
      />

      <div className="pt-16 h-full flex flex-col md:flex-row relative overflow-hidden">
        {/* Show current dashboard in the UI for testing */}
        <div className="absolute top-16 left-4 z-10 bg-slate-800 px-2 py-1 rounded text-sm">
          Current: {selectedDashboard}
        </div>

        {/* Left Panel - Labels Printed - Wider panels */}
        <div className="w-full md:w-[420px] lg:w-[480px] xl:w-[520px] md:absolute md:top-0 md:bottom-0 md:left-0 md:pt-16 h-full overflow-hidden">
          <div className="h-full max-h-full overflow-hidden">
            <Panel title="Labels Printed" width="full" borderSide="right">
              <LabelsPanel
                shippedOrders={[]}
                unshippedOrders={unshippedOrders}
                onOrderClick={handleOrderClick}
                selectedOrder={selectedOrder}
              />
            </Panel>
          </div>
        </div>

        {/* Center Area - Date Selector + Middle Panel - Smaller center area */}
        <div className="flex-1 md:mx-[420px] lg:mx-[480px] xl:mx-[520px] flex flex-col h-full overflow-hidden">
          {/* Date Selector - Outside and above the middle panel */}
          <div className="px-4 py-6 flex justify-center flex-shrink-0">
            <DateSelector
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
              selectedDays={selectedDays}
              onDayToggle={handleDayToggle}
            />
          </div>

          {/* Middle Panel - Order Search and Details */}
          <div className="flex-1 overflow-hidden">
            <Panel width="full">
              <div className="flex flex-col h-full">
                {/* Order Search at the top */}
                <div className="mb-6 flex-shrink-0">
                  <OrderSearch
                    onSearch={handleOrderSearch}
                    onOrderFound={handleOrderFound}
                  />
                </div>

                {/* Order Details - takes remaining space */}
                <div className="flex-1 overflow-hidden">
                  <OrderDetails
                    orderNumber={selectedOrder || undefined}
                    orderData={
                      selectedOrder
                        ? {
                            id: "39060312948",
                            orderNumber: selectedOrder,
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
                                upc: "850015891045"
                              }
                            ]
                          }
                        : undefined
                    }
                    onClose={handleCloseOrderDetails}
                    showCloseButton={!!selectedOrder}
                  />
                </div>
              </div>
            </Panel>
          </div>
        </div>

        {/* Right Panel - Left Behind - Wider panels */}
        <div className="w-full md:w-[420px] lg:w-[480px] xl:w-[520px] md:absolute md:top-0 md:bottom-0 md:right-0 md:pt-16 h-full overflow-hidden">
          <div className="h-full max-h-full overflow-hidden">
            <Panel title="Left Behind (#)" width="full" borderSide="left">
              <div className="text-green-400">
                Order # 123-123456789-54321 - ABB1
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsDashboard;