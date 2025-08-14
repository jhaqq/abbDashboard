import React, { useState } from 'react';
import { Package, CheckCircle, AlertTriangle, X, Box, Weight, Hash, Image as ImageIcon } from 'lucide-react';

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

// Order Details Modal Component
const OrderDetailsModal: React.FC<{
  order: Order;
  productCache: Map<string, Product>;
  onClose: () => void;
}> = ({ order, productCache, onClose }) => {
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 3) return { color: 'bg-red-500/20 text-red-300 border-red-500/30', text: 'High Priority' };
    if (priority >= 2) return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Medium Priority' };
    return { color: 'bg-green-500/20 text-green-300 border-green-500/30', text: 'Low Priority' };
  };

  const priorityBadge = getPriorityBadge(order.priority);
  const totalWeight = order.items?.reduce((sum, item) => {
    const product = productCache.get(item.sku);
    const weight = product?.weight || 0;
    const quantity = item.quantity || 1;
    return sum + (weight * quantity);
  }, 0) || 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl border border-slate-700/50 max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${order.shipped ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
              {order.shipped ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Order #{order.orderNumber}</h2>
              <p className="text-slate-400 text-sm">{order.store}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Order Info */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Status</p>
              <div className={`inline-flex px-2 ml-[-2] py-1 rounded-full text-xs font-medium border ${
                order.shipped 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {order.shipped ? 'Shipped' : 'Pending'}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Order Date</p>
              <p className="text-white font-medium">{formatTime(order.timeStamp)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Weight</p>
              <p className="text-white font-medium">{totalWeight.toFixed(2)} lbs</p>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-cyan-400" />
              Items ({order.items?.length || 0})
            </h3>
            
            <div className="space-y-4">
              {order.items?.map((item, index) => {
                const product = productCache.get(item.sku);
                const itemWeight = (product?.weight || 0) * (item.quantity || 1);
                
                return (
                  <div key={index} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-slate-600/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        {product?.imageURL ? (
                          <img 
                            src={product.imageURL} 
                            alt={product.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <ImageIcon className={`w-6 h-6 text-slate-400 ${product?.imageURL ? 'hidden' : ''}`} />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-white truncate">
                              {product?.name || item.name}
                            </h4>
                            <p className="text-slate-400 text-sm">
                              {product?.category} {product?.subcategory && `• ${product.subcategory}`}
                            </p>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <p className="text-white font-medium">Qty: {item.quantity || 1}</p>
                            <p className="text-slate-400 text-sm">{itemWeight.toFixed(2)} lbs</p>
                          </div>
                        </div>

                        {/* Product Specs */}
                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-600/30">
                          <div className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            <div>
                              <p className="text-slate-400 text-xs">SKU</p>
                              <p className="text-slate-200 text-sm font-mono">{item.sku}</p>
                            </div>
                          </div>
                          
                            <div className="flex items-center gap-2">
                              <Weight className="w-4 h-4 text-slate-400" />
                              <div>
                                <p className="text-slate-400 text-xs">Unit Weight</p>
                                <p className="text-slate-200 text-sm">
                                  {product?.weight ? `${product.weight} lbs` : 'N/A'}
                                </p>
                              </div>
                            </div>

                          {item.upc && (
                            <div className="flex items-center gap-2 col-span-2">
                              <Box className="w-4 h-4 text-slate-400" />
                              <div>
                                <p className="text-slate-400 text-xs">UPC</p>
                                <p className="text-slate-200 text-sm font-mono">{item.upc}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    const priorityBadge = getPriorityBadge(order.priority);

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