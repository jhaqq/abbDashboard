import React, { useState, useEffect } from "react";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Adjust path as needed
import { useUser } from "@/app/contexts/userContext";

interface CarrierData {
  available: boolean;
  lastUpdated: any; // Firestore timestamp
}

interface LocationDocument {
  location: string; // e.g. "ABB - 1", "Main Office"
  managerID: string;
  carriers: {
    fedex: CarrierData;
    ups: CarrierData;
    usps: CarrierData;
  };
  lastUpdated: any;
}

const PickupAvailability: React.FC = () => {
  const { user } = useUser();
  const [locationData, setLocationData] = useState<LocationDocument | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null); // Track which carrier is being updated
  const [error, setError] = useState<string | null>(null);

  const userLocation = "ABB-" + user?.location;

  // Listen to location data for user's location
  useEffect(() => {
    if (!userLocation) {
      setLoading(false);
      setError("No user location found");
      return;
    }

    console.log(`📍 Listening to location data for: ${userLocation}`);

    const locationRef = doc(db, "locations", userLocation);

    const unsubscribe = onSnapshot(
      locationRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as LocationDocument;
          setLocationData(data);
          setError(null);
          console.log(`📦 Location data loaded for ${userLocation}:`, data);
        } else {
          console.warn(`⚠️  No location document found for: ${userLocation}`);
          setLocationData(null);
          setError(`No location data found for ${userLocation}`);
        }
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error listening to location data:", error);
        setError("Failed to load location data");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.location]);

  // Toggle carrier availability
  const toggleCarrierAvailability = async (
    carrierId: "fedex" | "ups" | "usps"
  ) => {
    if (!user?.location || !locationData || updating) return;

    setUpdating(carrierId);

    try {
      const currentAvailability = locationData.carriers[carrierId]?.available;
      const newAvailability = !currentAvailability;

      console.log(
        `🔄 Toggling ${carrierId} from ${currentAvailability} to ${newAvailability}`
      );

      await updateDoc(doc(db, "locations", userLocation), {
        [`carriers.${carrierId}.available`]: newAvailability,
        [`carriers.${carrierId}.lastUpdated`]: serverTimestamp(),
        lastUpdated: serverTimestamp(),
      });

      console.log(`✅ Successfully toggled ${carrierId} to ${newAvailability}`);
    } catch (error) {
      console.error(`❌ Error toggling ${carrierId}:`, error);
      setError(`Failed to update ${carrierId} status`);
    } finally {
      setUpdating(null);
    }
  };

  // Get carrier display name
  const getCarrierDisplayName = (carrierId: string): string => {
    const names = {
      fedex: "FedEx",
      ups: "UPS",
      usps: "USPS",
    };
    return names[carrierId as keyof typeof names] || carrierId.toUpperCase();
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl"></div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Pickup Availability
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-700/30 animate-pulse rounded-xl p-4 h-20"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl"></div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Pickup Availability
        </h3>
        <div className="text-center py-8 text-red-400">
          <XCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // No location data
  if (!locationData || !locationData.carriers) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl"></div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Pickup Availability
        </h3>
        <div className="text-center py-8 text-slate-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No carrier data available</p>
        </div>
      </div>
    );
  }

  const carrierIds = ["fedex", "ups", "usps"] as const;

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl"></div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-400" />
        Pickup Availability
        {locationData.location && (
          <span className="text-sm text-slate-400 font-normal">
            - {locationData.location}
          </span>
        )}
      </h3>

      <div className="space-y-3">
        {carrierIds.map((carrierId) => {
          const carrierData = locationData.carriers[carrierId];
          if (!carrierData) return null;

          const isUpdating = updating === carrierId;
          const isAvailable = carrierData.available;
          const displayName = getCarrierDisplayName(carrierId);

          return (
            <button
              key={carrierId}
              onClick={() => toggleCarrierAvailability(carrierId)}
              disabled={isUpdating}
              className={`group relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] w-full text-left ${
                isAvailable
                  ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 hover:border-emerald-400/50"
                  : "bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30 hover:border-red-400/50"
              } ${isUpdating ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-lg">{displayName}</span>
                <div className="flex items-center gap-2">
                  {isUpdating ? (
                    <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          isAvailable ? "bg-emerald-400" : "bg-red-400"
                        }`}
                      />
                      {isAvailable ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Status badge and timestamp on same row */}
              <div className="flex items-center justify-between">
                <div
                  className={`text-xs px-2 py-1 rounded-full inline-block font-medium ${
                    isAvailable
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {isAvailable ? "Available" : "Unavailable"}
                </div>

                <div className="text-xs text-slate-400">
                  {carrierData.lastUpdated?.toDate
                    ? new Date(carrierData.lastUpdated.toDate()).toLocaleString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : ""}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Debug info in development */}
      {process.env.NODE_ENV === "development" && locationData && (
        <div className="mt-4 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs">
          <div className="text-blue-300">
            Debug: Location "{locationData.location}" | Manager:{" "}
            {locationData.managerID}
          </div>
        </div>
      )}
    </div>
  );
};

export default PickupAvailability;
