import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle, Circle } from 'lucide-react';

const formatDate = (date: Date): string => {
  if (!(date instanceof Date)) {
    throw new Error('Invalid date provided');
  }
  
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${month}/${day}/${year}`;
}

interface DateSelectorProps {
  selectedDate: Date;
  isSaturdayActive: boolean;
  isSundayActive: boolean;
  onDateChange: (dateData: {
    selectedDate: Date;
    isSaturdayActive: boolean;
    isSundayActive: boolean;
  }) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ 
  selectedDate, 
  isSaturdayActive, 
  isSundayActive, 
  onDateChange 
}) => {
  // Only track the input field value - everything else comes from props
  const [inputValue, setInputValue] = useState<string>(() => formatDate(selectedDate));
  const today: Date = new Date();
  
  // Update input when selectedDate prop changes (from arrows or parent)
  React.useEffect(() => {
    setInputValue(formatDate(selectedDate));
  }, [selectedDate]);
  
  const goToPreviousDay = (): void => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    
    onDateChange({
      selectedDate: previousDay,
      isSaturdayActive,
      isSundayActive
    });
  };
  
  const goToNextDay = (): void => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    if (nextDay <= today) {
      onDateChange({
        selectedDate: nextDay,
        isSaturdayActive,
        isSundayActive
      });
    }
  };
  
  const goToToday = (): void => {
    const todayDate = new Date();
    onDateChange({
      selectedDate: todayDate,
      isSaturdayActive,
      isSundayActive
    });
  };
  
  const isFutureDate = (): boolean => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay > today;
  };

  const isMonday = (date: Date): boolean => {
    return date.getDay() === 1;
  };

  const isToday = (date: Date): boolean => {
    const todayDate = new Date();
    return date.toDateString() === todayDate.toDateString();
  };

  const toggleSaturday = (): void => {
    onDateChange({
      selectedDate,
      isSaturdayActive: !isSaturdayActive,
      isSundayActive
    });
  };

  const toggleSunday = (): void => {
    onDateChange({
      selectedDate,
      isSaturdayActive,
      isSundayActive: !isSundayActive
    });
  };

  const handleDateInput = (value: string): void => {
    setInputValue(value);
  };

  const validateAndSetDate = (): void => {
    const dateMatch = inputValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dateMatch) {
      const month = parseInt(dateMatch[1], 10);
      const day = parseInt(dateMatch[2], 10);
      const year = parseInt(dateMatch[3], 10);
      
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 1900 && year <= 9999) {
        const newDate = new Date(year, month - 1, day);
        
        if (newDate.getMonth() === month - 1 && newDate.getDate() === day && newDate <= today) {
          onDateChange({
            selectedDate: newDate,
            isSaturdayActive,
            isSundayActive
          });
          return;
        }
      }
    }
    
    // Reset to current date if invalid
    setInputValue(formatDate(selectedDate));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      validateAndSetDate();
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleBlur = (): void => {
    validateAndSetDate();
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-500"></div>
      <div className="flex items-center justify-between mb-3">
        <button 
          className="p-2 hover:bg-slate-700/50 rounded-xl transition-all duration-200 hover:scale-105" 
          onClick={goToPreviousDay}
        >
          <ChevronLeft className="w-4 h-4 text-slate-400" />
        </button>

        <div className="text-center">
          <div className="flex items-center gap-2 justify-center mb-1">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-medium text-slate-400">Select Date</h3>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleDateInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            placeholder="MM/DD/YYYY"
            className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl px-3 py-2 text-sm font-medium border border-slate-600 text-center focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all duration-200"
            title="Type date and press Enter or click elsewhere to confirm"
          />
        </div>

        <button 
          className={`p-2 rounded-xl transition-all duration-200 ${
            isFutureDate() 
              ? 'text-slate-600 cursor-not-allowed' 
              : 'hover:bg-slate-700/50 hover:scale-105 text-slate-400'
          }`}
          onClick={goToNextDay}
          disabled={isFutureDate()}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {isMonday(selectedDate) && (
        <div className="flex justify-center gap-6 pb-4">
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all duration-200 hover:scale-105 ${
              isSaturdayActive
                ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'
                : 'border-slate-600 hover:bg-slate-700/50'
            }`}
            onClick={toggleSaturday}
          >
            {isSaturdayActive ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Circle className="w-4 h-4 text-slate-400" />
            )}
            <span className={`text-sm font-medium ${
              isSaturdayActive ? 'text-green-300' : 'text-slate-400'
            }`}>
              Saturday
            </span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-1 rounded-lg border transition-all duration-200 hover:scale-105 ${
              isSundayActive
                ? 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20'
                : 'border-slate-600 hover:bg-slate-700/50'
            }`}
            onClick={toggleSunday}
          >
            {isSundayActive ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Circle className="w-4 h-4 text-slate-400" />
            )}
            <span className={`text-sm font-medium ${
              isSundayActive ? 'text-green-300' : 'text-slate-400'
            }`}>
              Sunday
            </span>
          </button>
        </div>
      )}

      {/* Today button - appears at the bottom when not on today's date */}
      {!isToday(selectedDate) && (
        <div className="flex justify-center pt-2">
          <button
            onClick={goToToday}
            className="px-4 py-1 mb-6 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-400/50 rounded-lg text-sm font-medium text-cyan-300 hover:text-cyan-200 transition-all duration-200 hover:scale-105"
            title="Go to today's date"
          >
            Jump to Today
          </button>
        </div>
      )}
    </div>
  );
};

export default DateSelector;