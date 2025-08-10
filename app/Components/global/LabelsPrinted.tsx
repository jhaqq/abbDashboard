import React from 'react';
import { Package, CheckCircle, AlertTriangle } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  shipped: boolean;
}

interface LabelsPrintedProps {
  shippedOrders: Order[];
  unshippedOrders: Order[];
}

const LabelsPrinted: React.FC<LabelsPrintedProps> = ({ shippedOrders, unshippedOrders }) => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 flex-1 min-h-0">
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <Package className="w-4 h-4 text-cyan-400" />
        Labels Printed
      </h2>

      <div className="flex flex-row gap-4 h-[calc(100%-3rem)]">
        <div className="flex-1 min-h-0">
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-3 border border-emerald-500/20 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Shipped
              </h3>
              <div className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full">
                {shippedOrders.length} orders
              </div>
            </div>

            <div className="space-y-1 h-[calc(100%-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
              {shippedOrders.slice(0, 20).map((order, idx) => (
                <div
                  key={idx}
                  className="text-xs text-emerald-200 font-mono bg-emerald-900/20 rounded px-2 py-1 border border-emerald-500/10 hover:bg-emerald-900/30 transition-colors"
                >
                  {order.orderNumber}
                </div>
              ))}
              {shippedOrders.length === 0 && (
                <div className="text-xs text-emerald-300/50 text-center py-4">
                  No shipped orders today
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 border border-amber-500/20 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl"></div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Unshipped
              </h3>
              <div className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full">
                {unshippedOrders.length} orders
              </div>
            </div>

            <div className="space-y-1 h-[calc(100%-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
              {unshippedOrders.slice(0, 20).map((order, idx) => (
                <div
                  key={idx}
                  className="text-xs text-amber-200 font-mono bg-amber-900/20 rounded px-2 py-1 border border-amber-500/10 hover:bg-amber-900/30 transition-colors"
                >
                  {order.orderNumber}
                </div>
              ))}
              {unshippedOrders.length === 0 && (
                <div className="text-xs text-amber-300/50 text-center py-4">
                  No pending orders
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelsPrinted;