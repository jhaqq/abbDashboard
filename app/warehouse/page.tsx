'use client'

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Package, Truck, Clock, BarChart3, ExternalLink, CheckCircle, XCircle, TrendingUp, Calendar, AlertTriangle, Activity } from 'lucide-react';

const WarehouseDashboard = () => {
  const [selectedDate, setSelectedDate] = useState('06/23/2025');

  const shippedOrders = [
    'Order #113-2565431-7744232',
    'Order #112-4102767-8543429',
    'Order #112-7128507-6526632',
    'Order #112-7128507-6526632',
    'Order #113-8292160-4582667',
    'Order #216205-1',
    'Order #216205',
    'Order #216205-2',
    'Order #112-9300928-7129830',
    'Order #111-1520480-0921820',
    'Order #112-8348262-9536234',
    'Order #113-3273216-9601051',
    'Order #111-0366922-6617039'
  ];

  const unshippedOrders = [
    'Order #114-5870221-9199429',
    'Order #113-8742621-6071400',
    'Order #112-3080067-7901827',
    'Order #111-3902312-6833829',
    'Order #112-1003595-5401835',
    'Order #113-5518431-5267410',
    'Order #113-9189560-7327452',
    'Order #112-4932850-0011409',
    'Order #114-8331426-9296235',
    'Order #114-4861460-7068210',
    'Order #113-2918090-3741800',
    'Order #114-6881779-4372245',
    'Order #113-3386947-3609059'
  ];

  const packageData = [
    // 3/16 - 12"
    { size: '3/16 - 12"', type: 'Single', count: 25 },
    { size: '3/16 - 12"', type: 'Double', count: 15 },
    { size: '3/16 - 12"', type: 'Triple', count: 5 },
    { size: '3/16 - 12"', type: 'Quad', count: 30 },
    // 3/16 - 24"
    { size: '3/16 - 24"', type: 'Single', count: 25 },
    { size: '3/16 - 24"', type: 'Double', count: 15 },
    { size: '3/16 - 24"', type: 'Triple', count: 8 },
    { size: '3/16 - 24"', type: 'Quad', count: 20 },
    // 5/16 - 12"
    { size: '5/16 - 12"', type: 'Single', count: 18 },
    { size: '5/16 - 12"', type: 'Double', count: 12 },
    { size: '5/16 - 12"', type: 'Triple', count: 6 },
    { size: '5/16 - 12"', type: 'Quad', count: 22 },
    // 5/16 - 24"
    { size: '5/16 - 24"', type: 'Single', count: 16 },
    { size: '5/16 - 24"', type: 'Double', count: 10 },
    { size: '5/16 - 24"', type: 'Triple', count: 4 },
    { size: '5/16 - 24"', type: 'Quad', count: 14 },
    // 1/8 - 12"
    { size: '1/8 - 12"', type: 'Single', count: 32 },
    { size: '1/8 - 12"', type: 'Double', count: 28 },
    { size: '1/8 - 12"', type: 'Triple', count: 12 },
    { size: '1/8 - 12"', type: 'Quad', count: 35 },
    // 1/8 - 24"
    { size: '1/8 - 24"', type: 'Single', count: 20 },
    { size: '1/8 - 24"', type: 'Double', count: 18 },
    { size: '1/8 - 24"', type: 'Triple', count: 9 },
    { size: '1/8 - 24"', type: 'Quad', count: 26 },
    // 1/2 - 12"
    { size: '1/2 - 12"', type: 'Single', count: 8 },
    { size: '1/2 - 12"', type: 'Double', count: 6 },
    { size: '1/2 - 12"', type: 'Triple', count: 3 },
    { size: '1/2 - 12"', type: 'Quad', count: 11 },
    // 1/2 - 24"
    { size: '1/2 - 24"', type: 'Single', count: 7 },
    { size: '1/2 - 24"', type: 'Double', count: 5 },
    { size: '1/2 - 24"', type: 'Triple', count: 2 },
    { size: '1/2 - 24"', type: 'Quad', count: 9 }
  ];

  const carriers = [
    { name: 'FedEx', available: true, time: '05/02/25 8:00 am' },
    { name: 'USPS', available: true, time: '05/02/25 8:00 am' },
    { name: 'UPS', available: false, time: '05/02/25 5:00 pm' }
  ];

  const stats = [
    { label: 'Processing', value: '23', change: '+5%', positive: true },
    { label: 'Shipped Today', value: '47', change: '+12%', positive: true },
    { label: 'Pending', value: '8', change: '-3%', positive: true },
    { label: 'Efficiency', value: '94%', change: '+2%', positive: true }
  ];

  // Define unique sizes and their corresponding colors
  const sizeConfig = {
    '3/16': { color: 'blue', gradient: 'from-blue-400 to-cyan-400', hoverBorder: 'hover:border-blue-500/50' },
    '5/16': { color: 'purple', gradient: 'from-purple-400 to-pink-400', hoverBorder: 'hover:border-purple-500/50' },
    '1/8': { color: 'emerald', gradient: 'from-emerald-400 to-teal-400', hoverBorder: 'hover:border-emerald-500/50' },
    '1/2': { color: 'orange', gradient: 'from-orange-400 to-red-400', hoverBorder: 'hover:border-orange-500/50' }
  };

  const uniqueSizes = ['3/16', '5/16', '1/8', '1/2'];

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
              GOOD MORNING #NAME# @ ABB-#
            </h1>
            <p className="text-slate-400 text-sm mt-1">Warehouse Management Dashboard</p>
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

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Enhanced Labels Printed */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm rounded-xl p-4 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-emerald-300 font-medium">TODAY</span>
              </div>
              <div className="text-2xl font-bold text-emerald-400">47</div>
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
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 flex-1 h-full">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-cyan-400" />
              Labels Printed
            </h2>
            
            <div className="h-full flex flex-row">
              <div className="flex-1 mb-3">
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-3 border border-emerald-500/20 h-fit relative overflow-hidden">
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
                  
                  {/* Visual representation with recent orders */}
                  <div className="space-y-1 h-[calc(100%-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
                    {shippedOrders.slice(0, 8).map((order, idx) => (
                      <div key={idx} className="text-xs text-emerald-200 font-mono bg-emerald-900/20 rounded px-2 py-1 border border-emerald-500/10 hover:bg-emerald-900/30 transition-colors">
                        {order}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-3 border border-amber-500/20 h-fit relative overflow-hidden">
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
                  
                  {/* Visual representation with recent orders */}
                  <div className="space-y-1 h-[calc(100%-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20 scrollbar-track-transparent">
                    {unshippedOrders.slice(0, 8).map((order, idx) => (
                      <div key={idx} className="text-xs text-amber-200 font-mono bg-amber-900/20 rounded px-2 py-1 border border-amber-500/10 hover:bg-amber-900/30 transition-colors">
                        {order}
                      </div>
                    ))}
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

          {/* Enhanced Packages to Ship */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 flex-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-400" />
              Packages to Ship
            </h3>
            
            <div className="grid grid-cols-2 gap-4 h-[calc(100%-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500/20 scrollbar-track-transparent">
              {uniqueSizes.map((baseSize) => (
                <div key={baseSize} className="space-y-3">
                  {/* 12" variant */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 bg-gradient-to-r ${sizeConfig[baseSize].gradient} rounded-full`}></div>
                      <h4 className={`text-sm font-medium text-${sizeConfig[baseSize].color}-300`}>{baseSize} - 12"</h4>
                    </div>
                    <div className="space-y-1">
                      {packageData.filter(p => p.size === `${baseSize} - 12"`).map((pkg, idx) => (
                        <div key={idx} className={`group flex justify-between items-center bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg p-2 border border-slate-600/50 ${sizeConfig[baseSize].hoverBorder} transition-all duration-200`}>
                          <span className="text-xs font-medium">{pkg.type}</span>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 bg-${sizeConfig[baseSize].color}-400 rounded-full animate-pulse`}></div>
                            <span className={`bg-gradient-to-r from-${sizeConfig[baseSize].color}-500 to-${sizeConfig[baseSize].color === 'purple' ? 'pink' : sizeConfig[baseSize].color === 'orange' ? 'red' : 'cyan'}-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md`}>
                              {pkg.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 24" variant */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 bg-gradient-to-r ${sizeConfig[baseSize].gradient} rounded-full`}></div>
                      <h4 className={`text-sm font-medium text-${sizeConfig[baseSize].color}-300`}>{baseSize} - 24"</h4>
                    </div>
                    <div className="space-y-1">
                      {packageData.filter(p => p.size === `${baseSize} - 24"`).map((pkg, idx) => (
                        <div key={idx} className={`group flex justify-between items-center bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg p-2 border border-slate-600/50 ${sizeConfig[baseSize].hoverBorder} transition-all duration-200`}>
                          <span className="text-xs font-medium">{pkg.type}</span>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 bg-${sizeConfig[baseSize].color}-400 rounded-full animate-pulse`}></div>
                            <span className={`bg-gradient-to-r from-${sizeConfig[baseSize].color}-500 to-${sizeConfig[baseSize].color === 'purple' ? 'pink' : sizeConfig[baseSize].color === 'orange' ? 'red' : 'cyan'}-500 text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-md`}>
                              {pkg.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
                <div key={idx} className={`group relative p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-[1.02] ${
                  carrier.available 
                    ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 hover:border-emerald-400/50' 
                    : 'bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30 hover:border-red-400/50'
                }`}>
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
                  <div className={`text-xs mt-2 px-2 py-1 rounded-full inline-block font-medium ${
                    carrier.available 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {carrier.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Performance Metrics */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 flex-1 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-purple-500/5 to-transparent"></div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              Performance Metrics
            </h3>
            
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-2 gap-2">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl p-3 border border-slate-600/50">
                    <div className="text-xs text-slate-400 mb-1">{stat.label}</div>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className={`text-xs flex items-center gap-1 ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
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
                <span className="text-sm text-center font-medium">View Detailed<br />Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;