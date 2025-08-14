import React, { useState } from 'react';
import { Package, CheckCircle, AlertTriangle, MapPin, Store, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { CSOrder, CSProduct } from './shared-interfaces';

interface CSLabelsPrintedProps {
  shippedOrders: CSOrder[];
  unshippedOrders: CSOrder[];
  productCache: Map<string, CSProduct>;
  allOrders: CSOrder[];
  loading: boolean;
}

const CSLabelsPrinted: React.FC<CSLabelsPrintedProps> = ({ 
  shippedOrders, 
  unshippedOrders,
  productCache,
  allOrders,
  loading
}) => {
  const [selectedOrder, setSelectedOrder] = useState<CSOrder | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
  // Collapsible state for each location section
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Toggle collapsed state for a location section
  const toggleLocationCollapse = (locationKey: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [locationKey]: !prev[locationKey]
    }));
  };

  // Get all unique locations from orders
  const allLocations = Array.from(
    new Set([...shippedOrders, ...unshippedOrders].map(order => order.location))
  ).filter(Boolean).sort();

  // Extract location short names (ABB1, ABB2, etc.)
  const getLocationShortName = (location: string) => {
    return location.replace('ABB - ', '');
  };

  const locationShortNames = allLocations.map(getLocationShortName);

  // Handle location toggle
  const handleLocationToggle = (location: string) => {
    setSelectedLocations(prev => 
      prev.includes(location)
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    );
  };

  // Filter orders by selected locations
  const filterOrdersByLocation = (orders: CSOrder[]) => {
    if (selectedLocations.length === 0) {
      return orders; // Show all if none selected
    }
    return orders.filter(order => 
      selectedLocations.some(selectedLoc => 
        order.location && order.location.includes(selectedLoc)
      )
    );
  };

  const filteredShippedOrders = filterOrdersByLocation(shippedOrders);
  const filteredUnshippedOrders = filterOrdersByLocation(unshippedOrders);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLocationShortNameForDisplay = (location: string) => {
    // Extract location name after "ABB - "
    return location.replace('ABB - ', '').substring(0, 8);
  };

  const getPriorityColor = (priority?: number) => {
    if (!priority) return 'bg-gray-400';
    if (priority > 5) return 'bg-red-400';
    if (priority > 2) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  // Group orders by location for better organization (now using filtered orders)
  const groupOrdersByLocation = (orders: CSOrder[]) => {
    const grouped = orders.reduce((acc, order) => {
      const location = order.location || 'Unknown';
      if (!acc[location]) acc[location] = [];
      acc[location].push(order);
      return acc;
    }, {} as Record<string, CSOrder[]>);

    // Sort locations by order count (descending)
    return Object.entries(grouped).sort(([,a], [,b]) => b.length - a.length);
  };

  const shippedByLocation = groupOrdersByLocation(filteredShippedOrders);
  const unshippedByLocation = groupOrdersByLocation(filteredUnshippedOrders);

  const OrderItem: React.FC<{ order: CSOrder; showLocation?: boolean }> = ({ 
    order, 
    showLocation = true 
  }) => (
    <button
      onClick={() => setSelectedOrder(order)}
      className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/30 transition-all duration-200 w-full text-left group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 min-w-0">
          <span className="font-medium text-slate-200 text-sm block truncate">
            #{order.orderNumber}
          </span>
          {showLocation && (
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span className="text-xs text-slate-400 truncate">
                {getLocationShortNameForDisplay(order.location)}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <span className="text-xs text-slate-400">{formatTime(order.timeStamp)}</span>
          <div 
            className={`w-2 h-2 rounded-full ${getPriorityColor(order.priority)} animate-pulse`}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="w-3 h-3 text-slate-500" />
          <span className="text-xs text-slate-500 truncate">{order.store}</span>
        </div>
        <span className="text-xs text-slate-500 flex-shrink-0">
          {order.items?.length || 0} {order?.items?.length === 1 ? "item" : "items"}
        </span>
      </div>
    </button>
  );

  const LocationSection: React.FC<{ 
    locationName: string; 
    orders: CSOrder[]; 
    isShipped: boolean 
  }> = ({ locationName, orders, isShipped }) => {
    const sectionKey = `${locationName}-${isShipped ? 'shipped' : 'unshipped'}`;
    const isCollapsed = collapsedSections[sectionKey] || false;

    return (
      <div className="mb-4 last:mb-0">
        <div 
          className="flex items-center justify-between mb-2 px-1 cursor-pointer hover:bg-slate-700/20 rounded p-1 transition-colors"
          onClick={() => toggleLocationCollapse(sectionKey)}
        >
          <h4 className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {getLocationShortNameForDisplay(locationName)}
            {isCollapsed ? (
              <ChevronDown className="w-3 h-3 ml-1" />
            ) : (
              <ChevronUp className="w-3 h-3 ml-1" />
            )}
          </h4>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
            isShipped 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            {orders.length}
          </span>
        </div>
        
        {!isCollapsed && (
          <div className="space-y-2 animate-in slide-in-from-top-1 duration-200">
            {orders.map((order) => (
              <OrderItem key={order.id} order={order} showLocation={false} />
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 animate-pulse">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-amber-500" />
        <div className="h-6 bg-slate-700/50 rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="bg-slate-700/20 rounded-xl p-4">
            <div className="h-16 bg-slate-600/30 rounded"></div>
          </div>
          <div className="bg-slate-700/20 rounded-xl p-4">
            <div className="h-16 bg-slate-600/30 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-amber-500" />
        
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-cyan-400" />
          Labels Printed
          <span className="text-sm text-slate-400 ml-2">
            ({selectedLocations.length > 0 ? selectedLocations.join(', ') : 'All Locations'})
          </span>
        </h2>

        {/* Location Toggles */}
        <div className="mb-4 flex flex-wrap gap-2">
          {locationShortNames.map((locationShort) => {
            const isSelected = selectedLocations.includes(locationShort);
            return (
              <button
                key={locationShort}
                onClick={() => handleLocationToggle(locationShort)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 shadow-sm'
                    : 'bg-slate-700/50 text-slate-400 border-slate-600/30 hover:bg-slate-700/70 hover:text-slate-300 hover:border-slate-500/50'
                }`}
              >
                ✓ {locationShort}
              </button>
            );
          })}
          {selectedLocations.length > 0 && (
            <button
              onClick={() => setSelectedLocations([])}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition-all duration-200"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          {/* Shipped Orders */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20 relative overflow-hidden flex flex-col min-h-0">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl" />
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <h3 className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Shipped
              </h3>
              <div className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                {filteredShippedOrders.length}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 relative z-10">
              <div className="space-y-4 pr-2">
                {shippedByLocation.length > 0 ? (
                  shippedByLocation.map(([location, orders]) => (
                    <LocationSection
                      key={location}
                      locationName={location}
                      orders={orders}
                      isShipped={true}
                    />
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
            
            <div className="flex items-center justify-between mb-3 relative z-10">
              <h3 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Pending
              </h3>
              <div className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded-full text-xs font-bold border border-amber-500/30">
                {filteredUnshippedOrders.length}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 relative z-10">
              <div className="space-y-4 pr-2">
                {unshippedByLocation.length > 0 ? (
                  unshippedByLocation.map(([location, orders]) => (
                    <LocationSection
                      key={location}
                      locationName={location}
                      orders={orders}
                      isShipped={false}
                    />
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
      {/* {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          productCache={productCache}
          onClose={() => setSelectedOrder(null)}
        />
      )} */}
    </>
  );
};

export default CSLabelsPrinted;