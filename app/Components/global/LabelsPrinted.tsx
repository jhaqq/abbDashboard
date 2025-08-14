import React, { useState } from 'react';
import { Package, CheckCircle, AlertTriangle, X, Box, Weight, Hash, Image as ImageIcon } from 'lucide-react';

// Components
import { OrderDetailsModal } from './OrderDetailsModal';

interface Order {
  id: string;
  orderNumber: string;
  shipped: boolean;
  store: string;
  timeStamp: number;
  items: OrderItem[];
}

interface OrderItem {
  name: string;
  sku: string;
  upc?: string;
  quantity?: number;
}

interface Product {
  name: string;
  sku: string;
  weight?: number; // Changed to optional
  category: string;
  subcategory?: string;
  imageURL?: string;
  upc?: string;
  density?: number;
  pack_size?: number;
  pack_unit?: string;
  // Add other product fields as needed
}

interface EnrichedOrderItem extends OrderItem {
  product?: Product;
}

interface LabelsPrintedProps {
  shippedOrders: Order[];
  unshippedOrders: Order[];
  enrichedOrderItems?: EnrichedOrderItem[];
  productCache?: Map<string, Product>;
}

// Main LabelsPrinted Component
const LabelsPrinted: React.FC<LabelsPrintedProps> = ({ 
  shippedOrders, 
  unshippedOrders,
  productCache = new Map()
}) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 3) return { color: 'bg-red-500/20 text-red-300 border-red-500/30', text: 'High' };
    if (priority >= 2) return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Med' };
    return { color: 'bg-green-500/20 text-green-300 border-green-500/30', text: 'Low' };
  };

  const OrderItem: React.FC<{ order: Order; isShipped: boolean }> = ({ order, isShipped }) => {

    return (
      <button
        onClick={() => setSelectedOrder(order)}
        className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/30 transition-all duration-200 w-full text-left"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="font-medium text-slate-200 text-sm">#{order.orderNumber}</span>
          <span className="text-xs text-slate-400">{formatTime(order.timeStamp)}</span>
        </div>
        <div className="text-xs text-slate-400 mb-2 truncate">{order.store}</div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500">{order.items?.length || 0} {order?.items?.length == 1 ? "item" : "items"}</span>
        </div>
      </button>
    );
  };

  return (
    <>
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-amber-500" />
        
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-cyan-400" />
          Labels Printed
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          {/* Shipped Orders */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20 relative overflow-hidden flex flex-col min-h-0">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Shipped
              </h3>
              <div className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                {shippedOrders.length}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="space-y-2 pr-2">
                {shippedOrders.length > 0 ? (
                  shippedOrders.map((order) => (
                    <OrderItem key={order.id} order={order} isShipped={true} />
                  ))
                ) : (
                  <div className="text-center py-8 text-emerald-400/60">
                    <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No shipped orders today</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Unshipped Orders */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20 relative overflow-hidden flex flex-col min-h-0">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Pending
              </h3>
              <div className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full text-xs font-bold border border-amber-500/30">
                {unshippedOrders.length}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="space-y-2 pr-2">
                {unshippedOrders.length > 0 ? (
                  unshippedOrders.map((order) => (
                    <OrderItem key={order.id} order={order} isShipped={false} />
                  ))
                ) : (
                  <div className="text-center py-8 text-amber-400/60">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">All orders shipped! 🎉</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          productCache={productCache}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
};

export default LabelsPrinted;