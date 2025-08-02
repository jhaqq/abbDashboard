import { Product, EnrichedOrderItem } from "./definitions";

export const InstapakMatrixContent = ({ instapakItems } : { instapakItems: EnrichedOrderItem[] }) => {
  if (instapakItems.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-4 text-center">
        <div className="text-slate-400 text-sm">
          🎉 No Instapak orders to ship today!
        </div>
      </div>
    );
  }

  // Generate dynamic densities based on actual product data
  const densities = [
    ...new Set(
      instapakItems.map((item) => item.product?.density_display).filter(Boolean)
    ),
  ].sort();

  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-400 mb-2">
        📋 {instapakItems.length} Instapak items in{" "}
        {new Set(instapakItems.map((item) => item.orderNumber)).size} orders
      </div>

      <div className="grid grid-cols-3 gap-3">
        {densities.map((density) => {
          const densityItems = instapakItems.filter(
            (item) => item.product?.density_display === density
          );

          return (
            <div
              key={density}
              className="bg-slate-600/50 rounded-lg p-3 text-center relative cursor-pointer hover:bg-slate-500/50 transition-colors group"
            >
              <div className="text-sm font-medium text-white mb-1">
                {density}
              </div>
              <div className="text-lg font-bold text-orange-400 mb-1">
                {densityItems.length}
              </div>
              <div className="text-xs text-slate-400">orders</div>
              <div
                className={`w-2 h-2 mx-auto mt-2 rounded-full ${
                  densityItems.some((item) => item.priority > 5)
                    ? "bg-red-400"
                    : densityItems.some((item) => item.priority > 2)
                    ? "bg-yellow-400"
                    : "bg-green-400"
                } animate-pulse`}
              ></div>

              {/* Tooltip showing order details */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                <div className="max-h-32 overflow-y-auto">
                  {densityItems.map((item, idx) => (
                    <div key={idx} className="mb-1">
                      <div>Order: {item.orderNumber}</div>
                      <div className="text-slate-300">{item.product?.name}</div>
                      <div className="text-slate-400">
                        Pack: {item.product?.pack_size}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
