import { useState } from 'react'

interface OrderSearchProps {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
  onOrderFound?: (orderData: any) => void;
}

const OrderSearch: React.FC<OrderSearchProps> = ({
  placeholder = "Order or Tracking Number.....",
  onSearch,
  onOrderFound
}) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch?.(value)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      console.log('Searching for:', searchTerm)
      
      const mockOrderData = {
        id: searchTerm,
        found: true
      }
      
      onOrderFound?.(mockOrderData)
    }
  }

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4">Order Search</h2>
      <input 
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 text-center rounded-lg border border-slate-600 text-sm sm:text-base"
        style={{backgroundColor: 'var(--color-container)'}}
      />
      
      {searchTerm && (
        <div className="mt-2 text-xs sm:text-sm text-gray-400 text-center">
          Press Enter to search for "{searchTerm}"
        </div>
      )}
    </div>
  )
}

export default OrderSearch