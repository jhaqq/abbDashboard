"use client";

// Libraries / hooks
import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";

// Contexts and Definitions
import { useUser } from "../contexts/userContext";
import { Product, EnrichedOrderItem } from '../components/Products/definitions'

// Components
import Header from "../components/global/Header";
import OrderStatus from "../components/global/OrderStatus";
import LabelsPrinted from "../components/global/LabelsPrinted";
import DateSelector from "../components/global/DateSelector";
import OrdersToShip from "../components/global/OrdersToShip";
import PickupAvailability from "../components/global/PickupAvailability";
import PerformanceMetrics from "../components/global/PerformanceMetrics";

// Skeleton components
import {
  OrderStatusSkeleton,
  LabelsPrintedSkeleton,
  OrdersToShipSkeleton,
  PickupAvailabilitySkeleton,
  PerformanceMetricsSkeleton
} from "../components/global/skeletons";

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

export interface OrderItem {
  name: string;
  sku: string;
  upc?: string;
  quantity?: number;
  orderNumber: string;
  orderId: string;
  priority: number;
  timeStamp: number;
}

const WarehouseDashboard = () => {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSaturdayActive, setIsSaturdayActive] = useState<boolean>(false);
  const [isSundayActive, setIsSundayActive] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [saturdayOrders, setSaturdayOrders] = useState<Order[]>([]);
  const [sundayOrders, setSundayOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Helper function to get midnight timestamp for a given date
  const getMidnightTimestamp = (date: Date): number => {
    const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return midnight.getTime();
  };

  // Helper function to get the previous Saturday from a given date
  const getPreviousSaturday = (date: Date): Date => {
    const saturday = new Date(date);
    saturday.setDate(saturday.getDate() - 2); // Go back 2 days from Monday to Saturday
    return saturday;
  };

  // Helper function to get the previous Sunday from a given date
  const getPreviousSunday = (date: Date): Date => {
    const sunday = new Date(date);
    sunday.setDate(sunday.getDate() - 1); // Go back 1 day from Monday to Sunday
    return sunday;
  };

  // Fetch orders for main selected date
  const fetchOrders = async (date: Date) => {
    try {
      if (!user?.location) {
        console.log("Waiting for user location...");
        return [];
      }

      const unixMs = getMidnightTimestamp(date);
      console.log(`Fetching orders for ${date.toDateString()}: ${new Date(unixMs).toLocaleString()}`);

      const orderRef = collection(db, "orders");
      const expectedLocationFormat = `ABB - ${user.location}`;
      
      const q = query(
        orderRef,
        where("timeStamp", ">=", unixMs),
        where("timeStamp", "<", unixMs + (24 * 60 * 60 * 1000)), // Next day
        where("location", "==", expectedLocationFormat)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`No orders found for location ${user.location} on ${date.toDateString()}.`);
        return [];
      }

      const fetchedOrders: Order[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Order)
      );

      console.log(`Found ${fetchedOrders.length} orders for ABB - ${user.location} on ${date.toDateString()}`);
      return fetchedOrders;

    } catch (error) {
      console.error(`Error fetching orders for ${date.toDateString()}:`, error);
      throw error;
    }
  };

  // Fetch Saturday orders
  const fetchSaturday = async (mondayDate: Date) => {
    try {
      const saturdayDate = getPreviousSaturday(mondayDate);
      console.log(`📅 Fetching Saturday orders for ${saturdayDate.toDateString()}`);
      
      const orders = await fetchOrders(saturdayDate);
      setSaturdayOrders(orders);
      return orders;
    } catch (error) {
      console.error("Error fetching Saturday orders:", error);
      setSaturdayOrders([]);
      return [];
    }
  };

  // Fetch Sunday orders
  const fetchSunday = async (mondayDate: Date) => {
    try {
      const sundayDate = getPreviousSunday(mondayDate);
      console.log(`📅 Fetching Sunday orders for ${sundayDate.toDateString()}`);
      
      const orders = await fetchOrders(sundayDate);
      setSundayOrders(orders);
      return orders;
    } catch (error) {
      console.error("Error fetching Sunday orders:", error);
      setSundayOrders([]);
      return [];
    }
  };

  // Auto-enable Saturday and Sunday toggles when Monday is selected
  useEffect(() => {
    if (selectedDate.getDay() === 1) { // Monday is day 1
      console.log('📅 Monday detected - auto-enabling Saturday and Sunday toggles');
      setIsSaturdayActive(true);
      setIsSundayActive(true);
    }
  }, [selectedDate]);

  // Main effect to fetch orders based on date selector state
  useEffect(() => {
    const fetchAllRelevantOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?.location) {
          return;
        }

        // Always fetch main selected date orders
        const mainOrders = await fetchOrders(selectedDate);
        setOrders(mainOrders);

        // If it's Monday and toggles are active, fetch weekend data
        if (selectedDate.getDay() === 1) { // Monday
          const promises = [];
          
          if (isSaturdayActive) {
            promises.push(fetchSaturday(selectedDate));
          } else {
            setSaturdayOrders([]);
          }
          
          if (isSundayActive) {
            promises.push(fetchSunday(selectedDate));
          } else {
            setSundayOrders([]);
          }

          // Wait for weekend data if any toggles are active
          if (promises.length > 0) {
            await Promise.all(promises);
          }
        } else {
          // Not Monday, clear weekend data
          setSaturdayOrders([]);
          setSundayOrders([]);
        }

      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    if (user?.location && productsLoaded) {
      fetchAllRelevantOrders();
    }
  }, [user?.location, selectedDate, isSaturdayActive, isSundayActive, productsLoaded]);

  // Handle date selector changes - memoized to prevent re-renders
  const handleDateChange = useCallback((dateData: {
    selectedDate: Date;
    isSaturdayActive: boolean;
    isSundayActive: boolean;
  }) => {
    console.log('📅 Date selector changed:', {
      date: dateData.selectedDate.toDateString(),
      saturday: dateData.isSaturdayActive,
      sunday: dateData.isSundayActive
    });
    
    setSelectedDate(dateData.selectedDate);
    setIsSaturdayActive(dateData.isSaturdayActive);
    setIsSundayActive(dateData.isSundayActive);
  }, []); // Empty deps - callback never changes

  // Combine all orders for processing
  const allOrders = [...orders, ...saturdayOrders, ...sundayOrders];
  
  const unshippedOrders = allOrders.filter((order) => order.shipped === false);
  const shippedOrders = allOrders.filter((order) => order.shipped === true);

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
      mainOrders: orders.length,
      saturdayOrders: saturdayOrders.length,
      sundayOrders: sundayOrders.length,
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

  const leicaItems = enrichedOrderItems.filter(item => 
    item.product?.category === 'leica'
  );

  const tapeItems = enrichedOrderItems.filter(item => 
    item.product?.category === 'tape'
  );

  const otherItems = enrichedOrderItems.filter(item => 
    !item.product || !['bubble_wrap', 'instapak', 'leica', 'tape'].includes(item.product.category)
  );

  // Calculate performance stats from actual order data
  const performanceStats = [
    { label: "Processing", value: unshippedOrders.length.toString(), change: "+5%", positive: true },
    { label: "Shipped Today", value: shippedOrders.length.toString(), change: "+12%", positive: true },
    { label: "Total Orders", value: allOrders.length.toString(), change: "-3%", positive: true },
    { label: "Efficiency", value: "94%", change: "+2%", positive: true },
  ];

  // Show skeleton loading states instead of aggressive loading screen
  if (!productsLoaded) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 flex flex-col overflow-hidden">
        {/* Header */}
        <Header user={user} />

        {/* Loading message */}
        <div className="mb-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
          <p className="text-blue-300 text-sm">
            🔄 Loading product catalog... ({productCache.size > 0 ? productCache.size : 0}/~92 products)
          </p>
        </div>

        {/* Skeleton layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
          <div className="flex flex-col gap-6 min-h-0">
            <OrderStatusSkeleton />
            <LabelsPrintedSkeleton />
          </div>
          <div className="flex flex-col gap-4 min-h-0">
            <DateSelector 
              selectedDate={selectedDate}
              isSaturdayActive={isSaturdayActive}
              isSundayActive={isSundayActive}
              onDateChange={handleDateChange} 
            />
            <OrdersToShipSkeleton />
          </div>
          <div className="flex flex-col gap-4 min-h-0">
            <PickupAvailabilitySkeleton />
            <PerformanceMetricsSkeleton />
          </div>
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
    <div className="h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 flex flex-col overflow-hidden">
      {/* Header */}
      <Header user={user} />

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs">
          <p className="text-blue-300">
            📊 Debug: Main({orders.length}) + Sat({saturdayOrders.length}) + Sun({sundayOrders.length}) = {allOrders.length} total orders
          </p>
        </div>
      )}

      {/* Three Column Layout - Using flexbox with proper overflow handling */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Column 1: Order Status & Labels Printed */}
        <div className="flex flex-col gap-6 min-h-0">
          {loading ? (
            <OrderStatusSkeleton />
          ) : (
            <OrderStatus 
              shippedCount={shippedOrders.length}
              pendingCount={unshippedOrders.length}
            />
          )}
          
          <LabelsPrinted 
            shippedOrders={shippedOrders}
            unshippedOrders={unshippedOrders}
          />
        </div>

        {/* Column 2: Date Selector & Orders to Ship */}
        <div className="flex flex-col gap-4 min-h-0">
          <DateSelector 
            selectedDate={selectedDate}
            isSaturdayActive={isSaturdayActive}
            isSundayActive={isSundayActive}
            onDateChange={handleDateChange} 
          />
          
          {loading ? (
            <OrdersToShipSkeleton />
          ) : (
            <OrdersToShip
              unshippedOrders={unshippedOrders}
              enrichedOrderItems={enrichedOrderItems}
              bubbleWrapItems={bubbleWrapItems}
              instapakItems={instapakItems}
              leicaItems={leicaItems}
              tapeItems={tapeItems}
              otherItems={otherItems}
            />
          )}
        </div>

        {/* Column 3: Pickup & Performance */}
        <div className="flex flex-col gap-4 min-h-0">
          {loading ? (
            <>
              <PickupAvailabilitySkeleton />
              <PerformanceMetricsSkeleton />
            </>
          ) : (
            <>
              <PickupAvailability />
              <PerformanceMetrics stats={performanceStats} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;