import React, { useState } from 'react';
import { Search, Package, MapPin, Store, Clock, AlertTriangle, CheckCircle, Hash, User } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  shipped: boolean;
  store: string;
  location: string;
  timeStamp: number;
  items: any[];
  priority?: number;
  primeStatus?: boolean; // Make optional to match main dashboard
}

interface Product {
  name: string;
  sku: string;
  weight?: number;
  category: string;
  subcategory?: string;
  imageURL?: string;
  upc?: string;
}

interface OrderSearchProps {
  onSearch: (orderNumber: string) => Promise<void>;
  searchResults: Order | null;
  productCache: Map<string, Product>;
  onOrderClick: (order: Order) => void;
  loading: boolean;
}

const OrderSearch: React.FC<OrderSearchProps> = ({
  onSearch,
  searchResults,
  productCache,
  onOrderClick,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() || isSearching) return;

    setIsSearching(true);
    try {
      await onSearch(searchTerm.trim());
    } finally {
      setIsSearching(false);
    }
  };

  const formatDateTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority?: number) => {
    if (!priority) return { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', text: 'Unknown' };
    if (priority >= 3) return { color: 'bg-red-500/20 text-red-300 border-red-500/30', text: 'High' };
    if (priority >= 2) return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', text: 'Medium' };
    return { color: 'bg-green-500/20 text-green-300 border-green-500/30', text: 'Low' };
  };

  const getLocationShortName = (location: string) => {
    return location.replace('ABB - ', '');
  };

  const totalWeight = searchResults?.items?.reduce((sum, item) => {
    const product = productCache.get(item.sku);
    const weight = product?.weight || 0;
    const quantity = item.quantity || 1;
    return sum + (weight * quantity);
  }, 0) || 0;

  const priorityBadge = getPriorityBadge(searchResults?.priority);

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
      
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-cyan-400" />
        Order Search
      </h2>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Order or Tracking Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-200"
            disabled={isSearching || loading}
          />
          <button
            type="submit"
            disabled={isSearching || loading || !searchTerm.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-sm rounded-md transition-colors duration-200"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {searchResults ? (
          <div className="space-y-4">
            {/* Order Header */}
            <div 
              className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30"
              onClick={() => onOrderClick(searchResults)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${searchResults.shipped ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                    {searchResults.shipped ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">#{searchResults.orderNumber}</h3>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityBadge.color}`}>
                  {priorityBadge.text}
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-xs">Location</p>
                    <p className="text-white text-sm font-medium">
                      {getLocationShortName(searchResults.location)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-xs">Order Date</p>
                    <p className="text-white text-sm font-medium">
                      {formatDateTime(searchResults.timeStamp)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-xs">Store</p>
                    <p className="text-white text-sm font-medium truncate">
                      {searchResults.store}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-400 text-xs">Items</p>
                    <p className="text-white text-sm font-medium">
                      {searchResults.items?.length || 0} items
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Row */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-600/30">
                <div className="flex items-center gap-4">
                  <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${
                    searchResults.shipped 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {searchResults.shipped ? 'Shipped' : 'Pending'}
                  </div>
                  
                  {searchResults.primeStatus && (
                    <div className="inline-flex px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      Prime
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-slate-400 text-xs">Total Weight</p>
                  <p className="text-white text-sm font-medium">
                    {totalWeight.toFixed(2)} lbs
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Items Preview */}
            {searchResults.items && searchResults.items.length > 0 && (
              <div className="bg-slate-700/20 rounded-xl p-4 border border-slate-600/20">
                <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Items Preview
                </h4>
                <div className="space-y-2">
                  {searchResults.items.slice(0, 3).map((item, index) => {
                    const product = productCache.get(item.sku);
                    return (
                      <div key={index} className="flex items-center justify-between p-2 bg-slate-800/30 rounded border border-slate-600/20">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">
                            {product?.name || item.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            SKU: {item.sku} • Qty: {item.quantity || 1}
                          </p>
                        </div>
                        {product?.weight && (
                          <div className="text-xs text-slate-400 flex-shrink-0 ml-2">
                            {((product.weight || 0) * (item.quantity || 1)).toFixed(1)} lbs
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {searchResults.items.length > 3 && (
                    <div className="text-center py-2 text-xs text-slate-500">
                      +{searchResults.items.length - 3} more items
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : searchTerm && !isSearching ? (
          <div className="text-center py-8 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No results found for "{searchTerm}"</p>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with a different order number
            </p>
          </div>
        ) : (
          <div className="text-center py-8 text-slate-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Enter an order number to search</p>
            <p className="text-xs text-slate-500 mt-1">
              Search across all ABB warehouse locations
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSearch;