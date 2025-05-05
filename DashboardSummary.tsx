// Dashboard summary component for displaying expense overview

import React from 'react';
import { Expense, Category, SavingsGoal, Bill } from '../../types';
import { formatCurrency } from '../../utils/currencyUtils';
import { formatDate, isThisMonth } from '../../utils/dateUtils';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Tag, CreditCard } from 'lucide-react';

interface DashboardSummaryProps {
  expenses: Expense[];
  categories: Category[];
  goals?: SavingsGoal[];
  bills?: Bill[];
  currency: string;
  period: 'week' | 'month' | 'year';
}

export default function DashboardSummary({
  expenses,
  categories,
  goals = [],
  bills = [],
  currency,
  period,
}: DashboardSummaryProps) {
  // Calculate total expenses for the current period
  const currentPeriodExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    
    if (period === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return expenseDate >= startOfWeek;
    } else if (period === 'month') {
      return expenseDate.getMonth() === now.getMonth() && 
             expenseDate.getFullYear() === now.getFullYear();
    } else {
      return expenseDate.getFullYear() === now.getFullYear();
    }
  });
  
  const totalAmount = currentPeriodExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  
  // Calculate previous period for comparison
  const previousPeriodExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    
    if (period === 'week') {
      const startOfPrevWeek = new Date(now);
      startOfPrevWeek.setDate(now.getDate() - now.getDay() - 7);
      const endOfPrevWeek = new Date(now);
      endOfPrevWeek.setDate(now.getDate() - now.getDay() - 1);
      return expenseDate >= startOfPrevWeek && expenseDate <= endOfPrevWeek;
    } else if (period === 'month') {
      const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return expenseDate.getMonth() === prevMonth && 
             expenseDate.getFullYear() === prevYear;
    } else {
      return expenseDate.getFullYear() === now.getFullYear() - 1;
    }
  });
  
  const previousTotalAmount = previousPeriodExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  
  // Calculate percentage change
  const percentageChange = previousTotalAmount === 0
    ? 100
    : ((totalAmount - previousTotalAmount) / previousTotalAmount) * 100;
  
  // Get recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Calculate category spending
  const categorySpending: Record<string, number> = {};
  currentPeriodExpenses.forEach((expense) => {
    categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
  });
  
  // Sort categories by spending
  const topCategories = Object.entries(categorySpending)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([categoryId, amount]) => ({
      category: categories.find((c) => c.id === categoryId),
      amount,
      percentage: (amount / totalAmount) * 100,
    }));
  
  // Calculate upcoming bills
  const upcomingBills = bills
    .filter((bill) => {
      const dueDate = new Date(bill.dueDate);
      const now = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);
      return dueDate >= now && dueDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Spending Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total {period === 'week' ? 'Weekly' : period === 'month' ? 'Monthly' : 'Yearly'} Spending
            </h3>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(totalAmount, currency)}
            </p>
          </div>
          <div className={`p-3 rounded-full ${
            percentageChange > 0
              ? 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
              : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
          }`}>
            {percentageChange > 0 ? (
              <TrendingUp size={24} />
            ) : (
              <TrendingDown size={24} />
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
              percentageChange > 0
                ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            }`}>
              {percentageChange > 0 ? '+' : ''}
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              from previous {period}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {currentPeriodExpenses.length} expenses this {period}
          </div>
        </div>
      </div>
      
      {/* Top Categories Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Top Spending Categories
        </h3>
        
        {topCategories.length > 0 ? (
          <div className="space-y-4">
            {topCategories.map(({ category, amount, percentage }) => (
              <div key={category?.id || 'unknown'} className="flex items-center">
                {category && (
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: category.color }}
                  >
                    <Tag size={16} />
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {category?.name || 'Unknown'}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(amount, currency)}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                        backgroundColor: category?.color || '#9CA3AF',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No category data available for this period.
          </p>
        )}
      </div>
      
      {/* Recent Expenses Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
          Recent Expenses
        </h3>
        
        {recentExpenses.length > 0 ? (
          <div className="space-y-3">
            {recentExpenses.map((expense) => {
              const category = categories.find((c) => c.id === expense.category);
              return (
                <div key={expense.id} className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: category?.color || '#9CA3AF' }}
                  >
                    <CreditCard size={16} />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                        {expense.title}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(expense.amount, expense.currency)}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {formatDate(expense.date, 'short')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No recent expenses to display.
          </p>
        )}
      </div>
      
      {/* Upcoming Bills Card */}
      {upcomingBills.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Upcoming Bills
          </h3>
          
          <div className="space-y-3">
            {upcomingBills.map((bill) => {
              const category = categories.find((c) => c.id === bill.category);
              const daysUntilDue = Math.ceil(
                (new Date(bill.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              return (
                <div key={bill.id} className="flex items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: category?.color || '#9CA3AF' }}
                  >
                    <DollarSign size={16} />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {bill.title}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(bill.amount, bill.currency)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Due in {daysUntilDue} days
                      </p>
                      {bill.isAutoPaid && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          Auto-paid
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Savings Goals Progress Card */}
      {goals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Savings Goals Progress
          </h3>
          
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal) => {
              const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
              
              return (
                <div key={goal.id}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {goal.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatCurrency(goal.currentAmount, goal.currency)} / {formatCurrency(goal.targetAmount, goal.currency)}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(progressPercentage, 100)}%`,
                        backgroundColor: goal.color,
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <p className="text-gray-500 dark:text-gray-400">
                      {progressPercentage.toFixed(0)}% complete
                    </p>
                    {goal.deadline && (
                      <p className="text-gray-500 dark:text-gray-400">
                        Due by {formatDate(goal.deadline, 'short')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}