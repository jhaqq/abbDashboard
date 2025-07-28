interface PerformanceMetricsProps {
  className?: string;
}

interface MetricData {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'red' | 'blue' | 'yellow';
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  className = ""
}) => {
   const metrics: MetricData[] = [
    {
      label: "Orders Processed Today",
      value: 247,
      trend: 'up',
      color: 'green'
    },
    {
      label: "Average Processing Time",
      value: "4.2 min",
      trend: 'down',
      color: 'green'
    },
    {
      label: "Orders Pending",
      value: 23,
      trend: 'down',
      color: 'yellow'
    },
    {
      label: "Error Rate",
      value: "1.2%",
      trend: 'up',
      color: 'red'
    },
    {
      label: "Efficiency Score",
      value: "94.7%",
      trend: 'up',
      color: 'green'
    },
    {
      label: "Labels Printed/Hour",
      value: 45,
      trend: 'neutral',
      color: 'blue'
    }
  ];

  // Function to get the color classes for each metric
  const getColorClasses = (color?: string) => {
    switch (color) {
      case 'green':
        return 'text-green-400 border-green-400/30';
      case 'red':
        return 'text-red-400 border-red-400/30';
      case 'yellow':
        return 'text-yellow-400 border-yellow-400/30';
      case 'blue':
        return 'text-blue-400 border-blue-400/30';
      default:
        return 'text-gray-400 border-gray-400/30';
    }
  };

  // Function to get trend indicator
  const getTrendIndicator = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <span className="text-green-400 text-xs">↑</span>;
      case 'down':
        return <span className="text-red-400 text-xs">↓</span>;
      default:
        return <span className="text-gray-400 text-xs">→</span>;
    }
  };

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className={`p-3 border rounded-lg ${getColorClasses(metric.color)}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-300 mb-1">{metric.label}</p>
                <p className="text-lg font-semibold">{metric.value}</p>
              </div>
              <div className="text-right">
                {getTrendIndicator(metric.trend)}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary section */}
      <div className="mt-6 p-4 border border-slate-600 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Daily Summary</h4>
        <p className="text-xs text-gray-400">
          System is operating at 94.7% efficiency with low error rates. 
          Processing time has improved by 15% compared to yesterday.
        </p>
      </div>
    </div>
  )
}

export default PerformanceMetrics