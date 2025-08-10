import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  return (
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

      <div className="flex justify-center gap-6 pb-4">
        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1 rounded-lg border border-green-500/20">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-green-300">Saturday</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg border border-slate-600">
          <span className="text-sm text-slate-400">Sunday</span>
        </div>
      </div>
    </div>
  );
};

export default DateSelector;