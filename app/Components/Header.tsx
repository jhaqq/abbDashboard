import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface HeaderProps {
  userName?: string;
  location?: string;
  showDropdown?: boolean;
  dropdownOptions?: string[];
  onDropdownChange?: (option: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  userName = "NAME",
  location = "",
  showDropdown = false,
  dropdownOptions = [],
  onDropdownChange,
}) => {
  return (
    <header className="absolute top-0 right-0 left-0 h-16 flex">
      <div className="flex items-center justify-start px-4 min-w-[200px]">
        <Image
          src="/DashboardLogo.png"
          width={53}
          height={53}
          alt="American Bubble Bou Logo"
          className="h-10 w-10"
        />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <h1 className="font-semibold text-2xl text-white">
          GOOD MORNING #{userName}# {location && `@ ${location}`}
        </h1>
      </div>

      <div className="flex items-center justify-center px-4 min-w-[200px]">
        {showDropdown && dropdownOptions.length > 0 && (
          <div className="relative">
            <select
              className="text-white pl-4 pr-8 py-2 rounded border appearance-none cursor-pointer min-w-[160px]"
              onChange={(e) => onDropdownChange?.(e.target.value)}
              defaultValue={dropdownOptions[0]}
            >
              {dropdownOptions.map((option, index) => (
                <option key={index} value={option} className="bg-background">
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none"/>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
