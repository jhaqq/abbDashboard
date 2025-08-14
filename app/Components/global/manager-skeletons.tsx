import React from 'react';

// Base skeleton component with shimmer animation
const SkeletonBase: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-slate-700/30 animate-pulse rounded ${className}`} />
);

// Skeleton for CSLabelsPrinted component
export const CSLabelsPrintedSkeleton: React.FC = () => (
  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative animate-pulse">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-amber-500" />
    
    {/* Header */}
    <div className="flex items-center gap-2 mb-4">
      <SkeletonBase className="w-5 h-5 rounded-full" />
      <SkeletonBase className="h-5 w-28" />
      <SkeletonBase className="h-4 w-24 ml-2" />
    </div>

    {/* Location Toggles */}
    <div className="mb-4 flex flex-wrap gap-2">
      {[...Array(4)].map((_, i) => (
        <SkeletonBase key={i} className="h-8 w-12 rounded-lg" />
      ))}
    </div>

    {/* Two Column Layout */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
      {/* Shipped Orders */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20 relative overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SkeletonBase className="w-4 h-4 rounded-full" />
            <SkeletonBase className="h-4 w-16" />
          </div>
          <SkeletonBase className="h-6 w-8 rounded-full" />
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-4 pr-2">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="flex items-center gap-1 mb-2 px-1">
                  <SkeletonBase className="w-3 h-3 rounded-full" />
                  <SkeletonBase className="h-3 w-16" />
                  <SkeletonBase className="w-3 h-3 ml-1" />
                </div>
                <div className="space-y-2">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30">
                      <div className="flex justify-between items-start mb-2">
                        <SkeletonBase className="h-4 w-24" />
                        <SkeletonBase className="h-3 w-12" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <SkeletonBase className="w-3 h-3 rounded-full" />
                        <SkeletonBase className="h-3 w-16" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <SkeletonBase className="w-3 h-3 rounded-full" />
                          <SkeletonBase className="h-3 w-20" />
                        </div>
                        <SkeletonBase className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unshipped Orders */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20 relative overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SkeletonBase className="w-4 h-4 rounded-full" />
            <SkeletonBase className="h-4 w-16" />
          </div>
          <SkeletonBase className="h-6 w-8 rounded-full" />
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="space-y-4 pr-2">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <div className="flex items-center gap-1 mb-2 px-1">
                  <SkeletonBase className="w-3 h-3 rounded-full" />
                  <SkeletonBase className="h-3 w-16" />
                  <SkeletonBase className="w-3 h-3 ml-1" />
                </div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30">
                      <div className="flex justify-between items-start mb-2">
                        <SkeletonBase className="h-4 w-24" />
                        <SkeletonBase className="h-3 w-12" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <SkeletonBase className="w-3 h-3 rounded-full" />
                        <SkeletonBase className="h-3 w-16" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <SkeletonBase className="w-3 h-3 rounded-full" />
                          <SkeletonBase className="h-3 w-20" />
                        </div>
                        <SkeletonBase className="h-3 w-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton for OrderSearch component
export const OrderSearchSkeleton: React.FC = () => (
  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative animate-pulse">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
    
    {/* Header */}
    <div className="flex items-center gap-2 mb-4">
      <SkeletonBase className="w-5 h-5 rounded-full" />
      <SkeletonBase className="h-5 w-24" />
    </div>

    {/* Search Form */}
    <div className="mb-4">
      <div className="relative">
        <SkeletonBase className="h-12 w-full rounded-lg" />
      </div>
    </div>

    {/* Search Results Area */}
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="text-center py-8">
        <SkeletonBase className="w-12 h-12 mx-auto mb-3 rounded-full" />
        <SkeletonBase className="h-4 w-32 mx-auto mb-2" />
        <SkeletonBase className="h-3 w-48 mx-auto" />
      </div>
    </div>
  </div>
);

// Skeleton for PickupAvailability component (Manager version - shows all locations)
export const ManagerPickupAvailabilitySkeleton: React.FC = () => (
  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-slate-700/50 flex-1 flex flex-col min-h-0 relative animate-pulse">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
    
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <SkeletonBase className="w-5 h-5 rounded-full" />
        <SkeletonBase className="h-5 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <SkeletonBase className="h-3 w-20" />
        <SkeletonBase className="w-4 h-4 rounded" />
      </div>
    </div>

    {/* Availability Matrix */}
    <div className="flex-1 overflow-auto">
      <div className="min-w-max">
        {/* Header Row */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          <SkeletonBase className="h-4 w-16" />
          <SkeletonBase className="h-4 w-12" />
          <SkeletonBase className="h-4 w-8" />
          <SkeletonBase className="h-4 w-10" />
        </div>

        {/* Location Rows */}
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              {/* Location Name */}
              <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                <SkeletonBase className="h-4 w-12" />
              </div>

              {/* Carrier Status Indicators */}
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30 flex items-center justify-center">
                  <SkeletonBase className="w-6 h-6 rounded-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Legend */}
    <div className="mt-4 pt-4 border-t border-slate-700/50">
      <div className="flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <SkeletonBase className="w-3 h-3 rounded-full" />
          <SkeletonBase className="h-3 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBase className="w-3 h-3 rounded-full" />
          <SkeletonBase className="h-3 w-20" />
        </div>
      </div>
    </div>
  </div>
);

// Full Manager Dashboard skeleton layout
export const ManagerDashboardSkeleton: React.FC = () => (
  <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-h-0 mt-4">
    {/* Left Column - Labels Printed */}
    <div className="flex flex-col gap-4 min-h-0">
      <CSLabelsPrintedSkeleton />
    </div>

    {/* Center Column - Date Selector & Pickup Availability */}
    <div className="flex flex-col gap-4 min-h-0">
      {/* DateSelector Skeleton - Keep compact to match real component */}
      <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500" />
        <div className="flex items-center justify-between mb-3">
          <SkeletonBase className="w-4 h-4 rounded" />
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <SkeletonBase className="w-4 h-4 rounded-full" />
              <SkeletonBase className="h-3 w-20" />
            </div>
            <SkeletonBase className="h-8 w-28 mx-auto rounded-xl" />
          </div>
          <SkeletonBase className="w-4 h-4 rounded" />
        </div>
      </div>
      
      <ManagerPickupAvailabilitySkeleton />
    </div>

    {/* Right Column - Order Search */}
    <div className="flex flex-col gap-4 min-h-0">
      <OrderSearchSkeleton />
    </div>
  </div>
);