import React, { useState, useEffect } from 'react';
import { Truck, Package, RefreshCw } from 'lucide-react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

interface CarrierData {
  name: string;
  available: boolean;
  lastUpdated: any; // Firebase Timestamp
}

interface LocationData {
  location: string;
  managedBy: string;
  managerID?: string;
  createdAt: any;
  lastUpdated: any;
  carriers: {
    fedex: CarrierData;
    ups: CarrierData;
    usps: CarrierData;
  };
}

interface CarrierAvailability {
  FEDEX: boolean;
  UPS: boolean;
  USPS: boolean;
}

interface LocationAvailability {
  [locationKey: string]: CarrierAvailability;
}

const PickupAvailability: React.FC = () => {
  const [carrierAvailability, setCarrierAvailability] = useState<LocationAvailability>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch locations data from Firebase
  useEffect(() => {
    const locationsRef = collection(db, 'locations');
    
    // Set up real-time listener
    const unsubscribe = onSnapshot(
      locationsRef,
      (snapshot) => {
        try {
          const availability: LocationAvailability = {};
          
          snapshot.docs.forEach((doc) => {
            const data = doc.data() as LocationData;
            const locationId = doc.id;
            
            // Transform Firebase data to component format
            availability[locationId] = {
              FEDEX: data.carriers?.fedex?.available || false,
              UPS: data.carriers?.ups?.available || false,
              USPS: data.carriers?.usps?.available || false,
            };
          });
          
          setCarrierAvailability(availability);
          setLastUpdated(new Date());
          setLoading(false);
          setError(null);
        } catch (err) {
          console.error('Error processing locations data:', err);
          setError('Failed to process locations data');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error fetching locations:', err);
        setError('Failed to fetch pickup availability data');
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Manual refresh function
  const refreshData = async () => {
    setLoading(true);
    try {
      const locationsRef = collection(db, 'locations');
      const snapshot = await getDocs(locationsRef);
      
      const availability: LocationAvailability = {};
      
      snapshot.docs.forEach((doc) => {
        const data = doc.data() as LocationData;
        const locationId = doc.id;
        
        availability[locationId] = {
          FEDEX: data.carriers?.fedex?.available || false,
          UPS: data.carriers?.ups?.available || false,
          USPS: data.carriers?.usps?.available || false,
        };
      });
      
      setCarrierAvailability(availability);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const carriers = ['FEDEX', 'UPS', 'USPS'] as const;
  const locations = Object.keys(carrierAvailability).sort();

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-emerald-500' : 'bg-red-500';
  };

  const getStatusIcon = (isAvailable: boolean) => {
    return isAvailable ? '🟢' : '🔴';
  };

  if (loading) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
        
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-cyan-400" />
          Pickup Availability
        </h2>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading pickup availability...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
        
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-cyan-400" />
          Pickup Availability
        </h2>

        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="text-red-400 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Unable to load pickup data</p>
            <p className="text-sm text-slate-500 mt-1">{error}</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
        
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-cyan-400" />
          Pickup Availability
        </h2>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-slate-400">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No locations found</p>
            <p className="text-sm text-slate-500 mt-1">No pickup locations are configured yet</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Truck className="w-5 h-5 text-cyan-400" />
          Pickup Availability
        </h2>
        
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-slate-400">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refreshData}
            className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-4 h-4 text-slate-400 hover:text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Availability Matrix */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Header Row */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-sm font-medium text-slate-400 py-2">
              Location
            </div>
            {carriers.map((carrier) => (
              <div key={carrier} className="text-sm font-medium text-slate-400 text-center py-2">
                {carrier}
              </div>
            ))}
          </div>

          {/* Location Rows */}
          <div className="space-y-2">
            {locations.map((location) => (
              <div key={location} className="grid grid-cols-4 gap-2 items-center">
                {/* Location Name */}
                <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                  <div className="text-sm font-medium text-white">{location}</div>
                </div>

                {/* Carrier Status Indicators */}
                {carriers.map((carrier) => {
                  const isAvailable = carrierAvailability[location]?.[carrier] || false;
                  return (
                    <div
                      key={`${location}-${carrier}`}
                      className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30 flex items-center justify-center relative group"
                    >
                      {/* Status Light */}
                      <div
                        className={`w-6 h-6 rounded-full ${getStatusColor(
                          isAvailable
                        )} shadow-lg flex items-center justify-center relative`}
                      >
                        {/* Glow effect for available status */}
                        {isAvailable && (
                          <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-pulse"></div>
                        )}
                        
                        {/* Status dot */}
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isAvailable ? 'bg-emerald-300' : 'bg-red-300'
                          }`}
                        ></div>
                      </div>

                      {/* Hover Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
                        {isAvailable ? `${carrier} Available` : `${carrier} Unavailable`}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-l-transparent border-r-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span>Available for Pickup</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupAvailability;