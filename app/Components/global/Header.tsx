import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Package, Activity, ChevronDown } from 'lucide-react';

interface User {
  firstName: string;
  location?: string;
  userType: string;
}

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get available departments based on user type
  const getDepartmentOptions = () => {
    if (!user) return [];
    
    switch (user.userType.toLowerCase()) {
      case 'warehouse':
        return []; // No dropdown - warehouse users stay on warehouse page
      
      case 'printer':
        return ['Printer', 'Customer Service'];
      
      case 'customer service':
      case 'customerservice':
        return ['Customer Service', 'Printer'];
      
      case 'manager':
        return [
          'Manager',
          'Customer Service', 
          'Printer',
          'ABB1 Warehouse',
          'ABB2 Warehouse',
          'ABB3 Warehouse',
          'ABB4 Warehouse',
          'ABB5 Warehouse',
          'ABB6 Warehouse',
          'ABB7 Warehouse',
          'ABB8 Warehouse',
          'ABBMO Warehouse'
        ];
      
      default:
        return [];
    }
  };

  // Set current department based on pathname
  useEffect(() => {
    const path = pathname.toLowerCase();
    
    if (path.includes('/customer-service')) {
      setSelectedDepartment('Customer Service');
    } else if (path.includes('/printer')) {
      setSelectedDepartment('Printer');
    } else if (path.includes('/manager')) {
      setSelectedDepartment('Manager');
    } else if (path.includes('/warehouse')) {
      // Check for location parameter in URL
      const urlParams = new URLSearchParams(window.location.search);
      const location = urlParams.get('location');
      
      if (location && user?.userType.toLowerCase() === 'manager') {
        // Map the URL location parameter back to display format
        const locationMap: { [key: string]: string } = {
          '1': 'ABB1 Warehouse',
          '2': 'ABB2 Warehouse', 
          '3': 'ABB3 Warehouse',
          '4': 'ABB4 Warehouse',
          '5': 'ABB5 Warehouse',
          '6': 'ABB6 Warehouse',
          '7': 'ABB7 Warehouse',
          '8': 'ABB8 Warehouse',
          'mo': 'ABBMO Warehouse'
        };
        
        setSelectedDepartment(locationMap[location] || 'Warehouse');
      } else if (user?.userType.toLowerCase() === 'warehouse') {
        setSelectedDepartment('Warehouse');
      } else {
        setSelectedDepartment('Warehouse');
      }
    } else {
      // Default based on user type
      if (user?.userType.toLowerCase() === 'warehouse') {
        setSelectedDepartment('Warehouse');
      } else if (user?.userType.toLowerCase() === 'printer') {
        setSelectedDepartment('Printer');
      } else if (user?.userType.toLowerCase() === 'customer service' || user?.userType.toLowerCase() === 'customerservice') {
        setSelectedDepartment('Customer Service');
      } else if (user?.userType.toLowerCase() === 'manager') {
        setSelectedDepartment('Manager');
      }
    }
  }, [pathname, user]);

  // Handle department navigation
  const handleDepartmentChange = (department: string) => {
    setSelectedDepartment(department);
    setIsDropdownOpen(false);

    // Navigate based on selection
    switch (department) {
      case 'Customer Service':
        router.push('/customer-service');
        break;
      
      case 'Printer':
        router.push('/printer');
        break;
      
      case 'Manager':
        router.push('/manager');
        break;
      
      case 'Warehouse':
        router.push('/warehouse');
        break;
      
      default:
        // Handle warehouse location selections for managers
        if (department.includes('Warehouse')) {
          // Map display names to URL parameters
          const locationUrlMap: { [key: string]: string } = {
            'ABB1 Warehouse': '1',
            'ABB2 Warehouse': '2',
            'ABB3 Warehouse': '3',
            'ABB4 Warehouse': '4',
            'ABB5 Warehouse': '5',
            'ABB6 Warehouse': '6',
            'ABB7 Warehouse': '7',
            'ABB8 Warehouse': '8',
            'ABBMO Warehouse': 'mo'
          };
          
          const locationParam = locationUrlMap[department];
          if (locationParam) {
            router.push(`/warehouse?location=${locationParam}`);
          }
        }
        break;
    }
  };

  const departments = getDepartmentOptions();
  const showDropdown = departments.length > 0;

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
            GOOD MORNING {user?.firstName?.toUpperCase()}
            {user?.userType.toLowerCase() === 'warehouse' && user?.location && ` @ ABB-${user?.location}`}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {selectedDepartment} Management Dashboard
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Conditional Department Select */}
        {showDropdown ? (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-700 flex items-center gap-2 hover:border-slate-600 transition-all"
            >
              <span className="text-sm font-medium">{selectedDepartment}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full mt-2 right-0 bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-700 shadow-xl z-50 min-w-[180px] max-h-64 overflow-y-auto">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => handleDepartmentChange(dept)}
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
        ) : (
          // Static display for warehouse users (no dropdown)
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-700">
            <span className="text-sm font-medium">{selectedDepartment}</span>
          </div>
        )}

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