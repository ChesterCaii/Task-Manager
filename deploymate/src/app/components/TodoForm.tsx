import React, { useState, useEffect } from 'react';
import { PlusIcon, ChevronDownIcon, CalendarIcon } from './Icons';
import { Priority } from './Todo';

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  initialData?: Partial<TodoFormData>;
  isEditing?: boolean;
}

export interface TodoFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [priority, setPriority] = useState<Priority>(initialData?.priority || 'medium');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      setDueDate(initialData.dueDate || '');
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit({
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
    });
    
    if (!isEditing) {
      // Reset form if adding a new todo
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  };

  const getPriorityColor = (p: Priority): string => {
    switch (p) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-body">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={errors.title ? 'border-red-500' : ''}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-500">
            {errors.title}
          </p>
        )}
      </div>
      
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about this task..."
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority
          </label>
          <div className="dropdown w-full">
            <button 
              type="button"
              className="btn btn-outline flex items-center justify-between w-full"
              onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
              id="priority"
            >
              <span className={`capitalize ${getPriorityColor(priority)}`}>
                {priority}
              </span>
              <ChevronDownIcon />
            </button>
            
            {showPriorityDropdown && (
              <div className="dropdown-menu show w-full">
                <button 
                  type="button"
                  className="dropdown-item flex items-center"
                  onClick={() => {
                    setPriority('high');
                    setShowPriorityDropdown(false);
                  }}
                >
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  High
                </button>
                <button 
                  type="button"
                  className="dropdown-item flex items-center"
                  onClick={() => {
                    setPriority('medium');
                    setShowPriorityDropdown(false);
                  }}
                >
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  Medium
                </button>
                <button 
                  type="button"
                  className="dropdown-item flex items-center"
                  onClick={() => {
                    setPriority('low');
                    setShowPriorityDropdown(false);
                  }}
                >
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  Low
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
            Due Date
          </label>
          <div className="date-picker">
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="date-picker-input pl-10"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="mr-1" />
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
}; 