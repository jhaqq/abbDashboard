import React from 'react';
import { TrendingUp, AlertTriangle } from 'lucide-react';

interface OrderStatusProps {
  shippedCount: number;
  pendingCount: number;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ shippedCount, pendingCount }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-medium">TODAY</span>
        </div>
        <div className="text-2xl font-bold text-emerald-400">{shippedCount}</div>
        <div className="text-xs text-slate-400">Shipped</div>
      </div>

      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-300 font-medium">PENDING</span>
        </div>
        <div className="text-2xl font-bold text-amber-400">{pendingCount}</div>
        <div className="text-xs text-slate-400">Orders</div>
      </div>
    </div>
  );
};

export default OrderStatus;