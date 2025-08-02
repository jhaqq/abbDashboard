import { EnrichedOrderItem } from "./definitions";

export const TapeMatrixContent = ({ tapeItems } : { tapeItems: EnrichedOrderItem[] }) => {
  if (tapeItems.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-4 text-center">
        <div className="text-slate-400 text-sm">
          🎉 No tape orders to ship today!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-400 mb-2">
        📋 {tapeItems.length} tape items in{" "}
        {new Set(tapeItems.map((item) => item.orderNumber)).size} orders
      </div>

      <div className="grid grid-cols-1 gap-2">
        {tapeItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-600/50 rounded p-3 relative cursor-pointer hover:bg-slate-500/50 transition-colors group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {item.product?.name}
                </div>
                <div className="text-xs text-slate-400">
                  {item.product?.sku}
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Order: {item.orderNumber}
                </div>
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

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
              <div>Product: {item.product?.name}</div>
              <div className="text-slate-300">
                Weight: {item.product?.weight}lbs
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
