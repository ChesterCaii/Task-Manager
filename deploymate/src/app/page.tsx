'use client';

import { useState, useEffect } from 'react';
import { Todo, Priority, Tag } from './components/Todo';
import { Header } from './components/Header';
import { TodoToolbar, TodoFilters } from './components/TodoToolbar';
import { TodoForm, TodoFormData } from './components/TodoForm';
import { AlertIcon, CheckIcon } from './components/Icons';
import { ConfirmDialog } from './components/ConfirmDialog';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { TaskAnalytics } from './components/TaskAnalytics';
import { SubtaskType } from './components/Subtask';

interface TodoItem {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  priority?: Priority;
  dueDate?: string;
  tags?: Tag[];
  subtasks?: SubtaskType[];
}

// Sample tags for demo purposes
const sampleTags: Tag[] = [
  { id: '1', name: 'Work', color: '#4f46e5' },
  { id: '2', name: 'Personal', color: '#10b981' },
  { id: '3', name: 'Urgent', color: '#ef4444' },
  { id: '4', name: 'Learning', color: '#8b5cf6' },
  { id: '5', name: 'Project', color: '#0ea5e9' },
];

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<TodoFilters>({
    status: 'all',
    priority: 'all',
  });
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  
  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [todos, searchQuery, filters]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos');
      
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      
      const data: TodoItem[] = await response.json();
      
      // For demonstration purposes, add random priority and tags to existing todos
      const enhancedData = data.map(todo => ({
        ...todo,
        priority: getRandomPriority(),
        dueDate: Math.random() > 0.5 ? getRandomFutureDate() : undefined,
        tags: Math.random() > 0.7 ? getRandomTags() : [],
        subtasks: Math.random() > 0.5 ? getRandomSubtasks() : [],
      }));
      
      setTodos(enhancedData);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...todos];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(todo => 
        todo.title.toLowerCase().includes(query) || 
        (todo.description && todo.description.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(todo => 
        filters.status === 'completed' ? todo.completed : !todo.completed
      );
    }
    
    // Apply priority filter
    if (filters.priority !== 'all') {
      result = result.filter(todo => todo.priority === filters.priority);
    }
    
    // Sort by priority and due date
    result.sort((a, b) => {
      // First by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority
      const priorityOrder: { [key in Priority]: number } = {
        high: 0,
        medium: 1,
        low: 2
      };
      
      const aPriority = a.priority || 'medium';
      const bPriority = b.priority || 'medium';
      
      if (aPriority !== bPriority) {
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      }
      
      // Then by due date if both have it
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      // Todos with due dates come first
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      
      // Finally by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    setFilteredTodos(result);
  };

  const addTodo = async (formData: TodoFormData) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title: formData.title, 
          description: formData.description 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      
      const newTodo = await response.json();
      
      // Enhance the new todo with the additional form data
      const enhancedTodo = {
        ...newTodo,
        priority: formData.priority,
        dueDate: formData.dueDate,
        tags: Math.random() > 0.7 ? getRandomTags() : [],
        subtasks: [],
      };
      
      setTodos([enhancedTodo, ...todos]);
      setSuccess('Task added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const updateTodo = async (formData: TodoFormData) => {
    if (!editingTodo) return;
    
    try {
      const response = await fetch(`/api/todos/${editingTodo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingTodo,
          title: formData.title,
          description: formData.description,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      const updatedTodo = await response.json();
      
      // Enhance the updated todo with the additional form data
      const enhancedTodo = {
        ...updatedTodo,
        priority: formData.priority,
        dueDate: formData.dueDate,
        tags: editingTodo.tags || [],
        subtasks: editingTodo.subtasks || [],
      };
      
      setTodos(todos.map(todo => (todo.id === editingTodo.id ? enhancedTodo : todo)));
      setEditingTodo(null);
      setSuccess('Task updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      
      if (!todoToUpdate) return;
      
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...todoToUpdate,
          completed: !completed,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      const updatedTodo = await response.json();
      
      // Preserve enhanced properties
      const enhancedTodo = {
        ...updatedTodo,
        priority: todoToUpdate.priority,
        dueDate: todoToUpdate.dueDate,
        tags: todoToUpdate.tags,
        subtasks: todoToUpdate.subtasks,
      };
      
      setTodos(todos.map(todo => (todo.id === id ? enhancedTodo : todo)));
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const confirmDeleteTodo = (id: number) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    if (!todoToDelete) return;
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Task',
      message: `Are you sure you want to delete "${todoToDelete.title}"? This action cannot be undone.`,
      onConfirm: () => {
        deleteTodo(id);
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      setTodos(todos.filter(todo => todo.id !== id));
      setSuccess('Task deleted successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };
  
  const handleEditTodo = (id: number) => {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (todoToEdit) {
      setEditingTodo(todoToEdit);
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleCancelEdit = () => {
    setEditingTodo(null);
  };
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleFilter = (newFilters: TodoFilters) => {
    setFilters(newFilters);
  };

  const handleToggleSubtask = (todoId: number, subtaskId: string) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);
    if (!todoToUpdate || !todoToUpdate.subtasks) return;
    
    const updatedSubtasks = todoToUpdate.subtasks.map(subtask => 
      subtask.id === subtaskId 
        ? { ...subtask, completed: !subtask.completed } 
        : subtask
    );
    
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, subtasks: updatedSubtasks } 
        : todo
    ));
  };

  const handleDeleteSubtask = (todoId: number, subtaskId: string) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);
    if (!todoToUpdate || !todoToUpdate.subtasks) return;
    
    const updatedSubtasks = todoToUpdate.subtasks.filter(subtask => subtask.id !== subtaskId);
    
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, subtasks: updatedSubtasks } 
        : todo
    ));
  };

  const handleAddSubtask = (todoId: number, title: string) => {
    const todoToUpdate = todos.find(todo => todo.id === todoId);
    if (!todoToUpdate) return;
    
    const newSubtask: SubtaskType = {
      id: `subtask-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      completed: false,
    };
    
    const updatedSubtasks = [...(todoToUpdate.subtasks || []), newSubtask];
    
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { ...todo, subtasks: updatedSubtasks } 
        : todo
    ));
  };

  const toggleAnalytics = () => {
    setShowAnalytics(!showAnalytics);
  };

  // Helper functions for demo data
  const getRandomPriority = (): Priority => {
    const priorities: Priority[] = ['high', 'medium', 'low'];
    return priorities[Math.floor(Math.random() * priorities.length)];
  };

  const getRandomFutureDate = (): string => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14 days in the future
    return futureDate.toISOString().split('T')[0];
  };

  const getRandomTags = (): Tag[] => {
    const numTags = Math.floor(Math.random() * 3) + 1; // 1-3 tags
    const shuffled = [...sampleTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  };

  const getRandomSubtasks = (): SubtaskType[] => {
    const numSubtasks = Math.floor(Math.random() * 3) + 1; // 1-3 subtasks
    return Array.from({ length: numSubtasks }, (_, i) => ({
      id: `demo-subtask-${Date.now()}-${i}`,
      title: `Subtask ${i + 1}`,
      completed: Math.random() > 0.5,
    }));
  };

  // Keyboard shortcuts configuration
  const shortcuts = [
    { 
      key: 'n', 
      description: 'Add new task',
      action: () => {
        const titleInput = document.querySelector('input[id="title"]') as HTMLInputElement;
        if (titleInput) titleInput.focus();
      }
    },
    { 
      key: 'a', 
      description: 'Toggle analytics',
      action: toggleAnalytics
    },
    { 
      key: 'f', 
      description: 'Focus search',
      action: () => {
        const searchInput = document.querySelector('input[placeholder="Search tasks..."]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
    },
    {
      key: 'c',
      description: 'Clear all filters',
      action: () => {
        setSearchQuery('');
        setFilters({ status: 'all', priority: 'all' });
      }
    }
  ];

  const completedTodos = todos.filter(todo => todo.completed).length;

  return (
    <>
      <Header title="Task Manager Pro" />
      
      <KeyboardShortcuts shortcuts={shortcuts} />
      
      <main className="app-content">
        <div className="max-w-4xl mx-auto">
          {/* Messages */}
          {error && (
            <div className="error-message slide-in mb-4">
              <AlertIcon className="mr-2" />
              {error}
            </div>
          )}
          
          {success && (
            <div className="success-message slide-in mb-4">
              <CheckIcon className="mr-2" />
              {success}
            </div>
          )}
          
          {/* Analytics Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleAnalytics}
              className="btn btn-outline"
            >
              {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
            </button>
          </div>
          
          {/* Analytics Dashboard */}
          <TaskAnalytics todos={todos} showAnalytics={showAnalytics} />
          
          {/* Add/Edit Todo Form */}
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="card-title">{editingTodo ? 'Edit Task' : 'Add New Task'}</h2>
              {editingTodo && (
                <button 
                  onClick={handleCancelEdit}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
              )}
            </div>
            
            <TodoForm 
              onSubmit={editingTodo ? updateTodo : addTodo}
              initialData={editingTodo ? {
                title: editingTodo.title,
                description: editingTodo.description || '',
                priority: editingTodo.priority || 'medium',
                dueDate: editingTodo.dueDate,
              } : undefined}
              isEditing={!!editingTodo}
            />
          </div>
          
          {/* Toolbar */}
          <TodoToolbar
            onSearch={handleSearch}
            onFilter={handleFilter}
            totalTodos={todos.length}
            completedTodos={completedTodos}
          />
          
          {/* Todo List */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Your Tasks</h2>
              <span className="text-sm text-gray-500">
                {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'} displayed
              </span>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="loading-spinner"></div>
                <span className="ml-2">Loading tasks...</span>
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {todos.length === 0 ? (
                  <p>No tasks yet. Add one above!</p>
                ) : (
                  <p>No tasks match your filters. Try adjusting your search or filters.</p>
                )}
              </div>
            ) : (
              <ul className="space-y-3 p-4">
                {filteredTodos.map((todo) => (
                  <Todo
                    key={todo.id}
                    id={todo.id}
                    title={todo.title}
                    description={todo.description}
                    completed={todo.completed}
                    createdAt={todo.createdAt}
                    priority={todo.priority}
                    dueDate={todo.dueDate}
                    tags={todo.tags}
                    subtasks={todo.subtasks}
                    onToggle={toggleTodo}
                    onDelete={confirmDeleteTodo}
                    onEdit={handleEditTodo}
                    onToggleSubtask={(subtaskId) => handleToggleSubtask(todo.id, subtaskId)}
                    onDeleteSubtask={(subtaskId) => handleDeleteSubtask(todo.id, subtaskId)}
                    onAddSubtask={(title) => handleAddSubtask(todo.id, title)}
                  />
                ))}
              </ul>
            )}
          </div>
          
          {/* Help text for keyboard shortcuts */}
          <div className="text-center text-xs text-gray-500 mt-4">
            Press <kbd className="kbd">?</kbd> to view keyboard shortcuts
          </div>
        </div>
      </main>
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
}
