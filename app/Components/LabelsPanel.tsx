interface LabelsPanelProps {
  shippedOrders?: string[];
  unshippedOrders?: string[];
  onOrderClick?: (orderId: string) => void;
  selectedOrder?: string | null;
}

const LabelsPanel: React.FC<LabelsPanelProps> = ({
  shippedOrders = [],
  unshippedOrders = [],
  onOrderClick,
  selectedOrder,
}) => {
  const labelOptions = [
    "ABB1",
    "ABB2",
    "ABB3",
    "ABB4",
    "ABB5",
    "ABB6",
    "ABB7",
    "ABB8",
    "ABBMO",
  ];

  // Add some mock shipped orders to test scrolling - unique numbers
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
    "Order #136-0000000-0000000"

  ];

  return (
    <div className="h-full flex flex-col max-h-full">
      {/* Filter Checkboxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 mb-6 flex-shrink-0">
        {labelOptions.map((label) => (
          <label key={label} className="flex items-center space-x-1 text-sm">
            <input type="checkbox" className="rounded" />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {/* Shipped/Unshipped Lists Container */}
      <div className="flex-1 grid grid-cols-2 gap-4 text-sm min-h-0">
        {/* Shipped Orders */}
        <div className="flex flex-col min-h-0">
          <h3 className="font-bold text-lg mb-3 text-green-400 border-b border-green-400/30 pb-1 flex-shrink-0">
            Shipped ({mockShippedOrders.length})
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-visible min-h-0" style={{maxHeight: 'calc(100vh - 400px)'}}>
            <div className="space-y-1">
              {mockShippedOrders.map((order, index) => (
                <div
                  key={index}
                  className={`text-green-300 text-xs cursor-pointer hover:text-green-200 transition-colors whitespace-nowrap ${
                    selectedOrder === order ? 'underline' : ''
                  }`}
                  onClick={() => onOrderClick?.(order)}
                >
                  {order}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Unshipped Orders */}
        <div className="flex flex-col min-h-0">
          <h3 className="font-bold text-lg mb-3 text-red-400 border-b border-red-400/30 pb-1 flex-shrink-0">
            UnShipped ({unshippedOrders.length})
          </h3>
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-visible min-h-0" style={{maxHeight: 'calc(100vh - 400px)'}}>
            <div className="space-y-1">
              {unshippedOrders.map((order, index) => (
                <div
                  key={index}
                  className={`text-red-300 text-xs cursor-pointer hover:text-red-200 transition-colors whitespace-nowrap ${
                    selectedOrder === order ? 'underline' : ''
                  }`}
                  onClick={() => onOrderClick?.(order)}
                >
                  {order}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Custom scrollbar styles - more visible */
        .scrollbar-visible {
          scrollbar-width: thin;
          scrollbar-color: #6B7280 #374151;
        }
        
        .scrollbar-visible::-webkit-scrollbar {
          width: 8px;
        }
        
        .scrollbar-visible::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 4px;
          border: 1px solid #4B5563;
        }
        
        .scrollbar-visible::-webkit-scrollbar-thumb {
          background: #6B7280;
          border-radius: 4px;
          border: 1px solid #4B5563;
        }
        
        .scrollbar-visible::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
        
        .scrollbar-visible::-webkit-scrollbar-thumb:active {
          background: #D1D5DB;
        }
      `}</style>
    </div>
  );
};

export default LabelsPanel