interface PickupAvailabilityProps {
  className?: string;
}

const PcickupAvailability: React.FC<PickupAvailabilityProps> = ({
  className = ''
}) => {
  const locations = [
    "ABB1", "ABB2", "ABB3", "ABB4", 
    "ABB5", "ABB6", "ABB7", "ABB8"
  ]

  const carriers = ["FEDEX", "UPS", "USPS"];

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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-2 border-b borderslate-600"></th>
            {carriers.map((carrier) =>(
              <th key={carrier} className="text-center p-2 border-b border-slate-600 text-white font-medium">
                {carrier}
              </th>
            ))}
          </tr>
        </thead>
      </table>
    </div>
  )
}