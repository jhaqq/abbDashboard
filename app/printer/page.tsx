"use client";

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
import { Product, EnrichedOrderItem } from "../components/products/definitions";
import { CSOrder, CSProduct, CSOrderItem } from "../components/customer-service/shared-interfaces";

// Components
import Header from "../components/global/Header";
import DateSelector from "../components/global/DateSelector";
import CSLabelsPrinted from "../components/customer-service/CSLabelsPrinted";
import OrderSearch from "../components/customer-service/OrderSearch";
import PickupAvailability from "../components/printer/PickupAvailability";
import { OrderDetailsModal } from "../components/global/OrderDetailsModal";

export interface OrderItem {
  name: string;
  sku: string;
  upc?: string;
  quantity?: number;
  orderNumber: string;
  orderId: string;
  priority?: number;
  timeStamp: number;
}

const PrinterDashboard = () => {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isSaturdayActive, setIsSaturdayActive] = useState<boolean>(false);
  const [isSundayActive, setIsSundayActive] = useState<boolean>(false);
  const [orders, setOrders] = useState<CSOrder[]>([]);
  const [saturdayOrders, setSaturdayOrders] = useState<CSOrder[]>([]);
  const [sundayOrders, setSundayOrders] = useState<CSOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchResults, setSearchResults] = useState<CSOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<CSOrder | null>(null);

  // Product cache - load all products once on mount
  const [productCache, setProductCache] = useState<Map<string, Product>>(
    new Map()
  );
  const [productsLoaded, setProductsLoaded] = useState(false);

  // Load ALL products once when component mounts (cached for entire session)
  useEffect(() => {
    const loadAllProducts = async () => {
      try {
        console.log("🔄 Loading product cache...");
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);

        const cache = new Map<string, Product>();
        snapshot.docs.forEach((doc) => {
          const data = doc.data() as Product;
          cache.set(data.sku, data);
        });

        setProductCache(cache);
        setProductsLoaded(true);
        console.log(`✅ Cached ${cache.size} products in memory`);
      } catch (error) {
        console.error("❌ Failed to load product cache:", error);
        setProductsLoaded(true);
      }
    };

    loadAllProducts();
  }, []);

  // Helper function to get midnight timestamp for a given date
  const getMidnightTimestamp = (date: Date): number => {
    const midnight = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    return midnight.getTime();
  };

  // Helper function to get the previous Saturday from a given date
  const getPreviousSaturday = (date: Date): Date => {
    const saturday = new Date(date);
    saturday.setDate(saturday.getDate() - 2);
    return saturday;
  };

  // Helper function to get the previous Sunday from a given date
  const getPreviousSunday = (date: Date): Date => {
    const sunday = new Date(date);
    sunday.setDate(sunday.getDate() - 1);
    return sunday;
  };

  // Fetch orders for any location (Printer sees all locations like Customer Service)
  const fetchOrdersAllLocations = async (date: Date) => {
    try {
      const unixMs = getMidnightTimestamp(date);
      console.log(
        `Fetching orders from ALL locations for ${date.toDateString()}: ${new Date(
          unixMs
        ).toLocaleString()}`
      );

      const orderRef = collection(db, "orders");

      const q = query(
        orderRef,
        where("timeStamp", ">=", unixMs),
        where("timeStamp", "<", unixMs + 24 * 60 * 60 * 1000),
        orderBy("timeStamp", "desc"),
        limit(500)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log(`No orders found for ${date.toDateString()}.`);
        return [];
      }

      const fetchedOrders: CSOrder[] = querySnapshot.docs
        .map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as CSOrder)
        )
        .filter((order) => order.location && order.location.startsWith("ABB"));

      console.log(
        `Found ${fetchedOrders.length} orders from all ABB locations on ${date.toDateString()}`
      );
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
      console.log(
        `📅 Fetching Saturday orders for ${saturdayDate.toDateString()}`
      );

      const orders = await fetchOrdersAllLocations(saturdayDate);
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

      const orders = await fetchOrdersAllLocations(sundayDate);
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
    if (selectedDate.getDay() === 1) {
      console.log(
        "📅 Monday detected - auto-enabling Saturday and Sunday toggles"
      );
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

        const mainOrders = await fetchOrdersAllLocations(selectedDate);
        setOrders(mainOrders);

        if (selectedDate.getDay() === 1) {
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

          if (promises.length > 0) {
            await Promise.all(promises);
          }
        } else {
          setSaturdayOrders([]);
          setSundayOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    if (productsLoaded) {
      fetchAllRelevantOrders();
    }
  }, [selectedDate, isSaturdayActive, isSundayActive, productsLoaded]);

  // Handle date selector changes
  const handleDateChange = useCallback(
    (dateData: {
      selectedDate: Date;
      isSaturdayActive: boolean;
      isSundayActive: boolean;
    }) => {
      console.log("📅 Date selector changed:", {
        date: dateData.selectedDate.toDateString(),
        saturday: dateData.isSaturdayActive,
        sunday: dateData.isSundayActive,
      });

      setSelectedDate(dateData.selectedDate);
      setIsSaturdayActive(dateData.isSaturdayActive);
      setIsSundayActive(dateData.isSundayActive);
    },
    []
  );

  // Handle order click with proper typing
  const handleOrderClick = useCallback((order: CSOrder) => {
    setSelectedOrder(order);
  }, []);

  // Handle order search
  const handleOrderSearch = async (orderNumber: string) => {
    try {
      console.log("🔍 Searching for order:", orderNumber);
      
      const allCurrentOrders = [...orders, ...saturdayOrders, ...sundayOrders];
      let foundOrder = allCurrentOrders.find(
        order => order.orderNumber.toLowerCase().includes(orderNumber.toLowerCase())
      );

      if (foundOrder) {
        setSearchResults(foundOrder);
        return;
      }

      const orderRef = collection(db, "orders");
      const q = query(
        orderRef,
        where("orderNumber", "==", orderNumber),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];
        foundOrder = {
          id: orderDoc.id,
          ...orderDoc.data(),
        } as CSOrder;
        
        setSearchResults(foundOrder);
      } else {
        setSearchResults(null);
        console.log("Order not found:", orderNumber);
      }
    } catch (error) {
      console.error("Error searching for order:", error);
      setSearchResults(null);
    }
  };

  // Combine all orders for processing
  const allOrders = [...orders, ...saturdayOrders, ...sundayOrders];
  const unshippedOrders = allOrders.filter((order) => order.shipped === false);
  const shippedOrders = allOrders.filter((order) => order.shipped === true);

  if (!productsLoaded) {
    return (
      <div className="h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-300 text-sm">
            🔄 Loading product catalog... (
            {productCache.size > 0 ? productCache.size : 0}/~92 products)
          </p>
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
    <div className="h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white p-4 sm:p-6 flex flex-col overflow-hidden">
      {/* Header */}
      <Header user={user} />

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <p className="text-red-400">Error: {error}</p>
        </div>
      )}

      {/* Three Column Layout - Responsive */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-h-0 mt-4">
        
        {/* Column 1: Labels Printed */}
        <div className="flex flex-col gap-4 min-h-0">
          <CSLabelsPrinted
            shippedOrders={shippedOrders}
            unshippedOrders={unshippedOrders}
            productCache={productCache}
            allOrders={allOrders}
            loading={loading}
          />
        </div>

        {/* Column 2: Date Selector & Pickup Availability */}
        <div className="flex flex-col gap-4 min-h-0">
          <DateSelector
            selectedDate={selectedDate}
            isSaturdayActive={isSaturdayActive}
            isSundayActive={isSundayActive}
            onDateChange={handleDateChange}
          />

          <PickupAvailability />
        </div>

        {/* Column 3: Order Search */}
        <div className="flex flex-col gap-4 min-h-0">
          <OrderSearch
            onSearch={handleOrderSearch}
            searchResults={searchResults}
            productCache={productCache}
            onOrderClick={handleOrderClick}
            loading={loading}
          />
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          productCache={productCache}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default PrinterDashboard;