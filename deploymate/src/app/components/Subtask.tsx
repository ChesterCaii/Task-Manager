import React from 'react';
import { CheckIcon, TrashIcon } from './Icons';

export interface SubtaskType {
  id: string;
  title: string;
  completed: boolean;
}

interface SubtaskProps {
  subtask: SubtaskType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const Subtask: React.FC<SubtaskProps> = ({
  subtask,
  onToggle,
  onDelete,
}) => {
  const { id, title, completed } = subtask;

  return (
    <div className="subtask-item">
      <input
        type="checkbox"
        checked={completed}
        onChange={() => onToggle(id)}
        className="todo-checkbox"
        aria-label={`Mark subtask "${title}" as ${completed ? 'incomplete' : 'complete'}`}
      />
      <span className={`ml-2 flex-1 ${completed ? 'completed' : ''}`}>{title}</span>
      <button
        onClick={() => onDelete(id)}
        className="btn btn-icon btn-danger ml-2"
        aria-label="Delete subtask"
      >
        <TrashIcon />
      </button>
    </div>
  );
};

interface SubtaskListProps {
  subtasks: SubtaskType[];
  onToggleSubtask: (id: string) => void;
  onDeleteSubtask: (id: string) => void;
  onAddSubtask: (title: string) => void;
  parentId: number;
}

export const SubtaskList: React.FC<SubtaskListProps> = ({
  subtasks,
  onToggleSubtask,
  onDeleteSubtask,
  onAddSubtask,
  parentId,
}) => {
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      onAddSubtask(newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  return (
    <div className="subtask-list">
      {subtasks.map(subtask => (
        <Subtask
          key={subtask.id}
          subtask={subtask}
          onToggle={onToggleSubtask}
          onDelete={onDeleteSubtask}
        />
      ))}
      
      <form onSubmit={handleAddSubtask} className="flex mt-2">
        <input
          type="text"
          placeholder="Add subtask..."
          value={newSubtaskTitle}
          onChange={(e) => setNewSubtaskTitle(e.target.value)}
          className="text-sm py-1 flex-1"
        />
        <button
          type="submit"
          className="btn btn-primary ml-2 py-1 px-2 text-sm"
          disabled={!newSubtaskTitle.trim()}
        >
          <CheckIcon className="mr-1" />
          Add
        </button>
      </form>
    </div>
  );
}; 