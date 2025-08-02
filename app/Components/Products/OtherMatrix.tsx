import { EnrichedOrderItem } from "./definitions";

export const OtherMatrixContent = ({ otherItems } : { otherItems: EnrichedOrderItem[] }) => {
  if (otherItems.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-4 text-center">
        <div className="text-slate-400 text-sm">
          🎉 No other items to ship today!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-400 mb-2">
        📋 {otherItems.length} other items in{" "}
        {new Set(otherItems.map((item) => item.orderNumber)).size} orders
      </div>

      <div className="grid grid-cols-1 gap-2">
        {otherItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-600/50 rounded p-3 relative cursor-pointer hover:bg-slate-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {item.name}
                </div>
                <div className="text-xs text-slate-400">{item.sku}</div>
                <div className="text-xs text-slate-300 mt-1">
                  Order: {item.orderNumber}
                </div>
                {item.product ? (
                  <div className="text-xs text-slate-500">
                    Category: {item.product.category}
                  </div>
                ) : (
                  <div className="text-xs text-red-400">
                    No product data found
                  </div>
                )}
              </div>
              <div
                className={`w-3 h-3 rounded-full ${
                  item.priority > 5
                    ? "bg-red-400"
                    : item.priority > 2
                    ? "bg-yellow-400"
                    : "bg-green-400"
                } animate-pulse`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
