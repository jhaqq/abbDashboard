import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, Package, ChevronDown, ChevronUp } from 'lucide-react';

interface LeftBehindOrder {
  orderNumber: string;
  location: string;
  daysLeft: number;
  itemsCount: number;
  priority: number;
  reason: string;
  store: string;
  timestamp: number;
}

const LeftBehind: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Mock data - replace with real data from Firebase later
  const leftBehindOrders: LeftBehindOrder[] = [
    {
      orderNumber: "123-1234567890-54321",
      location: "ABB1",
      daysLeft: 2,
      itemsCount: 3,
      priority: 1,
      reason: "Missing inventory",
      store: "Shopify",
      timestamp: Date.now() - (24 * 60 * 60 * 1000 * 5) // 5 days ago
    },
    {
      orderNumber: "456-9876543210-12345",
      location: "ABB2", 
      daysLeft: 1,
      itemsCount: 1,
      priority: 2,
      reason: "Damaged package",
      store: "Amazon",
      timestamp: Date.now() - (24 * 60 * 60 * 1000 * 6) // 6 days ago
    },
    {
      orderNumber: "789-5555555555-99999",
      location: "ABB1",
      daysLeft: 0,
      itemsCount: 2,
      priority: 3,
      reason: "Address issue",
      store: "eBay",
      timestamp: Date.now() - (24 * 60 * 60 * 1000 * 7) // 7 days ago
    },
    {
      orderNumber: "321-1111111111-77777",
      location: "ABB3",
      daysLeft: 3,
      itemsCount: 5,
      priority: 1,
      reason: "Shipping hold",
      store: "Shopify",
      timestamp: Date.now() - (24 * 60 * 60 * 1000 * 4) // 4 days ago
    },
    {
      orderNumber: "654-8888888888-33333",
      location: "ABB2",
      daysLeft: 1,
      itemsCount: 1,
      priority: 2,
      reason: "Customer requested delay",
      store: "Amazon",
      timestamp: Date.now() - (24 * 60 * 60 * 1000 * 6) // 6 days ago
    }
  ];

  const formatDaysAgo = (timestamp: number) => {
    const daysAgo = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
    return daysAgo === 0 ? 'Today' : `${daysAgo} days ago`;
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 3) return 'bg-red-400';
    if (priority >= 2) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getDaysLeftColor = (daysLeft: number) => {
    if (daysLeft === 0) return 'text-red-400 font-bold';
    if (daysLeft <= 1) return 'text-amber-400 font-medium';
    return 'text-emerald-400';
  };

  const getDaysLeftBg = (daysLeft: number) => {
    if (daysLeft === 0) return 'bg-red-500/20 border-red-500/30';
    if (daysLeft <= 1) return 'bg-amber-500/20 border-amber-500/30';
    return 'bg-emerald-500/20 border-emerald-500/30';
  };

  // Sort orders by days left (most urgent first)
  const sortedOrders = [...leftBehindOrders].sort((a, b) => a.daysLeft - b.daysLeft);

  // Get urgent count (0 or 1 days left)
  const urgentCount = sortedOrders.filter(order => order.daysLeft <= 1).length;

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
      
      {/* Header */}
      <div 
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold">
            Left Behind
            <span className="text-sm text-slate-400 ml-2">(#)</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {urgentCount > 0 && (
            <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded-full text-xs font-bold border border-red-500/30 animate-pulse">
              {urgentCount} URGENT
            </div>
          )}
          <div className="bg-slate-600/50 text-slate-300 px-2 py-1 rounded-full text-xs font-bold">
            {sortedOrders.length}
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Order List */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-3 pr-2">
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order, index) => (
                <div
                  key={order.orderNumber}
                  className="bg-slate-700/20 rounded-lg p-4 border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/30 transition-all duration-200 cursor-pointer group"
                >
                  {/* Header Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-200 text-sm truncate">
                          #{order.orderNumber}
                        </span>
                        <div 
                          className={`w-2 h-2 rounded-full ${getPriorityColor(order.priority)} animate-pulse`}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span>{order.location}</span>
                        <span>•</span>
                        <span>{order.store}</span>
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDaysLeftBg(order.daysLeft)}`}>
                      <span className={getDaysLeftColor(order.daysLeft)}>
                        {order.daysLeft === 0 ? 'DUE TODAY' : `${order.daysLeft} days left`}
                      </span>
                    </div>
                  </div>

                  {/* Details Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-400 truncate mb-1">
                        Reason: {order.reason}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{order.itemsCount} items</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDaysAgo(order.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Urgent Indicator */}
                  {order.daysLeft === 0 && (
                    <div className="mt-3 pt-3 border-t border-red-500/30">
                      <div className="flex items-center gap-2 text-red-400">
                        <AlertTriangle className="w-4 h-4 animate-bounce" />
                        <span className="text-xs font-medium">
                          Action required today!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                <p className="text-sm">No orders left behind today</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Footer */}
      {!isExpanded && sortedOrders.length > 0 && (
        <div className="mt-4 p-3 bg-slate-700/20 rounded-lg border border-slate-600/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              {sortedOrders.length} orders waiting
            </span>
            {urgentCount > 0 && (
              <span className="text-red-400 font-medium">
                {urgentCount} due today/tomorrow
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftBehind;