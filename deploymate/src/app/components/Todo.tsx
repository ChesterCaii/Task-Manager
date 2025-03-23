import React, { useState } from 'react';
import { TrashIcon, EditIcon, CalendarIcon, FlagIcon, TagIcon } from './Icons';
import { SubtaskList, SubtaskType } from './Subtask';

export type Priority = 'low' | 'medium' | 'high';
export type Tag = { id: string; name: string; color: string };

interface TodoProps {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  priority?: Priority;
  dueDate?: string;
  tags?: Tag[];
  subtasks?: SubtaskType[];
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit?: (id: number) => void;
  onToggleSubtask?: (subtaskId: string) => void;
  onDeleteSubtask?: (subtaskId: string) => void;
  onAddSubtask?: (title: string) => void;
}

export const Todo: React.FC<TodoProps> = ({
  id,
  title,
  description,
  completed,
  createdAt,
  priority = 'medium',
  dueDate,
  tags = [],
  subtasks = [],
  onToggle,
  onDelete,
  onEdit,
  onToggleSubtask,
  onDeleteSubtask,
  onAddSubtask,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const getPriorityClass = (priority: Priority): string => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const isOverdue = (): boolean => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !completed;
  };

  const hasSubtasks = subtasks.length > 0;
  const completedSubtasks = subtasks.filter(subtask => subtask.completed).length;
  
  const handleToggle = () => {
    if (!completed) {
      setIsAnimating(true);
      setTimeout(() => {
        onToggle(id, completed);
        setIsAnimating(false);
      }, 500);
    } else {
      onToggle(id, completed);
    }
  };
  
  return (
    <li 
      className={`todo-item ${getPriorityClass(priority)} ${isHovered ? 'border-primary' : ''} ${completed ? 'opacity-75' : ''} ${isAnimating ? 'animate-complete' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 flex items-start">
        <input
          type="checkbox"
          checked={completed || isAnimating}
          onChange={handleToggle}
          className="todo-checkbox"
          aria-label={`Mark "${title}" as ${completed ? 'incomplete' : 'complete'}`}
        />
        <div className="todo-content">
          <div className="flex items-center mb-1">
            <h3 className={`font-medium text-lg ${completed ? 'completed' : ''}`}>
              {title}
            </h3>
            {isOverdue() && (
              <span className="status-badge status-overdue ml-2">Overdue</span>
            )}
            {completed && (
              <span className="status-badge status-completed ml-2">Completed</span>
            )}
          </div>
          
          {description && (
            <p className={`mt-1 text-sm ${completed ? 'completed' : 'text-gray-600'}`}>
              {description}
            </p>
          )}
          
          <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500">
            <span className="flex items-center mr-3">
              <CalendarIcon className="mr-1" />
              Created: {formatDate(createdAt)}
            </span>
            
            {dueDate && (
              <span className={`flex items-center mr-3 ${isOverdue() ? 'text-red-500 font-medium' : ''}`}>
                <CalendarIcon className="mr-1" />
                Due: {formatDate(dueDate)}
              </span>
            )}
            
            <span className="flex items-center">
              <FlagIcon className="mr-1" />
              Priority: <span className="font-medium ml-1 capitalize">{priority}</span>
            </span>
            
            {hasSubtasks && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="ml-3 text-blue-500 hover:text-blue-700 font-medium"
              >
                Subtasks: {completedSubtasks}/{subtasks.length}
              </button>
            )}
          </div>
          
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap">
              {tags.map(tag => (
                <span 
                  key={tag.id} 
                  className="tag"
                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                >
                  <TagIcon className="mr-1" />
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          
          {showSubtasks && hasSubtasks && onToggleSubtask && onDeleteSubtask && onAddSubtask && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <span className="mr-1">Subtasks</span>
                <span className="text-xs text-gray-500">({completedSubtasks}/{subtasks.length} completed)</span>
              </h4>
              <SubtaskList
                subtasks={subtasks}
                onToggleSubtask={onToggleSubtask}
                onDeleteSubtask={onDeleteSubtask}
                onAddSubtask={onAddSubtask}
                parentId={id}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {onEdit && (
          <button
            onClick={() => onEdit(id)}
            className="btn btn-icon"
            aria-label="Edit todo"
          >
            <EditIcon />
          </button>
        )}
        <button
          onClick={() => onDelete(id)}
          className="btn btn-icon btn-danger"
          aria-label="Delete todo"
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
};