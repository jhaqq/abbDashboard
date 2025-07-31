"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Truck,
  Clock,
  BarChart3,
  ExternalLink,
  CheckCircle,
  XCircle,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Activity,
  ChevronDown,
  ChevronUp,
  Grid3X3,
} from "lucide-react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useUser } from "../contexts/userContext";

interface Order {
  id: string;
  items: [];
  location: string;
  orderNumber: string;
  primeStatus: boolean;
  priority: number;
  shipped: boolean;
  store: string;
  timeStamp: number;
}

interface OrderItem {
  name: string;
  sku: string;
  upc?: string;
  quantity?: number;
  orderNumber: string;
  orderId: string;
  priority: number;
  timeStamp: number;
}

interface Product {
  sku: string;
  name: string;
  category: string;
  subcategory?: string;
  grade?: string;
  bubble_size?: string;
  width?: number;
  length?: number;
  roll_type?: string;
  rolls_per_pack?: number;
  density?: number;
  density_display?: string;
  pack_size?: number;
  pack_unit?: string;
  foam_type?: string;
}

interface EnrichedOrderItem extends OrderItem {
  product?: Product;
}

const WarehouseDashboard = () => {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState("06/23/2025");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Collapsible state for each category
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    bubbleWrap: false,
    tape: false,
    instapak: false,
    stretchWrap: false,
    equipment: false
  });

  const [searchTerm, setSearchTerm] = useState("");
  
  // Product cache - load all products once on mount
  const [productCache, setProductCache] = useState<Map<string, Product>>(new Map());
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Load ALL products once when component mounts (cached for entire session)
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        console.log('🔄 Loading product cache...');
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        
        const cache = new Map<string, Product>();
        snapshot.docs.forEach(doc => {
          const data = doc.data() as Product;
          cache.set(data.sku, data);
        });
        
        setProductCache(cache);
        setProductsLoaded(true);
        console.log(`✅ Cached ${cache.size} products in memory`);
      } catch (error) {
        console.error('❌ Failed to load product cache:', error);
        setProductsLoaded(true); // Continue even if cache fails
      }
    };
    
    loadAllProducts();
  }, []); // Empty dependency - runs once on mount

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.location) {
          console.log("Waiting for user location...");
          return;
        }

        const today = new Date();
        const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const unixMs = midnight.getTime();

        console.log(`Fetching orders from: ${new Date(unixMs).toLocaleString()}`);

        const orderRef = collection(db, "orders");
        const expectedLocationFormat = `ABB - ${user.location}`;
        
        const q = query(
          orderRef,
          where("timeStamp", ">=", unixMs),
          where("location", "==", expectedLocationFormat)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log(`No orders found for location ${user.location} today.`);
          setOrders([]);
          return;
        }

        const fetchedOrders: Order[] = querySnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as Order)
        );

        console.log(`Found ${fetchedOrders.length} orders for ABB - ${user.location}:`, fetchedOrders);
        setOrders(fetchedOrders);

      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (user?.location) {
      fetchOrders();
    }
  }, [user?.location]);

  const unshippedOrders = orders.filter((order) => order.shipped === false);
  const shippedOrders = orders.filter((order) => order.shipped === true);

  // Extract all items from unshipped orders with CACHED product enrichment
  const getAllOrderItems = (): EnrichedOrderItem[] => {
    const allItems: OrderItem[] = [];
    
    unshippedOrders.forEach(order => {
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          allItems.push({
            name: item.name || 'Unknown Product',
            sku: item.sku || 'Unknown SKU',
            upc: item.upc,
            quantity: item.quantity || 1,
            orderNumber: order.orderNumber,
            orderId: order.id,
            priority: order.priority,
            timeStamp: order.timeStamp
          });
        });
      }
    });
    
    // Enrich with CACHED product data (instant, no network calls!)
    const enrichedItems: EnrichedOrderItem[] = allItems.map(item => ({
      ...item,
      product: productCache.get(item.sku) // Fast cache lookup!
    }));
    
    console.log('📦 Order items processed:', {
      totalItems: allItems.length,
      withProductData: enrichedItems.filter(item => item.product).length,
      cacheSize: productCache.size,
      sampleEnrichedItem: enrichedItems[0]
    });
    
    return enrichedItems;
  };

  // Use cached enriched items (recalculated when orders or cache changes)
  const enrichedOrderItems = getAllOrderItems();

  // Filter items by category using clean product data
  const bubbleWrapItems = enrichedOrderItems.filter(item => 
    item.product?.category === 'bubble_wrap'
  );
  
  const instapakItems = enrichedOrderItems.filter(item => 
    item.product?.category === 'instapak'
  );

  // Debug logging
  console.log('Bubble wrap items:', bubbleWrapItems);
  console.log('Instapak items:', instapakItems);
  console.log('Bubble wrap count:', bubbleWrapItems.length);
  console.log('Instapak count:', instapakItems.length);

  // Calculate totals from actual order data
  const bubbleWrapTotal = bubbleWrapItems.length;
  const instapakTotal = instapakItems.length;
  const otherItemsTotal = enrichedOrderItems.filter(item => 
    item.product?.category !== 'bubble_wrap' && item.product?.category !== 'instapak'
  ).length;

  // Calculate high priority counts from actual orders
  const bubbleWrapHighPriority = bubbleWrapItems.filter(item => item.priority > 5).length;
  const instapakHighPriority = instapakItems.filter(item => item.priority > 5).length;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Collapsible Matrix Component
  const CollapsibleMatrix = ({ 
    title, 
    icon, 
    totalItems, 
    highPriorityCount, 
    isExpanded, 
    onToggle, 
    children, 
    gradient 
  }: {
    title: string;
    icon: string;
    totalItems: number;
    highPriorityCount: number;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    gradient: string;
  }) => (
    <div className="space-y-2 mb-4">
      {/* Summary Card */}
      <div
        className={`group flex items-center justify-between bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg p-3 border-l-4 border-l-blue-400 border-r border-t border-b border-slate-600/50 hover:bg-slate-600/70 transition-all duration-200 cursor-pointer`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-8 h-8 bg-gradient-to-r ${gradient} rounded-lg flex items-center justify-center text-sm`}>
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-medium text-white">{title}</h4>
              {highPriorityCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-300">
                  {highPriorityCount} HIGH
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400">
              Click to expand detailed matrix
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span className={`bg-gradient-to-r ${gradient} text-white px-3 py-1 rounded-full text-sm font-bold shadow-md min-w-[3rem] text-center`}>
            {totalItems}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>
      
      {/* Expanded Matrix */}
      {isExpanded && (
        <div className="ml-4 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );

  // Bubble Wrap Matrix Content - Now using clean product data!
  const BubbleWrapMatrixContent = () => {
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
    const sizes = [...new Set(bubbleWrapItems.map(item => item.product?.bubble_size).filter(Boolean))].sort();
    const widths = [...new Set(bubbleWrapItems.map(item => item.product?.width).filter(Boolean))].sort((a, b) => a - b);
    const rollTypes = ['single', 'double', 'triple', 'quad'];
    
    console.log('Matrix data - Sizes:', sizes, 'Widths:', widths);
    
    return (
      <div className="space-y-4">
        <div className="text-xs text-slate-400 mb-3">
          📋 {bubbleWrapItems.length} bubble wrap items in {new Set(bubbleWrapItems.map(item => item.orderNumber)).size} orders
        </div>
        
        {sizes.map(size => {
          const sizeItems = bubbleWrapItems.filter(item => item.product?.bubble_size === size);
          if (sizeItems.length === 0) return null;
          
          return (
            <div key={size} className="bg-slate-700/30 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-white">{size}" Bubble</span>
                <span className="text-xs text-slate-400">({sizeItems.length} items)</span>
              </div>
              
              <div className="bg-slate-800/30 rounded p-2">
                <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(4, 1fr)` }}>
                  {/* Header row */}
                  <div className="text-xs text-slate-400 font-medium">Width</div>
                  <div className="text-xs text-slate-400 font-medium text-center">Single</div>
                  <div className="text-xs text-slate-400 font-medium text-center">Double</div>
                  <div className="text-xs text-slate-400 font-medium text-center">Triple</div>
                  <div className="text-xs text-slate-400 font-medium text-center">Quad</div>
                  
                  {/* Data rows - use dynamic widths from actual data */}
                  {widths.map(width => {
                    const widthItems = sizeItems.filter(item => item.product?.width === width);
                    if (widthItems.length === 0) return null;
                    
                    return (
                      <React.Fragment key={width}>
                        <div className="text-xs font-medium text-slate-300 py-2">{width}\"</div>
                        {rollTypes.map(rollType => {
                          const matchingItems = widthItems.filter(item => item.product?.roll_type === rollType);
                          const count = matchingItems.length;
                          
                          return (
                            <div key={rollType} className="text-center">
                              {count > 0 ? (
                                <div className="bg-slate-600/50 rounded p-2 relative cursor-pointer hover:bg-slate-500/50 transition-colors group">
                                  <div className="text-sm font-bold text-white">{count}</div>
                                  <div className={`w-2 h-2 mx-auto mt-1 rounded-full ${
                                    matchingItems.some(item => item.priority > 5) ? 'bg-red-400' :
                                    matchingItems.some(item => item.priority > 2) ? 'bg-yellow-400' : 'bg-green-400'
                                  } animate-pulse`}></div>
                                  
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                    <div className="max-h-24 overflow-y-auto">
                                      {matchingItems.map((item, idx) => (
                                        <div key={idx} className="mb-1">
                                          <div>Order: {item.orderNumber}</div>
                                          <div className="text-slate-300">{item.product?.grade}</div>
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

  // Instapak Matrix Content - Now using clean product data!
  const InstapakMatrixContent = () => {
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
    const densities = [...new Set(instapakItems.map(item => item.product?.density_display).filter(Boolean))].sort();
    
    return (
      <div className="space-y-3">
        <div className="text-xs text-slate-400 mb-2">
          📋 {instapakItems.length} Instapak items in {new Set(instapakItems.map(item => item.orderNumber)).size} orders
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {densities.map(density => {
            const densityItems = instapakItems.filter(item => item.product?.density_display === density);
            
            return (
              <div key={density} className="bg-slate-600/50 rounded-lg p-3 text-center relative cursor-pointer hover:bg-slate-500/50 transition-colors group">
                <div className="text-sm font-medium text-white mb-1">{density}</div>
                <div className="text-lg font-bold text-orange-400 mb-1">{densityItems.length}</div>
                <div className="text-xs text-slate-400">orders</div>
                <div className={`w-2 h-2 mx-auto mt-2 rounded-full ${
                  densityItems.some(item => item.priority > 5) ? 'bg-red-400' :
                  densityItems.some(item => item.priority > 2) ? 'bg-yellow-400' : 'bg-green-400'
                } animate-pulse`}></div>
                
                {/* Tooltip showing order details */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  <div className="max-h-32 overflow-y-auto">
                    {densityItems.map((item, idx) => (
                      <div key={idx} className="mb-1">
                        <div>Order: {item.orderNumber}</div>
                        <div className="text-slate-300">{item.product?.name}</div>
                        <div className="text-slate-400">Pack: {item.product?.pack_size}</div>
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

  const carriers = [
    { name: "FedEx", available: true, time: "05/02/25 8:00 am" },
    { name: "USPS", available: true, time: "05/02/25 8:00 am" },
    { name: "UPS", available: false, time: "05/02/25 5:00 pm" },
  ];

  const stats = [
    { label: "Processing", value: unshippedOrders.length.toString(), change: "+5%", positive: true },
    { label: "Shipped Today", value: shippedOrders.length.toString(), change: "+12%", positive: true },
    { label: "Total Orders", value: orders.length.toString(), change: "-3%", positive: true },
    { label: "Efficiency", value: "94%", change: "+2%", positive: true },
  ];

  // Handle loading and error states
  if (loading || !productsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">
            {loading ? 'Loading dashboard...' : 'Loading product catalog...'}
          </p>
          {!productsLoaded && (
            <p className="text-slate-500 text-sm mt-2">
              Caching {productCache.size > 0 ? productCache.size : 92} products for faster performance
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Please log in to view the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 overflow-hidden">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              GOOD MORNING {user?.firstName?.toUpperCase()} @ ABB-{user?.location}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Warehouse Management Dashboard
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-700">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
          <div className="w-10 h-10 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-700">
            <div className="w-5 h-5 bg-gradient-to-r from-slate-400 to-slate-600 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Three Equal Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-12rem)]">
        {/* Column 1: Enhanced Labels Printed */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-medium">TODAY</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">{shippedOrders.length}</div>
              <div className="text-xs text-slate-400">Shipped</div>
            </div>

            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-300 font-medium">PENDING</span>
              </div>
              <div className="text-2xl font-bold text-amber-400">{unshippedOrders.length}</div>
              <div className="text-xs text-slate-400">Orders</div>
            </div>
          </div>

          {/* Enhanced Labels Section */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 min-h-[400px]">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              Labels Printed
            </h2>

            <div className="flex flex-row gap-4 h-[350px]">
              <div className="flex-1">
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

              <div className="flex-1">
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
        </div>

        {/* Column 2: Enhanced Date Selector & Packages */}
        <div className="space-y-4">
          {/* Enhanced Date Selector */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
            <div className="flex items-center justify-between mb-3">
              <button className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-105">
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>

              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-medium text-slate-400">Select Date</h3>
                </div>
                <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl px-3 py-2 text-sm font-medium border border-slate-600">
                  {selectedDate}
                </div>
              </div>

              <button className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-105">
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">Saturday</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-600">
                <span className="text-sm text-slate-400">Sunday</span>
              </div>
            </div>
          </div>

          {/* Enhanced Packages to Ship with Clean Product Data */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
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
            <div className="mb-4">
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
              <div className="mb-4 bg-slate-700/20 rounded-lg p-3">
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

            {/* Clean Product-Based Matrices */}
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-blue-500/20 hover:scrollbar-thumb-blue-500/40 scrollbar-thumb-rounded-full pr-2">
              
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
                  <BubbleWrapMatrixContent />
                </CollapsibleMatrix>
              )}

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
                  <InstapakMatrixContent />
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

              {/* Show message if orders exist but no bubble wrap or instapak */}
              {unshippedOrders.length > 0 && bubbleWrapItems.length === 0 && instapakItems.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <div className="bg-slate-700/30 rounded-lg p-6">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No Bubble Wrap or Instapak Orders</h3>
                    <p className="text-sm mb-3">
                      You have {unshippedOrders.length} unshipped orders, but none contain bubble wrap or Instapak items.
                    </p>
                    <div className="text-xs text-slate-500">
                      Other items in orders: {otherItemsTotal}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Column 3: Enhanced Pickup & Performance */}
        <div className="space-y-4">
          {/* Enhanced Pickup Availability */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl"></div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              Pickup Availability
            </h3>

            <div className="space-y-3">
              {carriers.map((carrier, idx) => (
                <div
                  key={idx}
                  className={`group relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${
                    carrier.available
                      ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 hover:border-emerald-400/50"
                      : "bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30 hover:border-red-400/50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-lg">{carrier.name}</span>
                    <div className="flex items-center gap-2">
                      {carrier.available ? (
                        <>
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <XCircle className="w-5 h-5 text-red-400" />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 font-medium">{carrier.time}</div>
                  <div
                    className={`text-xs mt-2 px-2 py-1 rounded-full inline-block font-medium ${
                      carrier.available
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {carrier.available ? "Available" : "Unavailable"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Performance Metrics */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 min-h-[400px] relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-purple-500/5 to-transparent"></div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Performance Metrics
            </h3>

            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-2">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl p-3 border border-slate-600/50"
                  >
                    <div className="text-xs text-slate-400 mb-1">{stat.label}</div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div
                      className={`text-xs flex items-center gap-1 ${
                        stat.positive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button className="group flex flex-col items-center gap-2 text-slate-400 hover:text-purple-300 transition-all duration-200 hover:scale-105">
                <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-200">
                  <ExternalLink className="w-5 h-5" />
                </div>
                <span className="text-sm text-center font-medium">
                  View Detailed<br />Analytics
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;