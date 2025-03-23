import React, { useState } from 'react';
import { SearchIcon, FilterIcon, ChevronDownIcon } from './Icons';
import { Priority } from './Todo';

interface TodoToolbarProps {
  onSearch: (query: string) => void;
  onFilter: (filters: TodoFilters) => void;
  totalTodos: number;
  completedTodos: number;
}

export interface TodoFilters {
  status: 'all' | 'active' | 'completed';
  priority: 'all' | Priority;
}

export const TodoToolbar: React.FC<TodoToolbarProps> = ({
  onSearch,
  onFilter,
  totalTodos,
  completedTodos,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TodoFilters>({
    status: 'all',
    priority: 'all',
  });
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterChange = (key: keyof TodoFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
    
    // Close dropdowns
    setShowStatusDropdown(false);
    setShowPriorityDropdown(false);
  };

  const activeTodos = totalTodos - completedTodos;

  return (
    <div className="toolbar">
      <div className="flex items-center space-x-4">
        <div className="search-container">
          <SearchIcon className="search-icon" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="hidden md:flex text-sm">
          <span>{totalTodos} {totalTodos === 1 ? 'task' : 'tasks'}</span>
          <span className="mx-2">•</span>
          <span>{activeTodos} active</span>
          <span className="mx-2">•</span>
          <span>{completedTodos} completed</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="dropdown">
          <button 
            className="btn btn-outline flex items-center space-x-1"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <FilterIcon className="mr-1" />
            <span>Status: {filters.status === 'all' ? 'All' : filters.status}</span>
            <ChevronDownIcon />
          </button>
          
          {showStatusDropdown && (
            <div className="dropdown-menu show">
              <button 
                className="dropdown-item"
                onClick={() => handleFilterChange('status', 'all')}
              >
                All
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleFilterChange('status', 'active')}
              >
                Active
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleFilterChange('status', 'completed')}
              >
                Completed
              </button>
            </div>
          )}
        </div>
        
        <div className="dropdown">
          <button 
            className="btn btn-outline flex items-center space-x-1"
            onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
          >
            <FilterIcon className="mr-1" />
            <span>Priority: {filters.priority === 'all' ? 'All' : filters.priority}</span>
            <ChevronDownIcon />
          </button>
          
          {showPriorityDropdown && (
            <div className="dropdown-menu show">
              <button 
                className="dropdown-item"
                onClick={() => handleFilterChange('priority', 'all')}
              >
                All
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleFilterChange('priority', 'high')}
              >
                High
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleFilterChange('priority', 'medium')}
              >
                Medium
              </button>
              <button 
                className="dropdown-item"
                onClick={() => handleFilterChange('priority', 'low')}
              >
                Low
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 