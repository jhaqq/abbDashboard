import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface Carrier {
  name: string;
  available: boolean;
  time: string;
}

interface PickupAvailabilityProps {
  carriers?: Carrier[];
}

const PickupAvailability: React.FC<PickupAvailabilityProps> = ({ carriers }) => {
  const defaultCarriers: Carrier[] = [
    { name: "FedEx", available: true, time: "05/02/25 8:00 am" },
    { name: "USPS", available: true, time: "05/02/25 8:00 am" },
    { name: "UPS", available: false, time: "05/02/25 5:00 pm" },
  ];

  const carrierList = carriers || defaultCarriers;

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl"></div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-cyan-400" />
        Pickup Availability
      </h3>

      <div className="space-y-3">
        {carrierList.map((carrier, idx) => (
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
  );
};

export default PickupAvailability;