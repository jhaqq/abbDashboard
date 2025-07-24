import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateSelectorProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  selectedDays?: string[];
  onDayToggle?: (day: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate = "2025-06-23",
  onDateChange,
  selectedDays = [],
  onDayToggle,
}) => {
  const handlePrevDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() - 1);
    const newDate = date.toISOString().split("T")[0];
    onDateChange?.(newDate);
  };

  const handleNextDay = () => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + 1);
    const newDate = date.toISOString().split("T")[0];
    onDateChange?.(newDate);
  };

  const handleDayChange = (day: string) => {
    onDayToggle?.(day);
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Date Selection */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <button
          onClick={handlePrevDay}
          className="text-white hover:text-gray-300 text-xl sm:text-2xl"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div
          className="flex items-center space-x-2 px-3 py-2 rounded text-sm sm:text-base"
          style={{ backgroundColor: "var(--color-container)" }}
        >
          <span className="hidden sm:inline">Select Date:</span>
          <span className="sm:hidden">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange?.(e.target.value)}
            onClick={(e) => {
              const target = e.target as HTMLInputElement;
              if (target.showPicker) {
                target.showPicker();
              }
            }}
            className="bg-slate-600 border border-slate-500 rounded px-2 py-1 text-white text-sm hover:bg-slate-500 transition-colors"
            style={{
              colorScheme: "dark",
            }}
          />
        </div>

        <button
          onClick={handleNextDay}
          className="text-white hover:text-gray-300 text-xl sm:text-2xl"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Day Selection */}
      <div className="flex justify-center space-x-4 sm:space-x-6">
        {["Saturday", "Sunday"].map((day) => (
          <label
            key={day}
            className="flex items-center space-x-2 text-sm sm:text-base"
          >
            <input
              type="checkbox"
              checked={selectedDays.includes(day)}
              onChange={() => handleDayChange(day)}
              className="rounded"
            />
            <span>{day}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default DateSelector;
