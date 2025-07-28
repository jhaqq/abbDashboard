interface PickupAvailabilityProps {
  // Optional props for customization
  className?: string;
}

const PickupAvailability: React.FC<PickupAvailabilityProps> = ({
  className = ""
}) => {
  // This represents the locations (ABB1, ABB2, etc.)
  const locations = [
    "ABB1", "ABB2", "ABB3", "ABB4", 
    "ABB5", "ABB6", "ABB7", "ABB8"
  ];

  // This represents the carriers
  const carriers = ["FEDEX", "UPS", "USPS"];

  // Mock data for availability - in a real app, this would come from an API
  // true = available (green), false = not available (red)
  const availabilityData = {
    ABB1: { FEDEX: true, UPS: false, USPS: false },
    ABB2: { FEDEX: false, UPS: false, USPS: false },
    ABB3: { FEDEX: true, UPS: true, USPS: false },
    ABB4: { FEDEX: true, UPS: false, USPS: true },
    ABB5: { FEDEX: true, UPS: false, USPS: false },
    ABB6: { FEDEX: false, UPS: true, USPS: false },
    ABB7: { FEDEX: true, UPS: false, USPS: true },
    ABB8: { FEDEX: true, UPS: false, USPS: false }
  };

  return (
    <div className={`${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-center">Pickup Availability</h3>
      
      {/* The grid container */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Table header with carrier names */}
          <thead>
            <tr>
              <th className="text-left p-2 border-b border-slate-700"></th>
              {carriers.map((carrier) => (
                <th key={carrier} className="text-center p-2 border-b border-slate-700 text-white font-medium">
                  {carrier}
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table body with locations and availability status */}
          <tbody>
            {locations.map((location) => (
              <tr key={location}>
                {/* Location name in the first column */}
                <td className="p-2 border-b border-slate-700 font-medium text-white">
                  {location}
                </td>
                
                {/* Availability indicators for each carrier */}
                {carriers.map((carrier) => (
                  <td key={`${location}-${carrier}`} className="p-2 border-b border-slate-700 text-center">
                    <div 
                      className={`w-6 h-6 rounded mx-auto ${
                        availabilityData[location as keyof typeof availabilityData][carrier as keyof typeof availabilityData.ABB1]
                          ? 'bg-green-500' 
                          : 'bg-red-500'
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PickupAvailability;