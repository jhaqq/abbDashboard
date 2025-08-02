import { ChevronDown, ChevronUp } from "lucide-react";

export const CollapsibleMatrix = ({ 
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