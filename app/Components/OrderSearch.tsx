import { useState, useRef, useEffect } from "react";

interface OrderData {
  id?: string;
  orderNumber?: string;
  location?: string;
  shipped?: boolean;
  carrier?: string;
  store?: string;
  primeStatus?: boolean;
  priority?: number;
  timestamp?: string;
  items?: Array<{
    name: string;
    sku: string;
    upc: string;
  }>;
}

interface OrderSearchProps {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
  // Database-ready props - these would be passed from parent with real data
  shippedOrders?: string[];
  unshippedOrders?: string[];
  // Database function to fetch order details
  onFetchOrderDetails?: (orderNumber: string) => Promise<OrderData | null>;
  // External order click from LabelsPanel
  selectedOrderFromPanel?: string | null;
}

const OrderSearch: React.FC<OrderSearchProps> = ({
  placeholder = "Order or Tracking Number.....",
  onSearch,
  shippedOrders = [],
  unshippedOrders = [],
  onFetchOrderDetails,
  selectedOrderFromPanel,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [searchState, setSearchState] = useState<
    "idle" | "found" | "not_found" | "loading"
  >("idle");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle external order selection from LabelsPanel
  useEffect(() => {
    if (selectedOrderFromPanel) {
      handleSearch(selectedOrderFromPanel);
    }
  }, [selectedOrderFromPanel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);

    // Reset search state when user starts typing again
    if (searchState !== "idle") {
      setSearchState("idle");
      setSelectedOrder(null);
      setOrderData(null);
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      await handleSearch(searchTerm.trim());
    }
  };

  const handleSearch = async (searchValue: string) => {
    console.log("Searching for:", searchValue);
    setSearchState("loading");

    // Combine all orders for search
    const allOrders = [...shippedOrders, ...unshippedOrders];

    // Clean search term for comparison
    const cleanSearch = searchValue.replace(/^(Order\s*)?#?\s*/i, "").trim();

    // Check if order exists in our lists
    const orderExists = allOrders.some((order) => {
      const cleanOrder = order.replace(/^(Order\s*)?#?\s*/i, "").trim();
      return cleanOrder.toLowerCase() === cleanSearch.toLowerCase();
    });

    if (orderExists) {
      setSelectedOrder(searchValue);
      setSearchState("found");

      // Fetch order details - either from database or mock data
      try {
        let details: OrderData | null = null;

        if (onFetchOrderDetails) {
          // Use database function if provided
          details = await onFetchOrderDetails(cleanSearch);
        } else {
          // Fall back to mock data
          details = {
            id: "39060312948",
            orderNumber: cleanSearch,
            location: "ABB - 8",
            shipped: true,
            carrier: "FEDEX",
            store: "Shopify",
            primeStatus: false,
            priority: 1,
            timestamp: new Date().toLocaleString(),
            items: [
              {
                name: "3/16 12 Double - (2 rolls)",
                sku: "316-12inch-17SQ2",
                upc: "850015891045",
              },
            ],
          };
        }

        setOrderData(details);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setSearchState("not_found");
      }
    } else {
      setSearchState("not_found");
      setSelectedOrder(null);
      setOrderData(null);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedOrder(null);
    setOrderData(null);
    setSearchState("idle");
    // Focus the search input after clearing
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  const renderOrderDetails = () => {
    if (!orderData) return null;

    return (
      <div className="space-y-4 h-full flex flex-col">
        {/* Order Number Header */}
        <div className="text-green-400 font-medium flex-shrink-0">
          Order # {orderData.orderNumber}
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto scrollbar-visible min-h-0">
          {/* Order Details Section */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Order Details</h3>

            <div className="space-y-2 text-sm">
              <div>
                <strong>ID:</strong> {orderData.id}
              </div>
              <div>
                <strong>Order Number:</strong> {orderData.orderNumber}
              </div>
              <div>
                <strong>Location:</strong> {orderData.location}
              </div>
              <div>
                <strong>Shipped:</strong> {orderData.shipped ? "Yes" : "No"}
              </div>
              <div>
                <strong>Carrier:</strong> {orderData.carrier}
              </div>
              <div>
                <strong>Store:</strong> {orderData.store}
              </div>
              <div>
                <strong>Prime Status:</strong>{" "}
                {orderData.primeStatus ? "Yes" : "No"}
              </div>
              <div>
                <strong>Priority:</strong> {orderData.priority}
              </div>
              <div>
                <strong>Timestamp:</strong> {orderData.timestamp}
              </div>
            </div>
          </div>

          {/* Items Section */}
          {orderData.items && orderData.items.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">Items:</h4>
              <ul className="space-y-1 text-sm">
                {orderData.items.map((item, index) => (
                  <li key={index} className="ml-4">
                    • <strong>Name:</strong> {item.name}. <strong>SKU:</strong>{" "}
                    {item.sku}.<strong>UPC:</strong> {item.upc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Close Button - Fixed at bottom */}
        <button
          onClick={handleClearSearch}
          className="w-full py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded text-white transition-colors cursor-pointer flex-shrink-0"
        >
          Clear Search
        </button>

        <style jsx>{`
          /* Custom scrollbar styles */
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

  const renderNotFound = () => (
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
        <h3 className="text-lg font-semibold mb-2">Order Not Found</h3>
        <p className="text-sm text-gray-400 mb-4">
          The order number you searched for does not exist in our shipped or
          unshipped orders.
        </p>
        <button
          onClick={handleClearSearch}
          className="px-4 py-2 bg-red-600/20 border border-red-500/30 rounded text-red-300 text-sm hover:bg-red-600/30 transition-colors cursor-pointer"
        >
          Clear Search
        </button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="text-center text-gray-400 p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
      <p>Searching for order...</p>
    </div>
  );

  const renderIdleState = () => (
    <div className="text-center text-gray-400">
      <p>Search for an order to view details</p>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col">
      {/* Search Input Section */}
      <div className="flex-shrink-0 mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">
          Order Search
        </h2>
        <input
          ref={searchInputRef}
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 text-center rounded-lg border border-slate-600 text-sm sm:text-base"
          style={{ backgroundColor: "var(--color-container)" }}
          disabled={searchState === "loading"}
        />

        {searchTerm && searchState === "idle" && (
          <div className="mt-2 text-xs sm:text-sm text-gray-400 text-center">
            Press Enter to search for "{searchTerm}"
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="flex-1 min-h-0">
        {searchState === "loading" && renderLoading()}
        {searchState === "found" && renderOrderDetails()}
        {searchState === "not_found" && renderNotFound()}
        {searchState === "idle" && renderIdleState()}
      </div>
    </div>
  );
};

export default OrderSearch;
