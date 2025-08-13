import React from 'react';

// Base skeleton component with shimmer animation
const SkeletonBase: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`bg-slate-700/30 animate-pulse rounded ${className}`} />
);

// Skeleton for OrderStatus component
export const OrderStatusSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 gap-3">
    <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30">
      <div className="flex items-center gap-2 mb-2">
        <SkeletonBase className="w-4 h-4 rounded-full" />
        <SkeletonBase className="h-3 w-12" />
      </div>
      <SkeletonBase className="h-8 w-8 mb-1" />
      <SkeletonBase className="h-3 w-16" />
    </div>
    
    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-4 border border-amber-500/30">
      <div className="flex items-center gap-2 mb-2">
        <SkeletonBase className="w-4 h-4 rounded-full" />
        <SkeletonBase className="h-3 w-12" />
      </div>
      <SkeletonBase className="h-8 w-8 mb-1" />
      <SkeletonBase className="h-3 w-16" />
    </div>
  </div>
);

// Skeleton for individual order items in lists
export const OrderItemSkeleton: React.FC = () => (
  <div className="bg-slate-700/20 rounded-lg p-3 border border-slate-600/30">
    <div className="flex justify-between items-start mb-2">
      <SkeletonBase className="h-4 w-20" />
      <SkeletonBase className="h-3 w-12" />
    </div>
    <SkeletonBase className="h-3 w-full mb-2" />
    <div className="flex justify-between items-center">
      <SkeletonBase className="h-3 w-16" />
      <SkeletonBase className="h-6 w-16 rounded-full" />
    </div>
  </div>
);

// Skeleton for LabelsPrinted component
export const LabelsPrintedSkeleton: React.FC = () => (
  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 flex-1">
    <div className="flex items-center gap-2 mb-4">
      <SkeletonBase className="w-5 h-5 rounded-full" />
      <SkeletonBase className="h-5 w-28" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
      {/* Shipped orders skeleton */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SkeletonBase className="w-4 h-4 rounded-full" />
            <SkeletonBase className="h-4 w-16" />
          </div>
          <SkeletonBase className="h-6 w-8 rounded-full" />
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {[...Array(3)].map((_, i) => (
            <OrderItemSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Unshipped orders skeleton */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SkeletonBase className="w-4 h-4 rounded-full" />
            <SkeletonBase className="h-4 w-20" />
          </div>
          <SkeletonBase className="h-6 w-8 rounded-full" />
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {[...Array(4)].map((_, i) => (
            <OrderItemSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Skeleton for OrdersToShip component
export const OrdersToShipSkeleton: React.FC = () => (
  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 flex-1 overflow-hidden">
    <div className="flex items-center gap-2 mb-4">
      <SkeletonBase className="w-5 h-5 rounded-full" />
      <SkeletonBase className="h-5 w-32" />
    </div>
    
    {/* Category grid skeleton */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <SkeletonBase className="h-4 w-20" />
            <SkeletonBase className="h-6 w-8 rounded-full" />
          </div>
          <SkeletonBase className="h-3 w-24" />
        </div>
      ))}
    </div>

    {/* Orders list skeleton */}
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {[...Array(5)].map((_, i) => (
        <OrderItemSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Skeleton for PickupAvailability component
export const PickupAvailabilitySkeleton: React.FC = () => (
  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50">
    <div className="flex items-center gap-2 mb-4">
      <SkeletonBase className="w-5 h-5 rounded-full" />
      <SkeletonBase className="h-5 w-32" />
    </div>
    
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 rounded-xl border border-slate-600/30 bg-slate-700/20">
          <div className="flex items-center justify-between mb-2">
            <SkeletonBase className="h-5 w-16" />
            <SkeletonBase className="w-4 h-4 rounded-full" />
          </div>
          <SkeletonBase className="h-3 w-24" />
        </div>
      ))}
    </div>
  </div>
);

// Skeleton for PerformanceMetrics component
export const PerformanceMetricsSkeleton: React.FC = () => (
  <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
    <div className="flex items-center gap-2 mb-4">
      <SkeletonBase className="w-5 h-5 rounded-full" />
      <SkeletonBase className="h-5 w-28" />
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="text-center">
          <SkeletonBase className="h-8 w-12 mx-auto mb-2" />
          <SkeletonBase className="h-3 w-16 mx-auto mb-1" />
          <SkeletonBase className="h-3 w-10 mx-auto" />
        </div>
      ))}
    </div>

    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <SkeletonBase className="w-12 h-12 rounded-2xl" />
        <SkeletonBase className="h-8 w-20" />
      </div>
    </div>
  </div>
);