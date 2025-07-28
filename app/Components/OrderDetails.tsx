interface OrderDetailsProps {
  orderNumber?: string;
  orderData?: {
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
  };
  onClose?: () => void;
  showCloseButton?: boolean;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderNumber,
  orderData,
  onClose,
  showCloseButton = false
}) => {
  if (!orderData && !orderNumber) {
    return (
      <div className="text-center text-gray-400">
        <p>Search for an order to view details</p>
      </div>
    )
  }

  // Use either passed orderData or create mock data from orderNumber
  const order = orderData || {
    id: "39060312948",
    orderNumber: orderNumber || "113-4592719-1270620",
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

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Order Number Header */}
      <div className="text-green-400 font-medium flex-shrink-0">
        Order # {order.orderNumber}
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto scrollbar-visible min-h-0">
        {/* Order Details Section */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-3">Order Details</h3>
          
          <div className="space-y-2 text-sm">
            <div><strong>ID:</strong> {order.id}</div>
            <div><strong>Order Number:</strong> {order.orderNumber}</div>
            <div><strong>Location:</strong> {order.location}</div>
            <div><strong>Shipped:</strong> {order.shipped ? 'Yes' : 'No'}</div>
            <div><strong>Carrier:</strong> {order.carrier}</div>
            <div><strong>Store:</strong> {order.store}</div>
            <div><strong>Prime Status:</strong> {order.primeStatus ? 'Yes' : 'No'}</div>
            <div><strong>Priority:</strong> {order.priority}</div>
            <div><strong>Timestamp:</strong> {order.timestamp}</div>
          </div>
        </div>
        
        {/* Items Section */}
        {order.items && order.items.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Items:</h4>
            <ul className="space-y-1 text-sm">
              {order.items.map((item, index) => (
                <li key={index} className="ml-4">
                  • <strong>Name:</strong> {item.name}. <strong>SKU:</strong> {item.sku}. 
                  <strong>UPC:</strong> {item.upc}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Close Button - Fixed at bottom */}
      {showCloseButton && onClose && (
        <button 
          onClick={onClose}
          className="w-full py-2 px-4 bg-slate-600 hover:bg-slate-500 rounded text-white transition-colors cursor-pointer flex-shrink-0"
        >
          Close
        </button>
      )}

      <style jsx>{`
        /* Custom scrollbar styles - matching LabelsPanel */
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
  )
}

export default OrderDetails