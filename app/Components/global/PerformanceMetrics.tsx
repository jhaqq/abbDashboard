import React from 'react';
import { BarChart3, ExternalLink, TrendingUp } from 'lucide-react';

interface Stat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

interface PerformanceMetricsProps {
  stats?: Stat[];
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ stats }) => {
  const defaultStats: Stat[] = [
    { label: "Processing", value: "12", change: "+5%", positive: true },
    { label: "Shipped Today", value: "8", change: "+12%", positive: true },
    { label: "Total Orders", value: "20", change: "-3%", positive: true },
    { label: "Efficiency", value: "94%", change: "+2%", positive: true },
  ];

  const statsList = stats || defaultStats;

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 flex-1 min-h-0 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-purple-500/5 to-transparent"></div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-purple-400" />
        Performance Metrics
      </h3>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2">
          {statsList.map((stat, idx) => (
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
  );
};

export default PerformanceMetrics;