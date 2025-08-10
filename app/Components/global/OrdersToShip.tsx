import React, { useState } from 'react';
import { Truck, Grid3X3, Package } from 'lucide-react';

// Import your existing matrix components
import { CollapsibleMatrix } from '../products/CollapsibleMatrix';
import { BubbleWrapMatrixContent } from '../products/BubbleMatrix';
import { InstapakMatrixContent } from '../products/InstapakMatrix';
import { LeicaMatrixContent } from '../products/LeicaMatrix';
import { TapeMatrixContent } from '../products/TapeMatrix';
import { OtherMatrixContent } from '../products/OtherMatrix';

interface Order {
  id: string;
  orderNumber: string;
  priority: number;
}

interface EnrichedOrderItem {
  name: string;
  sku: string;
  upc?: string;
  quantity?: number;
  orderNumber: string;
  orderId: string;
  priority: number;
  timeStamp: number;
  product?: any;
}

interface OrdersToShipProps {
  unshippedOrders: Order[];
  enrichedOrderItems: EnrichedOrderItem[];
  bubbleWrapItems: EnrichedOrderItem[];
  instapakItems: EnrichedOrderItem[];
  leicaItems: EnrichedOrderItem[];
  tapeItems: EnrichedOrderItem[];
  otherItems: EnrichedOrderItem[];
}

const OrdersToShip: React.FC<OrdersToShipProps> = ({
  unshippedOrders,
  enrichedOrderItems,
  bubbleWrapItems,
  instapakItems,
  leicaItems,
  tapeItems,
  otherItems
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    bubbleWrap: false,
    tape: false,
    instapak: false,
    leica: false,
    other: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate totals and high priority counts
  const bubbleWrapTotal = bubbleWrapItems.length;
  const instapakTotal = instapakItems.length;
  const leicaTotal = leicaItems.length;
  const tapeTotal = tapeItems.length;
  const otherItemsTotal = otherItems.length;

  const bubbleWrapHighPriority = bubbleWrapItems.filter(item => item.priority > 5).length;
  const instapakHighPriority = instapakItems.filter(item => item.priority > 5).length;
  const leicaHighPriority = leicaItems.filter(item => item.priority > 5).length;
  const tapeHighPriority = tapeItems.filter(item => item.priority > 5).length;
  const otherHighPriority = otherItems.filter(item => item.priority > 5).length;

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Truck className="w-5 h-5 text-blue-400" />
          Orders to Ship ({unshippedOrders.length} orders)
        </h3>
        <div className="flex items-center gap-1">
          <Grid3X3 className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-slate-400">Live Orders</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex-shrink-0">
        <input
          type="text"
          placeholder="Search orders or products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
        />
      </div>

      {/* Orders Summary */}
      {unshippedOrders.length > 0 && (
        <div className="mb-4 bg-slate-700/20 rounded-lg p-3 flex-shrink-0">
          <div className="grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <div className="text-lg font-bold text-blue-400">{unshippedOrders.length}</div>
              <div className="text-slate-400">Total Orders</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-400">{enrichedOrderItems.length}</div>
              <div className="text-slate-400">Total Items</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">
                {unshippedOrders.filter(order => order.priority > 5).length}
              </div>
              <div className="text-slate-400">High Priority</div>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto scrollbar-blue pr-2 overflow-x-hidden">
        
        {/* Bubble Wrap Matrix */}
        {bubbleWrapItems.length > 0 && (
          <CollapsibleMatrix
            title="Bubble Wrap Orders"
            icon="🫧"
            totalItems={bubbleWrapTotal}
            highPriorityCount={bubbleWrapHighPriority}
            isExpanded={expandedSections.bubbleWrap}
            onToggle={() => toggleSection('bubbleWrap')}
            gradient="from-blue-400 to-cyan-400"
          >
            <BubbleWrapMatrixContent bubbleWrapItems={bubbleWrapItems}/>
          </CollapsibleMatrix>
        )}

        {/* Instapak Matrix */}
        {instapakItems.length > 0 && (
          <CollapsibleMatrix
            title="Instapak Orders"
            icon="📦"
            totalItems={instapakTotal}
            highPriorityCount={instapakHighPriority}
            isExpanded={expandedSections.instapak}
            onToggle={() => toggleSection('instapak')}
            gradient="from-orange-400 to-red-400"
          >
            <InstapakMatrixContent instapakItems={instapakItems}/>
          </CollapsibleMatrix>
        )}

        {/* Leica Matrix */}
        {leicaItems.length > 0 && (
          <CollapsibleMatrix
            title="Leica Products"
            icon="📏"
            totalItems={leicaTotal}
            highPriorityCount={leicaHighPriority}
            isExpanded={expandedSections.leica}
            onToggle={() => toggleSection('leica')}
            gradient="from-green-400 to-emerald-400"
          >
            <LeicaMatrixContent leicaItems={leicaItems}/>
          </CollapsibleMatrix>
        )}

        {/* Tape Matrix */}
        {tapeItems.length > 0 && (
          <CollapsibleMatrix
            title="Tape Products"
            icon="📼"
            totalItems={tapeTotal}
            highPriorityCount={tapeHighPriority}
            isExpanded={expandedSections.tape}
            onToggle={() => toggleSection('tape')}
            gradient="from-purple-400 to-pink-400"
          >
            <TapeMatrixContent tapeItems={tapeItems}/>
          </CollapsibleMatrix>
        )}

        {/* Other Items Matrix */}
        {otherItems.length > 0 && (
          <CollapsibleMatrix
            title="Other Products"
            icon="📋"
            totalItems={otherItemsTotal}
            highPriorityCount={otherHighPriority}
            isExpanded={expandedSections.other}
            onToggle={() => toggleSection('other')}
            gradient="from-slate-400 to-slate-600"
          >
            <OtherMatrixContent otherItems={otherItems}/>
          </CollapsibleMatrix>
        )}

        {/* Show message if no orders */}
        {unshippedOrders.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">All caught up! 🎉</h3>
            <p className="text-sm">No unshipped orders at the moment.</p>
          </div>
        )}

        {/* Show message if orders exist but no categorized products */}
        {unshippedOrders.length > 0 && enrichedOrderItems.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <div className="bg-slate-700/30 rounded-lg p-6">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Loading Product Data</h3>
              <p className="text-sm mb-3">
                Orders found, but product enrichment is still loading...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersToShip;