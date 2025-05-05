// Component for displaying spending insights

import React from 'react';
import { SpendingInsight } from '../../types';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb, PieChart, Clock } from 'lucide-react';

interface InsightCardProps {
  insight: SpendingInsight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  // Determine icon based on insight type
  const getIcon = () => {
    switch (insight.type) {
      case 'category':
        return <PieChart size={20} />;
      case 'time':
        return <Clock size={20} />;
      case 'comparison':
        return insight.isPositive ? (
          <TrendingDown size={20} />
        ) : (
          <TrendingUp size={20} />
        );
      case 'suggestion':
        return <Lightbulb size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  // Determine background color based on insight type
  const getBackgroundColor = () => {
    switch (insight.type) {
      case 'category':
        return 'bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-400';
      case 'time':
        return 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
      case 'comparison':
        return insight.isPositive
          ? 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400'
          : 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400';
      case 'suggestion':
        return 'bg-yellow-50 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400';
      default:
        return 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="flex bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className={`p-6 ${getBackgroundColor()}`}>
        {getIcon()}
      </div>
      <div className="p-4 flex-1">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white">
          {insight.title}
        </h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          {insight.description}
        </p>
        
        {insight.type === 'comparison' && insight.percentageChange !== undefined && (
          <div className="mt-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              insight.isPositive
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              {insight.isPositive ? '-' : '+'}
              {Math.abs(insight.percentageChange).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}