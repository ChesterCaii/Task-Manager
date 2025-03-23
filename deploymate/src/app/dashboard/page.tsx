"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Task, TaskStatus } from '@/app/types/task';
import { useSocket } from '@/app/lib/socket/client';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const { socket, joinTaskRoom, leaveTaskRoom, emitTaskUpdate, onTaskUpdate } = useSocket();

  // Fetch tasks when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/auth/login');
            return;
          }
          throw new Error(data.error || 'Failed to fetch tasks');
        }

        setTasks(data.tasks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  // Set up WebSocket listeners
  useEffect(() => {
    if (socket) {
      // Join task rooms for all tasks
      tasks.forEach((task) => {
        joinTaskRoom(task.id);
      });

      // Listen for task updates
      onTaskUpdate((data) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === data.taskId ? { ...task, ...data.update } : task
          )
        );
      });

      // Cleanup on unmount
      return () => {
        tasks.forEach((task) => {
          leaveTaskRoom(task.id);
        });
      };
    }
  }, [socket, tasks, joinTaskRoom, leaveTaskRoom, onTaskUpdate]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create task');
      }

      // Add new task to the list
      setTasks([data.task, ...tasks]);
      
      // Clear form
      setNewTaskTitle('');
      setNewTaskDescription('');
      
      // Join the new task room
      joinTaskRoom(data.task.id);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update task');
      }

      // Update task in the list
      setTasks(
        tasks.map((task) => (task.id === taskId ? { ...task, status } : task))
      );

      // Emit task update via WebSocket
      emitTaskUpdate(taskId, { status });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete task');
      }

      // Remove task from the list
      setTasks(tasks.filter((task) => task.id !== taskId));
      
      // Leave the task room
      leaveTaskRoom(taskId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Task Dashboard</h1>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
          {error}
          <button
            className="ml-2 font-bold"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        <form onSubmit={handleCreateTask}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter task title"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Task
          </button>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">You have no tasks yet. Create one above!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.id} className="py-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                    {task.description && (
                      <p className="mt-1 text-gray-600">{task.description}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value as TaskStatus)
                      }
                      className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value={TaskStatus.PENDING}>Pending</option>
                      <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                      <option value={TaskStatus.COMPLETED}>Completed</option>
                    </select>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-red-600 hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 