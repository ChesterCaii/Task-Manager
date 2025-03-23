import React from 'react';
import { Todo, Priority } from './Todo';

interface TaskAnalyticsProps {
  todos: Todo[];
  showAnalytics: boolean;
}

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, colorClass }) => (
  <div className={`stat-card ${colorClass || ''}`}>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
    {trend && (
      <div className={`stat-trend ${trend.isPositive ? 'trend-up' : 'trend-down'}`}>
        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
      </div>
    )}
  </div>
);

export const TaskAnalytics: React.FC<TaskAnalyticsProps> = ({ todos, showAnalytics }) => {
  if (!showAnalytics) return null;
  
  // Calculate stats
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const incompleteTasks = totalTasks - completedTasks;
  const highPriorityTasks = todos.filter(todo => todo.priority === 'high').length;
  const overdueTasks = todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false;
    return new Date(todo.dueDate) < new Date();
  }).length;
  
  // Calculate completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Priority distribution
  const priorityCounts = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length,
  };
  
  // Due date stats
  const dueDateTasks = todos.filter(todo => todo.dueDate).length;
  const dueDateRate = totalTasks > 0 ? Math.round((dueDateTasks / totalTasks) * 100) : 0;
  
  // Average tasks per day for last week (mock data)
  const averageTasksPerDay = Math.round((totalTasks / 7) * 10) / 10;
  
  return (
    <div className="card animate-scale-in">
      <div className="card-header">
        <h2 className="card-title">Task Analytics</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Tasks" value={totalTasks} />
        <StatCard 
          label="Completion Rate" 
          value={`${completionRate}%`} 
          trend={{ value: 5, isPositive: true }}
          colorClass={completionRate > 50 ? "text-green-500" : "text-yellow-500"}
        />
        <StatCard 
          label="Overdue Tasks" 
          value={overdueTasks}
          colorClass={overdueTasks > 0 ? "text-red-500" : "text-green-500"}
        />
        <StatCard 
          label="High Priority" 
          value={highPriorityTasks}
          colorClass={highPriorityTasks > totalTasks * 0.3 ? "text-red-500" : "text-green-500"}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Priority Distribution</h3>
          <div className="flex h-8 w-full rounded-full overflow-hidden">
            {totalTasks > 0 ? (
              <>
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(priorityCounts.high / totalTasks) * 100}%` }}
                  title={`High: ${priorityCounts.high} tasks`}
                ></div>
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${(priorityCounts.medium / totalTasks) * 100}%` }}
                  title={`Medium: ${priorityCounts.medium} tasks`}
                ></div>
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(priorityCounts.low / totalTasks) * 100}%` }}
                  title={`Low: ${priorityCounts.low} tasks`}
                ></div>
              </>
            ) : (
              <div className="bg-gray-200 w-full"></div>
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-red-500 rounded-full mr-1"></span>
              High: {priorityCounts.high}
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-yellow-500 rounded-full mr-1"></span>
              Medium: {priorityCounts.medium}
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-green-500 rounded-full mr-1"></span>
              Low: {priorityCounts.low}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Task Status</h3>
          <div className="flex h-8 w-full rounded-full overflow-hidden">
            {totalTasks > 0 ? (
              <>
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                  title={`Completed: ${completedTasks} tasks`}
                ></div>
                <div 
                  className="bg-blue-500" 
                  style={{ width: `${((incompleteTasks - overdueTasks) / totalTasks) * 100}%` }}
                  title={`In Progress: ${incompleteTasks - overdueTasks} tasks`}
                ></div>
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(overdueTasks / totalTasks) * 100}%` }}
                  title={`Overdue: ${overdueTasks} tasks`}
                ></div>
              </>
            ) : (
              <div className="bg-gray-200 w-full"></div>
            )}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-green-500 rounded-full mr-1"></span>
              Completed: {completedTasks}
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-blue-500 rounded-full mr-1"></span>
              In Progress: {incompleteTasks - overdueTasks}
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-red-500 rounded-full mr-1"></span>
              Overdue: {overdueTasks}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 border-t border-gray-200 pt-4">
        <p>Average tasks added per day: <span className="font-medium">{averageTasksPerDay}</span></p>
        <p>Tasks with due dates: <span className="font-medium">{dueDateRate}%</span></p>
      </div>
    </div>
  );
}; 