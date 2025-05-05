// Component for displaying a list or grid of expenses

import React, { useState } from 'react';
import { Expense, Category } from '../../types';
import ExpenseCard from './ExpenseCard';
import ExpenseForm from './ExpenseForm';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/currencyUtils';
import { Plus, Search, Filter, SortAsc, SortDesc, Grid, List } from 'lucide-react';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
  onUpdateExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

export default function ExpenseList({
  expenses,
  categories,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}: ExpenseListProps) {
  const { preferences } = useApp();
  
  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(preferences.defaultView === 'list' ? 'list' : 'grid');
  
  // Filtering and sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'amount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Filter and sort expenses
  const filteredAndSortedExpenses = expenses
    .filter((expense) => {
      const matchesSearch = expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.notes?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortDirection === 'asc'
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
    });
  
  // Calculate total amount for filtered expenses
  const totalAmount = filteredAndSortedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );
  
  // Handle editing an expense
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };
  
  // Toggle sort direction when clicking on same field
  const handleSortChange = (field: 'date' | 'amount') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  return (
    <>
      {(showForm || editingExpense) && (
        <div className="mb-6">
          <ExpenseForm
            expense={editingExpense}
            categories={categories}
            onSubmit={(expense) => {
              if ('id' in expense) {
                onUpdateExpense(expense);
              } else {
                onAddExpense(expense);
              }
              setShowForm(false);
              setEditingExpense(undefined);
            }}
            onCancel={() => {
              setShowForm(false);
              setEditingExpense(undefined);
            }}
            onDelete={onDeleteExpense}
          />
        </div>
      )}
      
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 appearance-none dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter size={16} className="text-gray-400" />
              </div>
            </div>
            
            {/* Sort Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSortChange('date')}
                className={`px-3 py-2 rounded-md focus:outline-none ${
                  sortField === 'date'
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label="Sort by date"
              >
                {sortField === 'date' ? (
                  sortDirection === 'asc' ? (
                    <SortAsc size={16} />
                  ) : (
                    <SortDesc size={16} />
                  )
                ) : (
                  'Date'
                )}
              </button>
              
              <button
                onClick={() => handleSortChange('amount')}
                className={`px-3 py-2 rounded-md focus:outline-none ${
                  sortField === 'amount'
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label="Sort by amount"
              >
                {sortField === 'amount' ? (
                  sortDirection === 'asc' ? (
                    <SortAsc size={16} />
                  ) : (
                    <SortDesc size={16} />
                  )
                ) : (
                  'Amount'
                )}
              </button>
              
              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md focus:outline-none"
                aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
              >
                {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
              </button>
              
              {/* Add Expense Button */}
              <button
                onClick={() => {
                  setEditingExpense(undefined);
                  setShowForm(true);
                }}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                aria-label="Add new expense"
              >
                <Plus size={16} className="mr-1" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Total For Filtered Expenses */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedExpenses.length} of {expenses.length} expenses • Total:{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {formatCurrency(totalAmount, preferences.defaultCurrency)}
            </span>
          </p>
        </div>
      </div>
      
      {filteredAndSortedExpenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No expenses found matching your filters.</p>
          {!showForm && (
            <button
              onClick={() => {
                setEditingExpense(undefined);
                setShowForm(true);
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-2" />
              Add Your First Expense
            </button>
          )}
        </div>
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredAndSortedExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              category={categories.find((c) => c.id === expense.category)}
              onEdit={handleEditExpense}
              onDelete={onDeleteExpense}
            />
          ))}
        </div>
      )}
    </>
  );
}