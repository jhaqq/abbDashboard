import React from "react";
import { Product, EnrichedOrderItem } from "./definitions";

export const BubbleWrapMatrixContent = ({
  bubbleWrapItems,
}: {
  bubbleWrapItems: EnrichedOrderItem[];
}) => {
  if (bubbleWrapItems.length === 0) {
    return (
      <div className="bg-slate-700/30 rounded-lg p-4 text-center">
        <div className="text-slate-400 text-sm">
          🎉 No bubble wrap orders to ship today!
        </div>
      </div>
    );
  }

  // Generate dynamic arrays based on actual product data
  const sizes = [
    ...new Set(
      bubbleWrapItems.map((item) => item.product?.bubble_size).filter(Boolean)
    ),
  ].sort();
  const widths = [
    ...new Set(
      bubbleWrapItems.map((item) => item.product?.width).filter(Boolean)
    ),
  ].sort((a, b) => a - b);
  const rollTypes = ["single", "double", "triple", "quad"];

  console.log("Bubble wrap matrix data - Sizes:", sizes, "Widths:", widths);

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-400 mb-3">
        📋 {bubbleWrapItems.length} bubble wrap items in{" "}
        {new Set(bubbleWrapItems.map((item) => item.orderNumber)).size} orders
      </div>

      {sizes.map((size) => {
        const sizeItems = bubbleWrapItems.filter(
          (item) => item.product?.bubble_size === size
        );
        if (sizeItems.length === 0) return null;

        return (
          <div key={size} className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-medium text-white">
                {size}" Bubble
              </span>
              <span className="text-xs text-slate-400">
                ({sizeItems.length} items)
              </span>
            </div>

            <div className="bg-slate-800/30 rounded p-2">
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `auto repeat(4, 1fr)` }}
              >
                {/* Header row */}
                <div className="text-xs text-slate-400 font-medium">Width</div>
                <div className="text-xs text-slate-400 font-medium text-center">
                  Single
                </div>
                <div className="text-xs text-slate-400 font-medium text-center">
                  Double
                </div>
                <div className="text-xs text-slate-400 font-medium text-center">
                  Triple
                </div>
                <div className="text-xs text-slate-400 font-medium text-center">
                  Quad
                </div>

                {/* Data rows - use dynamic widths from actual data */}
                {widths.map((width) => {
                  const widthItems = sizeItems.filter(
                    (item) => item.product?.width === width
                  );
                  if (widthItems.length === 0) return null;

                  return (
                    <React.Fragment key={width}>
                      <div className="text-xs font-medium text-slate-300 py-2">
                        {width}"
                      </div>
                      {rollTypes.map((rollType) => {
                        const matchingItems = widthItems.filter(
                          (item) => item.product?.roll_type === rollType
                        );
                        const count = matchingItems.length;

                        return (
                          <div key={rollType} className="text-center">
                            {count > 0 ? (
                              <div className="bg-slate-600/50 rounded p-2 relative hover:bg-slate-500/50 transition-colors group">
                                <div className="text-sm font-bold text-white">
                                  {count}
                                </div>
                                <div
                                  className={`w-2 h-2 mx-auto mt-1 rounded-full ${
                                    matchingItems.some(
                                      (item) => item.priority > 5
                                    )
                                      ? "bg-red-400"
                                      : matchingItems.some(
                                          (item) => item.priority > 2
                                        )
                                      ? "bg-yellow-400"
                                      : "bg-green-400"
                                  } animate-pulse`}
                                ></div>

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                  <div className="max-h-24 overflow-y-auto">
                                    {matchingItems.map((item, idx) => (
                                      <div key={idx} className="mb-1">
                                        <div>Order: {item.orderNumber}</div>
                                        <div className="text-slate-300">
                                          {item.product?.grade}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-slate-800/30 rounded p-2">
                                <div className="text-xs text-slate-500">—</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
