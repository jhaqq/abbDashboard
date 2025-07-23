interface PanelProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  borderSide?: 'left' | 'right' | 'both' | 'none';
}

const Panel: React.FC<PanelProps> = ({
  children, 
  className = "", 
  title,
  width = 'md',
  borderSide = 'none'
}) =>{
  const widthClasses = {
    sm: 'w-full md:w-64 lg:w-72',           // Full width on mobile, fixed on larger screens
    md: 'w-full md:w-80 lg:w-96',           // Full width on mobile, fixed on larger screens
    lg: 'w-full md:w-96 xl:w-[420px]',      // Full width on mobile, fixed on larger screens
    xl: 'w-full md:w-[400px] lg:w-[440px] xl:w-[480px]', // More responsive sizing
    full: 'w-full md:flex-1'                // Full width on mobile, flex on larger screens
  }

  const borderClasses = {
    left: 'md:border-l border-slate-700',
    right: 'md:border-r border-slate-700', 
    both: 'md:border-l md:border-r border-slate-700',
    none: ''
  }

  return (
    <div className={`${widthClasses[width]} ${borderClasses[borderSide]} p-2 sm:p-4 h-full flex flex-col ${className}`}>
      <div className="rounded-lg p-2 sm:p-4 flex-1 flex flex-col" style={{backgroundColor: 'var(--color-container)'}}>
        {title && <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">{title}</h2>}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Panel