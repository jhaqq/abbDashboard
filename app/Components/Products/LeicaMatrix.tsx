import { Product, EnrichedOrderItem } from "./definitions";

export const LeicaMatrixContent = ({ leicaItems } : { leicaItems: EnrichedOrderItem[] }) => {
  if (leicaItems.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-4 text-center">
        <div className="text-slate-400 text-sm">
          🎉 No Leica orders to ship today!
        </div>
      </div>
    );
  }

  // Group by subcategory
  const subcategories = [
    ...new Set(
      leicaItems.map((item) => item.product?.subcategory).filter(Boolean)
    ),
  ].sort();

  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-400 mb-2">
        📋 {leicaItems.length} Leica items in{" "}
        {new Set(leicaItems.map((item) => item.orderNumber)).size} orders
      </div>

      {subcategories.map((subcategory) => {
        const subcategoryItems = leicaItems.filter(
          (item) => item.product?.subcategory === subcategory
        );

        return (
          <div key={subcategory} className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-white capitalize">
                {subcategory?.replace("_", " ")} Products
              </span>
              <span className="text-xs text-slate-400">
                ({subcategoryItems.length} items)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {subcategoryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-600/50 rounded p-2 relative cursor-pointer hover:bg-slate-500/50 transition-colors group"
                >
                  <div className="text-xs font-medium text-white truncate">
                    {item.product?.name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">
                    {item.product?.sku}
                  </div>
                  <div
                    className={`w-2 h-2 absolute top-2 right-2 rounded-full ${
                      item.priority > 5
                        ? "bg-red-400"
                        : item.priority > 2
                        ? "bg-yellow-400"
                        : "bg-green-400"
                    } animate-pulse`}
                  ></div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                    <div>Order: {item.orderNumber}</div>
                    <div className="text-slate-300">
                      Weight: {item.product?.weight}lbs
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
