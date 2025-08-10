import React, { useState } from 'react';
import { Package, Activity, ChevronDown } from 'lucide-react';

interface User {
  firstName?: string;
  location?: string;
}

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('Warehouse');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const departments = ['Warehouse', 'Customer Service'];

  return (
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
            GOOD MORNING {user?.firstName?.toUpperCase()} @ ABB-{user?.location}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {selectedDepartment} Management Dashboard
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Custom Department Select */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-700 flex items-center gap-2 hover:border-slate-600 transition-all"
          >
            <span className="text-sm font-medium">{selectedDepartment}</span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl z-50 min-w-[140px]">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700/50 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                    selectedDepartment === dept ? 'text-cyan-400 bg-cyan-500/10' : 'text-white'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          )}
        </div>

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

      {/* Backdrop for dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Header;