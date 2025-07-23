import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
  userName?: string;
  location?: string;
  showDropdown?: boolean;
  dropdownOptions?: string[];
  onDropdownChange?: (option: string) => void;
  selectedOption?: string;
}

const Header: React.FC<HeaderProps> = ({
  userName = "NAME",
  location = "",
  showDropdown = false,
  dropdownOptions = [],
  onDropdownChange,
  selectedOption,
}) => {
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onDropdownChange?.(value);
  };

  return (
    <header className="absolute top-0 right-0 left-0 h-16 flex bg-gray-900 z-10">
      {/* Left Section - Logo */}
      <div className="flex items-center justify-start px-2 sm:px-4 w-16 sm:w-20 md:w-24 lg:min-w-[200px]">
        <Image
          src="/DashboardLogo.png"
          width={53}
          height={53}
          alt="American Bubble Boy Logo"
          className="h-8 w-8 sm:h-10 sm:w-10"
        />
      </div>

      {/* Center Section - Title */}
      <div className="flex-1 flex items-center justify-center px-2">
        <h1 className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-white text-center">
          <span className="hidden sm:inline">GOOD MORNING </span>
          <span className="sm:hidden">MORNING </span>
          #{userName}# {location && `@ ${location}`}
        </h1>
      </div>

      {/* Right Section - Dropdown */}
      <div className="flex items-center justify-center px-2 sm:px-4 w-16 sm:w-20 md:w-24 lg:min-w-[200px]">
        {showDropdown && dropdownOptions.length > 0 && (
          <div className="relative">
            <select
              className="text-white pl-2 sm:pl-4 pr-6 sm:pr-8 py-1 sm:py-2 rounded border border-gray-500 appearance-none cursor-pointer text-xs sm:text-sm lg:text-base min-w-[100px] sm:min-w-[120px] lg:min-w-[160px] hover:border-gray-400 hover:bg-gray-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              style={{ 
                backgroundColor: '#111827',
                zIndex: 20
              }}
              onChange={handleDropdownChange}
              value={selectedOption || dropdownOptions[0]}
            >
              {dropdownOptions.map((option, index) => (
                <option 
                  key={index} 
                  value={option} 
                  className="text-white"
                  style={{ backgroundColor: '#111827' }}
                >
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-white pointer-events-none"/>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;